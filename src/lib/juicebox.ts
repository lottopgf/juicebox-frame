import { JBControllerABI } from "@/abi/JBController";
import type { CycleData } from "@/api/cycle";
import { client, JBCONTROLLER_ADDRESS } from "@/lib/config";
import { readContract } from "viem/actions";

export const BPS = 10_000n;
export const WAD = BigInt(1e18);

export function getTokensPerEth({
  reservedRate,
  weight,
}: {
  reservedRate: number;
  weight: bigint;
}) {
  return (WAD * ((1n - BigInt(reservedRate) / BPS) * weight)) / WAD;
}

// @see https://github.com/jbx-protocol/juice-interface/blob/26aa025aef8fe2f04df446154acb827c037b32d4/src/hooks/useProjects.ts#L102
export function getTrendingPercentage({
  totalVolume,
  trendingVolume,
}: {
  totalVolume: bigint;
  trendingVolume: bigint;
}) {
  const preTrendingVolume = totalVolume - trendingVolume;

  if (preTrendingVolume <= 0n) return Infinity;

  const percentGain = Number((trendingVolume * 10_000n) / preTrendingVolume);

  let percentRounded: number;

  // If percentGain > 1, round to int
  if (percentGain >= 100) {
    percentRounded = Math.round(percentGain / 100);
    // If 0.1 <= percentGain < 1, round to 1dp
  } else if (percentGain >= 10) {
    percentRounded = Math.round(percentGain / 10) / 10;
    // If percentGain < 0.1, round to 2dp
  } else {
    percentRounded = percentGain / 100;
  }

  return percentRounded;
}

export const MAX_RESERVED_PERCENT = 10_000;

export function getTokenRewards(cycleData: CycleData) {
  const tokensPerEth = getTokensPerEth({
    reservedRate: cycleData.reservedRate,
    weight: cycleData.weight,
  });

  if (tokensPerEth === 0n) return null;

  const receivedRate = BPS - BigInt(cycleData.reservedRate);
  return (tokensPerEth * receivedRate) / BPS;
}

export function getTokenAToBQuote(
  tokenAAmount: bigint,
  cycleParams: CycleData,
) {
  const { weight, reservedRate } = cycleParams;
  const weightRatio = BigInt(10 ** 18);
  const totalTokens = (weight * tokenAAmount) / weightRatio;
  const reservedTokens =
    (weight * BigInt(reservedRate) * tokenAAmount) /
    BigInt(MAX_RESERVED_PERCENT) /
    weightRatio;

  const payerTokens = totalTokens - reservedTokens;

  return {
    payerTokens,
    reservedTokens,
    totalTokens,
  };
}

export async function getCurrentCycle(projectId: number) {
  return readContract(client, {
    address: JBCONTROLLER_ADDRESS,
    abi: JBControllerABI,
    functionName: "currentFundingCycleOf",
    args: [BigInt(projectId)],
  });
}
