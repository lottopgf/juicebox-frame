/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key */

import { getProject } from "@/api/project";
import { getTimeline, getTimelineBlocks } from "@/api/timeline";
import { BackButton } from "@/components/BackButton";
import { renderChart } from "@/components/Chart";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { getProjectId } from "@/lib/parameters";
import { COLOR_BG_MELON_200, COLOR_BG_MELON_500 } from "@/styles/colors";
import { Button, FrameContext, type ImageContext } from "frog";
import parse from "html-react-parser";
import { twMerge } from "tailwind-merge";

const honoJSX = require("hono/jsx");

export async function ActivityImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const data = await getProject({ projectId });

  const timelineBlocks = await getTimelineBlocks();
  const points = await getTimeline({
    projectId,
    timelineBlocks,
  });

  const chart = await renderChart(
    points.map((point) => ({
      timestamp: point.timestamp,
      value: point.volume,
    })),
  );
  const chartElem = parse(chart ?? "", {
    library: honoJSX,
  });

  console.log(chart);

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
