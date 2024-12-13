"use client";

import type { getTimeline } from "@/api/timeline";
import { IconEthereum } from "@/app/[projectId]/graphics/IconEthereum";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Activity</h2>
        <Link href="/activity" className="inline-flex items-center gap-1">
          View more on juicebox.money
          <ExternalLinkIcon size="1em" />
        </Link>
      </header>
      <div className="border-grey-200 rounded-lg border border-slate-600 bg-slate-700 p-4 shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)]">
        <ChartContainer className="min-h-[100px]" config={chartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{ left: 0 }}>
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
      </div>
    </section>
  );
}
