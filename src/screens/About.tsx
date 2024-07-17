/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { getProjectId } from "@/lib/parameters";
import { Button, FrameContext, type ImageContext } from "frog";
import sanitize from "sanitize-html";

export async function AboutImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  return ctx.res({
    image: (
      <Container>
        <Header project={data.metadata.name} page="About" />

        <div
          tw="flex-1 px-8 py-6 bg-[#16141D] text-4xl leading-normal"
          style={{ display: "block", lineClamp: 12 }}
        >
          {sanitize(data.metadata.description, {
            allowedTags: [],
            allowedAttributes: {},
          })}
        </div>
      </Container>
    ),
  });
}

export async function AboutScreen(ctx: FrameContext) {
  const projectId = getProjectId(ctx);

  return ctx.res({
    image: `/${projectId}/images/about`,
    intents: [
      <BackButton id={projectId} />,
      <Button action={`/${projectId}/activity`}>Activity</Button>,
      <Button action={`/${projectId}/rewards`}>Rewards</Button>,
    ],
  });
}
