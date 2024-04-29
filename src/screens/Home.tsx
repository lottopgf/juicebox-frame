/** @jsxImportSource frog/jsx */
/* eslint-disable @next/next/no-img-element */

import { getCycle } from "@/api/cycle";
import { getProject } from "@/api/project";
import { Container } from "@/components/Container";
import { IconArrow } from "@/graphics/IconArrow";
import { IconEthereum } from "@/graphics/IconEthereum";
import { LogoJuicebox } from "@/graphics/LogoJuicebox";
import { formatEther } from "@/lib/format";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { getTokensPerEth, getTrendingPercentage } from "@/lib/juicebox";
import {
  COLOR_BG_SPLIT,
  COLOR_BG_SPLIT_DARK,
  COLOR_BG_SPLIT_LIGHT,
  COLOR_TEXT_SPLIT,
} from "@/styles/colors";
import { Button, FrameContext } from "frog";
import { twMerge } from "tailwind-merge";

export async function Home({ ctx, id }: { ctx: FrameContext; id: number }) {
  const projectData = await getProject({ projectId: id });

  const { latestFundingCycle, metadata, paymentsCount, volume } = projectData;

  const cycleData = await getCycle({
    projectId: id,
    cycleId: latestFundingCycle,
  });

  const tokensPerEth = getTokensPerEth({
    reservedRate: cycleData.reservedRate,
    weight: cycleData.weight,
  });

  const trendingPercentage = getTrendingPercentage({
    totalVolume: projectData.volume,
    trendingVolume: projectData.trendingVolume,
  });

  const logoURL = ipfsURL(cidFromURL(projectData.metadata.logoUri));

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
            "relative flex-1 flex flex-col px-9",
            COLOR_BG_SPLIT_LIGHT
          )}
        >
          <img
            src={logoURL}
            tw="w-[336px] h-[336px] -mt-[96px] mb-9 border-black bg-black border-[6px] rounded-3xl"
            alt=""
          />
          <div
            tw="absolute right-9 top-9 flex text-right"
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

          <span
            tw="mb-6 text-7xl font-medium"
            style={{ fontFamily: "Agrandir" }}
          >
            {metadata.name}
          </span>

          <span tw="text-[42px] font-normal leading-[1.2]">
            {metadata.projectTagline}
          </span>
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
        {tokensPerEth > 0n && (
          <div
            tw={twMerge(
              "flex-shrink-0 flex justify-center w-full px-8 py-6 text-5xl text-center",
              COLOR_BG_SPLIT_DARK
            )}
          >
            Receive {formatEther(tokensPerEth)} tokens per ETH paid
          </div>
        )}
      </Container>
    ),
    intents: [
      <Button key="activity" action={`/${id}/activity`}>
        Activity
      </Button>,
      <Button key="about" action={`/${id}/about`}>
        About
      </Button>,
      <Button key="rewards" action={`/${id}/rewards`}>
        Rewards
      </Button>,
    ],
  });
}
