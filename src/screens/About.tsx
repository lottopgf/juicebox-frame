/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { formatRichText } from "@/lib/format";
import { getProjectId } from "@/lib/parameters";
import { COLOR_BG_BLUEBS_200, COLOR_BG_BLUEBS_500 } from "@/styles/colors";
import { Button, FrameContext, type ImageContext } from "frog";

export async function AboutImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  return ctx.res({
    image: (
      <Container tw={COLOR_BG_BLUEBS_200}>
        <Header page="About" tw={COLOR_BG_BLUEBS_500} />

        <Content>
          <div
            tw="mb-9 text-7xl font-medium leading-none"
            style={{ fontFamily: "Agrandir", display: "block", lineClamp: 2 }}
          >
            {data.metadata.name}
          </div>

          <div style={{ display: "block", lineClamp: 10 }}>
            {formatRichText(data.metadata.description)}
          </div>
        </Content>
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
