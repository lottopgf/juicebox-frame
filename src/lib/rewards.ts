"use server";

import { getCycle } from "@/api/cycle";
import { getTokensPerEth } from "@/lib/juicebox";

export async function getTokenRewards({
  projectId,
  cycleId,
}: {
  projectId: number;
  cycleId: number;
}) {
  const cycleData = await getCycle({
    projectId,
    cycleId,
  });

  if (!cycleData) return null;

  const tokensPerEth = getTokensPerEth({
    reservedRate: cycleData.reservedRate,
    weight: cycleData.weight,
  });

  if (tokensPerEth === 0n) return null;

  const receivedRate = 10000n - BigInt(cycleData.reservedRate);
  return (tokensPerEth * receivedRate) / 10000n;
}
