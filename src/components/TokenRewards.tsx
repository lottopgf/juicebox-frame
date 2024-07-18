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

  if (!cycleData) return <></>;

  const tokensPerEth = getTokensPerEth({
    reservedRate: cycleData.reservedRate,
    weight: cycleData.weight,
  });

  if (tokensPerEth === 0n) return <></>;

  return (
    <div
      tw={twMerge(
        "flex h-[115px] w-full flex-shrink-0 items-center justify-center px-12 text-center text-[44px] leading-none",
        tw,
      )}
    >
      Receive {formatEther(tokensPerEth)} tokens per ETH paid
    </div>
  );
}
