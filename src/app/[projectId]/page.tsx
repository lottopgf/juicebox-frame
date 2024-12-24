import { getProject } from "@/api/project";
import { ActivitySectionContainer } from "@/app/[projectId]/components/ActivitySection";
import { Header } from "@/app/[projectId]/components/Header";
import { APP_URL } from "@/lib/config";
import { getCurrentCycle } from "@/lib/juicebox";
import { getCycleData } from "@/lib/rewards";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { PayForm } from "./components/pay-form/pay-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId: rawProjectId } = await params;
  const projectId = parseInt(rawProjectId);
  const project = await getProject({ projectId });

  return {
    title: project.metadata.name,
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${APP_URL}/${projectId}/frame-image`,
        button: {
          title: "Learn more & contribute",
          action: {
            type: "launch_frame",
            name: project.metadata.name,
            url: `${APP_URL}/${projectId}`,
            splashImageUrl: `${APP_URL}/splash.png`,
            splashBackgroundColor: "#16141d",
          },
        },
      }),
    },
  };
}

export default async function PaymentApp({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId: rawProjectId } = await params;
  const projectId = parseInt(rawProjectId);

  const project = await getProject({ projectId });

  const [currentCycle] = await getCurrentCycle(projectId);

  const cycleData = await getCycleData({
    projectId,
    cycleId: Number(currentCycle.number),
  });

  return (
    <div className={cn("min-h-full bg-slate-900 text-gray-100")}>
      <Header projectId={projectId} project={project} />
      <div className="mx-auto max-w-prose space-y-6 px-4 pb-4">
        <PayForm
          projectId={projectId}
          project={project}
          cycleData={cycleData}
        />
        <ActivitySectionContainer projectId={projectId} />
      </div>
    </div>
  );
}
