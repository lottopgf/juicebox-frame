import { getProject } from "@/api/project";
import { getTimeline, getTimelineBlocks } from "@/api/timeline";
import { ActivitySection } from "@/app/[projectId]/activity/component";
import { Header } from "@/app/[projectId]/components/Header";
import { cn } from "@/lib/utils";
import { COLOR_BG_SPLIT_LIGHT } from "@/styles/colors";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId: rawProjectId } = await params;
  const projectId = parseInt(rawProjectId);
  const project = await getProject({ projectId });

  const timelineBlocks = await getTimelineBlocks();
  const points = await getTimeline({ projectId, timelineBlocks });

  return (
    <div className={cn("min-h-full text-neutral-900", COLOR_BG_SPLIT_LIGHT)}>
      <Header projectId={projectId} project={project} />
      <div className="mx-auto max-w-prose px-4">
        <ActivitySection data={points} />
      </div>
    </div>
  );
}
