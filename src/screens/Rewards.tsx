/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { Title } from "@/components/Title";
import { CACHE_TIME } from "@/lib/config";
import { getProjectId } from "@/lib/parameters";
import { COLOR_BG_PEEL_200, COLOR_BG_PEEL_500 } from "@/styles/colors";
import { Button, type FrameContext, type ImageContext } from "frog";

export async function RewardsImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  return ctx.res({
    headers: {
      "Cache-Control": `public, max-age=${CACHE_TIME}`,
    },
    image: (
      <Container tw={COLOR_BG_PEEL_500}>
        <Header page="About" tw={COLOR_BG_PEEL_200} />

        <Content>
          <Title>{data.metadata.name}</Title>

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
