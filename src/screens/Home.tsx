/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key, @next/next/no-img-element */

import { getProject } from "@/api/project";
import { Container } from "@/components/Container";
import { TokenRewards } from "@/components/TokenRewards";
import { IconArrow } from "@/graphics/IconArrow";
import { IconEthereum } from "@/graphics/IconEthereum";
import { LogoJuicebox } from "@/graphics/LogoJuicebox";
import { formatEther, formatExcerpt, formatRichText } from "@/lib/format";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { getTrendingPercentage } from "@/lib/juicebox";
import { getProjectId } from "@/lib/parameters";
import {
  COLOR_BG_SPLIT,
  COLOR_BG_SPLIT_DARK,
  COLOR_BG_SPLIT_LIGHT,
  COLOR_TEXT_SPLIT,
} from "@/styles/colors";
import { Button, FrameContext, type ImageContext } from "frog";
import { twMerge } from "tailwind-merge";

export async function HomeScreen(ctx: FrameContext) {
  const projectId = getProjectId(ctx);

  return ctx.res({
    image: `/${projectId}/images/home`,
    intents: [
      <Button action={`/${projectId}/activity`}>Activity</Button>,
      <Button action={`/${projectId}/about`}>About</Button>,
      <Button action={`/${projectId}/rewards`}>Rewards</Button>,
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
    image: (
      <Container tw="text-neutral-900">
        <div
          tw={twMerge(
            "h-[132px] flex-shrink-0 flex justify-end items-center w-full px-9",
            COLOR_BG_SPLIT
          )}
          style={{ fontFamily: "Agrandir" }}
        >
          <IconArrow tw="w-[60px] h-[60px]" />
          <span tw="ml-3 mr-6 text-[42px]">view on</span>
          <LogoJuicebox tw="w-[220px] h-[50px]" />
        </div>
        <div
          tw={twMerge(
            "relative flex-1 flex flex-col p-9",
            COLOR_BG_SPLIT_LIGHT
          )}
          style={{ gap: 24 }}
        >
          {!!logoURL && (
            <img
              src={logoURL}
              tw="w-[336px] h-[336px] -mt-[132px] border-black bg-black border-[6px] rounded-3xl"
              alt=""
            />
          )}
          <div
            tw={twMerge(
              "flex text-right justify-end",
              !!logoURL && "absolute right-9 top-9"
            )}
            style={{ fontFamily: "Agrandir", gap: 48 }}
          >
            <div tw="flex flex-col items-end">
              <span tw={twMerge("uppercase text-4xl", COLOR_TEXT_SPLIT)}>
                Payments
              </span>
              <span tw="text-[54px]">
                {paymentsCount.toLocaleString("en-US")}
              </span>
            </div>
            {trendingPercentage !== Infinity && (
              <div tw="flex flex-col items-end">
                <span tw={twMerge("uppercase text-4xl", COLOR_TEXT_SPLIT)}>
                  Last 7 days
                </span>
                <span tw="text-[54px]">
                  +{trendingPercentage.toLocaleString("en-US")}%
                </span>
              </div>
            )}
          </div>

          <span tw="text-7xl font-medium" style={{ fontFamily: "Agrandir" }}>
            {metadata.name}
          </span>

          <span tw="text-[42px] font-normal leading-[1.2]">{tagLine}</span>
        </div>
        <div
          tw={twMerge(
            "flex items-center justify-center px-9 py-[27px] text-6xl",
            COLOR_BG_SPLIT,
            COLOR_TEXT_SPLIT
          )}
          style={{ gap: 12, fontFamily: "Agrandir" }}
        >
          <IconEthereum tw="w-[60px] h-[60px]" />
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
