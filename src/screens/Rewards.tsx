/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { getProjectId } from "@/lib/parameters";
import { COLOR_BG_PEEL_200, COLOR_BG_PEEL_500 } from "@/styles/colors";
import { Button, FrameContext, type ImageContext } from "frog";

export async function RewardsImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  return ctx.res({
    image: (
      <Container tw={COLOR_BG_PEEL_500}>
        <Header page="About" tw={COLOR_BG_PEEL_200} />

        <Content>
          <div
            tw="mb-9 text-7xl font-medium leading-none"
            style={{ fontFamily: "Agrandir", display: "block", lineClamp: 2 }}
          >
            {data.metadata.name}
          </div>

          <div style={{ display: "block", lineClamp: 10 }}>
            Reward information here 🎁
          </div>
        </Content>
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
