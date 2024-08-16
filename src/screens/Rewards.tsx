/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key, @next/next/no-img-element */

import { getProject } from "@/api/project";
import { resolveRewards } from "@/api/rewards";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import { Title } from "@/components/Title";
import { TokenRewards } from "@/components/TokenRewards";
import { IconEthereum } from "@/graphics/IconEthereum";
import { IconJuicebox } from "@/graphics/IconJuicebox";
import { CACHE_TIME } from "@/lib/config";
import { formatEther } from "@/lib/format";
import { getProjectId, getRewardId } from "@/lib/parameters";
import {
  COLOR_BG_PEEL_200,
  COLOR_BG_PEEL_500,
  COLOR_TEXT_PEEL_400,
} from "@/styles/colors";
import { Button, type FrameContext, type ImageContext } from "frog";

export async function RewardsImage(ctx: ImageContext) {
  const projectId = getProjectId(ctx);
  const rewardId = getRewardId(ctx);
  const data = await getProject({ projectId });

  const rewards = await resolveRewards(data.nftCollections);
  const reward = rewards.at(rewardId);

  if (!reward) {
    return ctx.res({
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TIME}`,
      },
      image: (
        <Container tw={COLOR_BG_PEEL_500}>
          <Header page="Rewards" tw={COLOR_BG_PEEL_200} />

          <Content>
            <Title>{data.metadata.name}</Title>

            <div style={{ display: "block", lineClamp: 10 }}>
              No reward found
            </div>
          </Content>
        </Container>
      ),
    });
  }

  return ctx.res({
    headers: {
      "Cache-Control": `public, max-age=${CACHE_TIME}`,
    },
    image: (
      <Container tw={COLOR_BG_PEEL_500}>
        <Header page="Rewards" tw={COLOR_BG_PEEL_200} />

        <Content>
          <Title>{data.metadata.name}</Title>

          <div tw="mb-9 flex items-center" style={{ gap: 18 * 3 }}>
            <div tw="flex h-[348px] w-[348px] rounded-3xl bg-black p-[6px] text-white">
              {reward.image ? (
                <img
                  src={reward.image}
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
            <div tw="flex flex-1 flex-col text-4xl" style={{ gap: 6 * 3 }}>
              <div tw="text-[50px]" style={{ display: "block", lineClamp: 2 }}>
                {reward.name}
              </div>

              <div tw="flex items-center" style={{ gap: 8 }}>
                <IconEthereum tw="h-[40px] w-[40px]" />
                <span>{formatEther(reward.price)} ETH</span>
              </div>
              <div
                tw={COLOR_TEXT_PEEL_400}
              >{`${reward.remainingQuantity} remaining`}</div>
            </div>
          </div>

          <div style={{ display: "block", lineClamp: 5 }}>
            {reward.description}
          </div>
        </Content>

        <TokenRewards
          projectId={projectId}
          cycleId={data.latestFundingCycle}
          tw={COLOR_BG_PEEL_200}
        />
      </Container>
    ),
  });
}

export async function RewardsScreen(ctx: FrameContext) {
  const projectId = getProjectId(ctx);
  const rewardId = getRewardId(ctx);

  const project = await getProject({ projectId });
  const rewardsCount = project.nftCollections.reduce((acc, reward) => {
    return acc + (reward.tiers?.length ?? 0);
  }, 0);

  return ctx.res({
    image: `/${projectId}/images/rewards/${rewardId}`,
    intents: [
      <BackButton id={projectId} />,
      rewardId > 0 ? (
        <Button action={`/${projectId}/rewards/${rewardId - 1}`}>
          Previous Reward
        </Button>
      ) : null,
      rewardId < rewardsCount - 1 ? (
        <Button action={`/${projectId}/rewards/${rewardId + 1}`}>
          Next Reward
        </Button>
      ) : null,
    ],
  });
}
