import { parseEther } from "@/lib/format";
import { graphClient } from "@/lib/graph";
import EthDater from "@landas/ethereum-block-by-date";
import { subDays, subMinutes } from "date-fns";
import { gql } from "graphql-request";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const CHAIN = mainnet;

/** Range in days */
const RANGE = 7;

const client = createPublicClient({ chain: CHAIN, transport: http() });

interface EthBlock {
  date: string;
  block: number;
  timestamp: number;
}

/**
 * @see `juice-interface:useProjectTimeline.ts`
 */
export async function getTimelineBlocks() {
  const dater = new EthDater(client);

  const now = subMinutes(new Date(), 5);
  const rangeStart = subDays(now, RANGE);

  const blockData = await Promise.all<[EthBlock, EthBlock]>([
    dater.getDate(rangeStart.toISOString()),
    dater.getDate(now.toISOString()),
  ]);

  const [start, end] = blockData;

  const blocks: Record<`block${number}`, number> = {
    block0: start.block,
  };
  const timestamps: number[] = [start.timestamp];

  // Calculate evenly distributed `count` (arbitrary) steps in between start and end. Timestamps are estimated and not guaranteed to match the actual timestamp for a block number, but this is good enough to show a trend.
  for (let i = 1; i < RANGE; i++) {
    const coeff = i / (RANGE - 1);

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

export async function getTimeline({
  projectVersion = "2",
  projectId,
  timelineBlocks,
}: {
  projectVersion?: string;
  projectId: number;
  timelineBlocks: Awaited<ReturnType<typeof getTimelineBlocks>>;
}) {
  const { blocks, timestamps } = timelineBlocks;

  const data: Record<`block${number}`, ProjectTLPart> =
    await graphClient.request(makeTimelineQuery(blocks), {
      id: `${projectVersion}-${projectId}`,
      ...blocks,
    });

  const points: ProjectTimelinePoint[] = [];

  for (let i = 0; i < RANGE; i++) {
    const point = data[`block${i}`];

    if (!point) continue;

    points.push({
      timestamp: timestamps[i],
      trendingScore: parseEther(BigInt(point.trendingScore)),
      balance: parseEther(BigInt(point.currentBalance)),
      volume: parseEther(BigInt(point.volume)),
    });
  }

  return points;
}
