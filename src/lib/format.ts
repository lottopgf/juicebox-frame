import { formatEther as rawFormatEther } from "viem";

export function formatEther(amount: bigint) {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    Number(rawFormatEther(amount)),
  );
}
