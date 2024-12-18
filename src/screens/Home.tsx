/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key, @next/next/no-img-element */

import { getProject } from "@/api/project";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { Title } from "@/components/Title";
import { TokenRewards } from "@/components/TokenRewards";
import { IconEthereum } from "@/graphics/IconEthereum";
import { IconJuicebox } from "@/graphics/IconJuicebox";
import { CACHE_TIME } from "@/lib/config";
import { formatEther, formatExcerpt } from "@/lib/format";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { getTrendingPercentage } from "@/lib/juicebox";
import { getProjectId } from "@/lib/parameters";
import {
  COLOR_BG_SPLIT,
  COLOR_BG_SPLIT_DARK,
  COLOR_BG_SPLIT_LIGHT,
  COLOR_TEXT_SPLIT,
} from "@/styles/colors";
import { Button, type FrameContext, type ImageContext } from "frog";
import { twMerge } from "tailwind-merge";

export async function HomeScreen(ctx: FrameContext) {
  const projectId = getProjectId(ctx);

  const hasRewards = await getProject({ projectId }).then(
    (data) => data.nftCollections.length > 0,
  );

  return ctx.res({
    image: `/${projectId}/images/home`,
    intents: [
      <Button action={`/${projectId}/activity`}>Activity</Button>,
      <Button action={`/${projectId}/about`}>About</Button>,
      hasRewards && <Button action={`/${projectId}/rewards`}>Rewards</Button>,
    ],
  });
}

export async function HomeImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);

  const projectData = await getProject({ projectId });

  const { latestFundingCycle, metadata, paymentsCount, volume } = projectData;

  const trendingPercentage = getTrendingPercentage({
    totalVolume: projectData.volume,
    trendingVolume: projectData.trendingVolume,
  });

  const logoURL = ipfsURL(cidFromURL(projectData.metadata.logoUri));

  const tagLine =
    metadata.projectTagline ?? formatExcerpt(metadata.description);

  return ctx.res({
    headers: {
      "Cache-Control": `public, max-age=${CACHE_TIME}`,
    },
    image: (
      <Container tw={twMerge("text-neutral-900", COLOR_BG_SPLIT_LIGHT)}>
        <Header tw={COLOR_BG_SPLIT} />
        <Content style={{ gap: 24 }}>
          <div tw="-ml-[6px] -mt-[94px] flex h-[348px] w-[348px] rounded-3xl bg-black p-[6px] text-white">
            {logoURL ? (
              <img
                src={logoURL}
                width={336}
                height={336}
                alt=""
                tw="rounded-2xl"
                style={{ objectFit: "cover" }}
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

          <Title tw="mb-0">{metadata.name}</Title>

          <span>{tagLine}</span>
        </Content>
        <div
          tw={twMerge(
            "flex h-[115px] items-center justify-center px-12 text-[56px] leading-none",
            COLOR_BG_SPLIT,
            COLOR_TEXT_SPLIT,
          )}
          style={{ gap: 8, fontFamily: "Agrandir" }}
        >
          <IconEthereum tw="h-[56px] w-[56px]" />
          <span>{formatEther(volume)} ETH raised</span>
        </div>
        <TokenRewards
          projectId={projectId}
          cycleId={latestFundingCycle}
          tw={COLOR_BG_SPLIT_DARK}
        />
      </Container>
    ),
  });
}
