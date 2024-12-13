import { getProject } from "@/api/project";
import { ActivitySectionContainer } from "@/app/[projectId]/activity/component";
import { Header } from "@/app/[projectId]/components/Header";
import { APP_URL } from "@/lib/config";
import { getTokenRewards } from "@/lib/rewards";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { PaymentComponent } from "./component";

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
        imageUrl: `${APP_URL}/${projectId}/images/home`,
        button: {
          title: "Learn more & contribute",
          action: {
            type: "launch_frame",
            name: "Juicebox Frame",
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

  const tokenRewards = await getTokenRewards({
    projectId,
    cycleId: project.latestFundingCycle,
  });

  return (
    <div className={cn("min-h-full bg-slate-900 text-gray-100")}>
      <Header projectId={projectId} project={project} />
      <div className="mx-auto max-w-prose space-y-4 px-4 pb-4">
        <PaymentComponent
          projectId={projectId}
          project={project}
          tokenRewards={tokenRewards}
        />
        <ActivitySectionContainer projectId={projectId} />
      </div>
    </div>
  );
}
