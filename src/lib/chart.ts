import { getTimeline, getTimelineBlocks } from "@/api/timeline";
import { renderChart } from "@/components/Chart";

export async function makeChart({
  projectId,
  width,
  height,
}: {
  projectId: number;
  width?: number;
  height?: number;
}) {
  const timelineBlocks = await getTimelineBlocks();
  const points = await getTimeline({ projectId, timelineBlocks });

  const chart = await renderChart(
    points.map((point) => ({
      timestamp: point.timestamp,
      value: point.volume,
    })),
    {
      width,
      height,
    },
  );

  return chart;
}
