"use server";

import { CACHE_TIME, client, TIMELINE_RANGE_IN_DAYS } from "@/lib/config";
import { parseEther } from "@/lib/format";
import { graphClient } from "@/lib/graph";
import EthDater from "@landas/ethereum-block-by-date";
import { subDays, subMinutes } from "date-fns";
import { gql } from "graphql-request";
import { unstable_cache } from "next/cache";

interface EthBlock {
  date: string;
  block: number;
  timestamp: number;
}

const cachedTimelineBlocksRequest = unstable_cache(
  ({ start, end }: { start: Date; end: Date }) => {
    const dater = new EthDater(client);

    return Promise.all<[EthBlock, EthBlock]>([
      dater.getDate(start.toISOString()),
      dater.getDate(end.toISOString()),
    ]);
  },
  ["timeline-blocks"],
  { revalidate: CACHE_TIME },
);

/**
 * @see `juice-interface:useProjectTimeline.ts`
 */
export async function getTimelineBlocks() {
  const now = subMinutes(new Date(), 5);
  const rangeStart = subDays(now, TIMELINE_RANGE_IN_DAYS);

  const [start, end] = await cachedTimelineBlocksRequest({
    start: rangeStart,
    end: now,
  });

  const blocks: Record<`block${number}`, number> = {
    block0: start.block,
  };
  const timestamps: number[] = [start.timestamp];

  // Calculate evenly distributed `count` (arbitrary) steps in between start and end. Timestamps are estimated and not guaranteed to match the actual timestamp for a block number, but this is good enough to show a trend.
  for (let i = 1; i < TIMELINE_RANGE_IN_DAYS; i++) {
    const coeff = i / (TIMELINE_RANGE_IN_DAYS - 1);

    blocks[`block${i}`] = Math.round(
      (end.block - start.block) * coeff + start.block,
    );
    timestamps.push(
      Math.round((end.timestamp - start.timestamp) * coeff + start.timestamp),
    );
  }

  return { blocks, timestamps };
}

function makeTimelineQuery(blocks: Record<`block${number}`, number>) {
  return gql`
    query ProjectTL(
      $id: ID!
      ${Object.keys(blocks)
        .map((key) => `$${key}: Int`)
        .join("\n")}
    ) {
      ${Object.keys(blocks)
        .map(
          (key) => `${key}: project(id: $id, block: { number: $${key} }) {
        ...ProjectTLParts
        __typename
      }`,
        )
        .join("\n")}
    }

    fragment ProjectTLParts on Project {
      currentBalance
      volume
      trendingScore
      __typename
    }
  `;
}

interface ProjectTLPart {
  currentBalance: string;
  volume: string;
  trendingScore: string;
}

interface ProjectTimelinePoint {
  timestamp: number;
  trendingScore: number;
  balance: number;
  volume: number;
}

interface GetTimelineParams {
  projectVersion?: string;
  projectId: number;
  timelineBlocks: Awaited<ReturnType<typeof getTimelineBlocks>>;
}

const cachedTimelineRequest = unstable_cache(
  ({
    projectVersion = "2",
    projectId,
    timelineBlocks,
  }: GetTimelineParams): Promise<Record<`block${number}`, ProjectTLPart>> =>
    graphClient.request(makeTimelineQuery(timelineBlocks.blocks), {
      id: `${projectVersion}-${projectId}`,
      ...timelineBlocks.blocks,
    }),
  ["timeline"],
  { revalidate: CACHE_TIME },
);

export async function getTimeline(params: GetTimelineParams) {
  const data = await cachedTimelineRequest(params);

  const points: ProjectTimelinePoint[] = [];

  for (let i = 0; i < TIMELINE_RANGE_IN_DAYS; i++) {
    const point = data[`block${i}`];

    if (!point) continue;

    points.push({
      timestamp: params.timelineBlocks.timestamps[i]!,
      trendingScore: parseEther(BigInt(point.trendingScore)),
      balance: parseEther(BigInt(point.currentBalance)),
      volume: parseEther(BigInt(point.volume)),
    });
  }

  return points;
}
