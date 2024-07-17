/** @jsxImportSource frog/jsx */

import { getCycle } from "@/api/cycle";
import { getTokensPerEth } from "@/lib/juicebox";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export async function TokenRewards({
  projectId,
  cycleId,
  tw,
}: {
  projectId: number;
  cycleId: number;
  tw?: string;
}) {
  const cycleData = await getCycle({
    projectId,
    cycleId,
  });

  const tokensPerEth = getTokensPerEth({
    reservedRate: cycleData.reservedRate,
    weight: cycleData.weight,
  });

  if (tokensPerEth === 0n) return <></>;

  return (
    <div
      tw={twMerge(
        "flex-shrink-0 flex justify-center w-full px-8 py-6 text-5xl text-center",
        tw
      )}
    >
      Receive {formatEther(tokensPerEth)} tokens per ETH paid
    </div>
  );
}
