/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key */

import { getProject } from "@/api/project";
import { getTimeline, getTimelineBlocks } from "@/api/timeline";
import { BackButton } from "@/components/BackButton";
import { renderChart } from "@/components/Chart";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { Title } from "@/components/Title";
import { CACHE_TIME } from "@/lib/config";
import { getProjectId } from "@/lib/parameters";
import { COLOR_BG_MELON_200, COLOR_BG_MELON_500 } from "@/styles/colors";
import { Button, type FrameContext, type ImageContext } from "frog";
import honoJSX from "hono/jsx";
import parse from "html-react-parser";
import { twMerge } from "tailwind-merge";

export async function ActivityImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });
  const timelineBlocks = await getTimelineBlocks();
  const points = await getTimeline({ projectId, timelineBlocks });

  const chart = await renderChart(
    points.map((point) => ({
      timestamp: point.timestamp,
      value: point.volume,
    })),
  );
  const chartElem = parse(chart ?? "", {
    // @ts-ignore Confirmed it working, but typescript is just not happy :^)
    library: honoJSX,
  });

  return ctx.res({
    headers: {
      "Cache-Control": `public, max-age=${CACHE_TIME}`,
    },
    image: (
      <Container tw={COLOR_BG_MELON_200}>
        <Header
          tw={twMerge("text-black", COLOR_BG_MELON_500)}
          page="Activity"
        />
        <Content tw="justify-between">
          <Title>{data.metadata.name}</Title>
          <div tw="flex items-center justify-center">{chartElem}</div>
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
