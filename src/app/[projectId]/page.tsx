import { getProject } from "@/api/project";
import { APP_URL } from "@/lib/config";
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

  return <PaymentComponent projectId={projectId} />;
}
