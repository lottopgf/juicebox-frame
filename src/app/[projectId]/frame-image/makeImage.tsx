import { ipfsURL } from "@/lib/ipfs";
import { getCurrentCycle } from "@/lib/juicebox";

import { getCycle } from "@/api/cycle";
import { getProject } from "@/api/project";
import { Container } from "@/app/[projectId]/frame-image/components/Container";
import { Content } from "@/app/[projectId]/frame-image/components/Content";
import { Header } from "@/app/[projectId]/frame-image/components/Header";
import { Title } from "@/app/[projectId]/frame-image/components/Title";
import { TokenRewards } from "@/app/[projectId]/frame-image/components/TokenRewards";
import { IconEthereum } from "@/app/[projectId]/frame-image/graphics/IconEthereum";
import { IconJuicebox } from "@/app/[projectId]/frame-image/graphics/IconJuicebox";
import { formatEther, formatExcerpt } from "@/lib/format";
import { cidFromURL } from "@/lib/ipfs";
import { getTrendingPercentage } from "@/lib/juicebox";
import {
  COLOR_BG_SPLIT,
  COLOR_BG_SPLIT_DARK,
  COLOR_BG_SPLIT_LIGHT,
  COLOR_TEXT_SPLIT,
} from "@/styles/colors";
import { ImageResponse } from "next/og";
import { twMerge } from "tailwind-merge";

export async function makeImage({
  projectId,
  size,
}: {
  projectId: number;
  size: { width: number; height: number };
}) {
  const agrandir = await fetch(
    new URL("./fonts/PPAgrandir-Medium.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const beatrice = await fetch(
    new URL("./fonts/Beatrice-Regular.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const projectData = await getProject({ projectId });

  const { metadata, paymentsCount, volume } = projectData;

  const trendingPercentage = getTrendingPercentage({
    totalVolume: projectData.volume,
    trendingVolume: projectData.trendingVolume,
  });

  const [currentCycle] = await getCurrentCycle(projectId);

  const cycleData = await getCycle({
    projectId,
    cycleId: Number(currentCycle.number),
  });

  const logoURL = ipfsURL(cidFromURL(projectData.metadata.logoUri));

  const tagLine =
    metadata.projectTagline ?? formatExcerpt(metadata.description);

  return new ImageResponse(
    (
      <Container tw={twMerge("text-neutral-900", COLOR_BG_SPLIT_LIGHT)}>
        <Header tw={COLOR_BG_SPLIT} />
        <Content style={{ gap: 24 }}>
          <div tw="-ml-[6px] -mt-[106px] flex h-[256px] w-[256px] rounded-3xl bg-black p-[6px] text-white">
            {logoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoURL}
                alt=""
                tw="rounded-2xl"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <IconJuicebox tw="m-auto h-48 w-48 opacity-10" />
            )}
          </div>

          <div
            tw={"absolute right-12 top-6 flex justify-end text-right"}
            style={{ fontFamily: "Agrandir", gap: 48 }}
          >
            <div tw="flex flex-col items-end">
              <span tw={twMerge("text-3xl uppercase", COLOR_TEXT_SPLIT)}>
                Payments
              </span>
              <span tw="text-5xl leading-snug">
                {paymentsCount.toLocaleString("en-US")}
              </span>
            </div>
            <div tw="flex flex-col items-end">
              <span tw={twMerge("text-3xl uppercase", COLOR_TEXT_SPLIT)}>
                Total Raised
              </span>
              <span tw="flex items-center text-5xl leading-snug">
                {formatEther(volume)}
                <IconEthereum tw="h-[32px] w-[32px]" />
              </span>
            </div>
            {trendingPercentage !== Infinity && (
              <div tw="flex flex-col items-end">
                <span tw={twMerge("text-3xl uppercase", COLOR_TEXT_SPLIT)}>
                  Last 7 days
                </span>
                <span tw="text-5xl leading-snug">
                  +{trendingPercentage.toLocaleString("en-US")}%
                </span>
              </div>
            )}
          </div>

          <Title>{metadata.name}</Title>

          <div style={{ display: "block", lineClamp: 2 }}>{tagLine}</div>
        </Content>
        <TokenRewards cycleData={cycleData} tw={COLOR_BG_SPLIT_DARK} />
      </Container>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=3600",
      },
      fonts: [
        {
          name: "Agrandir",
          data: agrandir,
          weight: 500,
        },
        {
          name: "Beatrice",
          data: beatrice,
          weight: 400,
        },
      ],
    },
  );
}
