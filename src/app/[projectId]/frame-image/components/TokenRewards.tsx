import { getCycle } from "@/api/cycle";
import { formatEther } from "@/lib/format";
import { getTokenAToBQuote } from "@/lib/juicebox";
import { twMerge } from "tailwind-merge";
import { parseEther } from "viem";

export function TokenRewards({
  cycleData,
  tw,
}: {
  cycleData: Awaited<ReturnType<typeof getCycle>>;
  tw?: string;
}) {
  if (!cycleData || cycleData.pausePay) return <></>;

  const { payerTokens } = getTokenAToBQuote(parseEther("1"), cycleData);

  if (!payerTokens || payerTokens === 0n) return <></>;

  return (
    <div
      tw={twMerge(
        "flex w-full flex-shrink-0 items-center justify-center px-12 py-4 text-center text-4xl leading-none",
        tw,
      )}
    >
      Receive {formatEther(payerTokens)} tokens per ETH paid
    </div>
  );
}
