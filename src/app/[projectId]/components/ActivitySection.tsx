"use client";

import { getTimeline, getTimelineBlocks } from "@/api/timeline";
import { IconEthereum } from "@/app/[projectId]/graphics/IconEthereum";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { extent, scaleUtc, utcFormat } from "d3";
import { fromUnixTime } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type XAxisProps,
  type YAxisProps,
} from "recharts";

const chartConfig = {
  timestamp: {
    label: "Timestamp",
    color: "hsl(var(--chart-1))",
  },
  value: {
    label: "Amount",
    color: "hsl(var(--chart-2))",
    icon: () => <IconEthereum />,
  },
} satisfies ChartConfig;

type ProjectTimelinePoint = Awaited<ReturnType<typeof getTimeline>>[number];

export function ActivitySection({ data }: { data: ProjectTimelinePoint[] }) {
  const chartData = data.map((point) => ({
    timestamp: point.timestamp,
    value: point.volume,
  }));

  const xScale = scaleUtc().domain(
    extent(data, (d) => d.timestamp) as [number, number],
  );

  const xAxisArgs: XAxisProps = {
    domain: xScale.domain().map((date) => date.valueOf()),
    range: xScale.range(),
    scale: xScale,
    type: "number",
    ticks: xScale.ticks(7).map((date) => date.valueOf()),
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    tickFormatter: (value) => utcFormat("%-m/%-d")(fromUnixTime(value)),
  };

  const yAxisArgs: YAxisProps = {
    type: "number",
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    tickFormatter: (value) => `Ξ${value}`,
  };

  return (
    <ChartContainer className="aspect-[3/2] w-full" config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 8, right: 8 }}
      >
        <CartesianGrid stroke="rgba(1,1,1,0.2)" vertical={false} />
        <XAxis dataKey="timestamp" {...xAxisArgs} />
        <YAxis dataKey="value" {...yAxisArgs} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                utcFormat("%-m/%-d")(
                  fromUnixTime(payload.at(0)?.payload.timestamp),
                )
              }
            />
          }
        />
        <Line
          dataKey="value"
          type="monotoneX"
          stroke="orange"
          strokeWidth={4}
          strokeLinecap="round"
          dot={false}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function ActivitySectionSkeleton() {
  return (
    <div className="aspect-[3/2] w-full animate-pulse rounded-lg bg-slate-700" />
  );
}

export function ActivitySectionContainer({ projectId }: { projectId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["timeline", { projectId }],
    async queryFn() {
      const timelineBlocks = await getTimelineBlocks();
      return await getTimeline({ projectId, timelineBlocks });
    },
  });

  return (
    <section className="space-y-4">
      <div className="border-grey-200 space-y-4 rounded-lg border border-slate-600 bg-slate-700 p-4 shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)]">
        <header className="flex items-center justify-between text-slate-100">
          <h2 className="text-2xl font-medium">Activity</h2>
          <Link
            href={`https://juicebox.money/v2/p/${projectId}?tabid=activity`}
            target="_top"
            className="flex items-center gap-1 text-sm font-medium text-slate-200"
          >
            See more <ExternalLinkIcon className="size-4" />
          </Link>
        </header>
        {isLoading ? (
          <ActivitySectionSkeleton />
        ) : (
          <ActivitySection data={data ?? []} />
        )}
      </div>
    </section>
  );
}
