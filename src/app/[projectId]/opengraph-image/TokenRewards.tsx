import { getCycle } from "@/api/cycle";
import { formatEther } from "@/lib/format";
import { getTokensPerEth } from "@/lib/juicebox";
import { twMerge } from "tailwind-merge";

export function TokenRewards({
  cycleData,
  tw,
}: {
  cycleData: Awaited<ReturnType<typeof getCycle>>;
  tw?: string;
}) {
  if (!cycleData) return <></>;

  const tokensPerEth = getTokensPerEth({
    reservedRate: cycleData.reservedRate,
    weight: cycleData.weight,
  });

  if (tokensPerEth === 0n) return <></>;

  const receivedRate = 10000n - BigInt(cycleData.reservedRate);
  const receivedTokensPerEth = (tokensPerEth * receivedRate) / 10000n;

  return (
    <div
      tw={twMerge(
        "flex w-full flex-shrink-0 items-center justify-center px-12 py-4 text-center text-4xl leading-none",
        tw,
      )}
    >
      Receive {formatEther(receivedTokensPerEth)} tokens per ETH paid
    </div>
  );
}
