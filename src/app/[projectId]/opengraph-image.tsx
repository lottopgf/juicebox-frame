import { makeImage } from "@/app/[projectId]/frame-image/makeImage";

// Image metadata
export const alt = "Juicebox Project";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const runtime = "edge";

// Image generation
export default async function Image({
  params,
}: {
  params: { projectId: string };
}) {
  return makeImage({ projectId: parseInt(params.projectId), size });
}
