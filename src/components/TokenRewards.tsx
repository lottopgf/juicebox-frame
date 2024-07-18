/** @jsxImportSource frog/jsx */

import { getCycle } from "@/api/cycle";
import { formatEther } from "@/lib/format";
import { getTokensPerEth } from "@/lib/juicebox";
import { twMerge } from "tailwind-merge";

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
        "flex w-full flex-shrink-0 justify-center px-8 py-6 text-center text-5xl",
        tw,
      )}
    >
      Receive {formatEther(tokensPerEth)} tokens per ETH paid
    </div>
  );
}
