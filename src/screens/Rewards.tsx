/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { getProjectId } from "@/lib/parameters";
import { Button, FrameContext, type ImageContext } from "frog";

export async function RewardsImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  return ctx.res({
    image: (
      <Container>
        <Header project={data.metadata.name} page="Rewards" />
        <div tw="flex-1 px-8 py-6 bg-[#16141D] text-4xl leading-normal">
          Reward information here 🃏
        </div>
      </Container>
    ),
  });
}

export async function RewardsScreen(ctx: FrameContext) {
  const projectId = getProjectId(ctx);

  return ctx.res({
    image: `/${projectId}/images/rewards`,
    intents: [
      <BackButton id={projectId} />,
      <Button action={`/${projectId}/about`}>About</Button>,
      <Button action={`/${projectId}/activity`}>Activity</Button>,
    ],
  });
}
