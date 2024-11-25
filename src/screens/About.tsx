/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { Title } from "@/components/Title";
import { CACHE_TIME } from "@/lib/config";
import { formatRichText } from "@/lib/format";
import { getProjectId } from "@/lib/parameters";
import { COLOR_BG_BLUEBS_200, COLOR_BG_BLUEBS_500 } from "@/styles/colors";
import { Button, type FrameContext, type ImageContext } from "frog";

export async function AboutImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  return ctx.res({
    headers: {
      "Cache-Control": `public, max-age=${CACHE_TIME}`,
    },
    image: (
      <Container tw={COLOR_BG_BLUEBS_200}>
        <Header page="About" tw={COLOR_BG_BLUEBS_500} />

        <Content tw="justify-between">
          <Title>{data.metadata.name}</Title>
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

  const hasRewards = await getProject({ projectId }).then(
    (data) => data.nftCollections.length > 0,
  );

  return ctx.res({
    image: `/${projectId}/images/about`,
    intents: [
      <BackButton id={projectId} />,
      <Button action={`/${projectId}/activity`}>Activity</Button>,
      hasRewards && <Button action={`/${projectId}/rewards`}>Rewards</Button>,
    ],
  });
}
