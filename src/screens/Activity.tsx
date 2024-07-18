/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { getProjectId } from "@/lib/parameters";
import { COLOR_BG_MELON_200, COLOR_BG_MELON_500 } from "@/styles/colors";
import { Button, FrameContext, type ImageContext } from "frog";
import { twMerge } from "tailwind-merge";

export async function ActivityImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  return ctx.res({
    image: (
      <Container tw={COLOR_BG_MELON_200}>
        <Header
          tw={twMerge("text-black", COLOR_BG_MELON_500)}
          page="Activity"
        />
        <Content>
          <div
            tw="mb-9 text-7xl font-medium leading-none"
            style={{ fontFamily: "Agrandir", display: "block", lineClamp: 2 }}
          >
            {data.metadata.name}
          </div>
          <div>Volume chart here 📈</div>
        </Content>
      </Container>
    ),
  });
}

export async function ActivityScreen(ctx: FrameContext) {
  const projectId = getProjectId(ctx);

  return ctx.res({
    image: `/${projectId}/images/activity`,
    intents: [
      <BackButton id={projectId} />,
      <Button action={`/${projectId}/about`}>About</Button>,
      <Button action={`/${projectId}/rewards`}>Rewards</Button>,
    ],
  });
}
