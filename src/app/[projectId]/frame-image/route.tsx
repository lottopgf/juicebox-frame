import { makeImage } from "@/app/[projectId]/frame-image/makeImage";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 800,
};

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  return makeImage({
    projectId: parseInt((await params).projectId),
    size,
  });
}
