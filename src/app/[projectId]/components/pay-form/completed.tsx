import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/format";
import sdk from "@farcaster/frame-sdk";
import { Check, Loader, X } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { Hex } from "viem";
import { useChains, useWaitForTransactionReceipt } from "wagmi";

export function CompletedStep({
  hash,
  onDismiss,
  onTryAgain,
}: {
  hash: Hex;
  onDismiss: () => void;
  onTryAgain: () => void;
}) {
  const [chain] = useChains();
  const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const isSuccess = receipt?.status === "success";
  const isFailure = receipt?.status === "reverted";

  const Body = useMemo(() => {
    if (isWaiting)
      return (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500 border-opacity-20 bg-blue-500 bg-opacity-15">
            <Loader className="h-6 w-6 animate-spin text-blue-500" />
          </div>
          <h1 className="text-2xl font-medium">Waiting for confirmation</h1>
          {!!chain.blockExplorers && (
            <p className="text-sm text-slate-200">
              <Link
                href={`${chain.blockExplorers?.default.url}/tx/${hash}`}
                target="_blank"
                className="underline decoration-dotted"
                onClick={async (e) => {
                  try {
                    await sdk.actions.ready();
                    e.preventDefault();
                    sdk.actions.openUrl(e.currentTarget.href);
                  } catch (e) {}
                }}
              >
                {formatAddress(hash)}
              </Link>
            </p>
          )}
        </>
      );

    if (isFailure)
      return (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500 border-opacity-20 bg-red-500 bg-opacity-15">
            <X className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-medium">Payment failed!</h1>
          <Button onClick={onTryAgain}>Try again</Button>
        </>
      );

    if (isSuccess)
      return (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500 border-opacity-20 bg-green-500 bg-opacity-15">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-2xl font-medium">Payment successful!</h1>
          <Button onClick={onDismiss}>Close</Button>
        </>
      );
  }, [hash, isFailure, isSuccess, isWaiting, onDismiss, onTryAgain]);

  return (
    <div className="flex flex-col gap-4 p-3 pt-4">
      <h2 className="text-2xl font-medium">Completed</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-600 bg-slate-900 px-3 py-5 shadow-sm">
          {Body}
        </div>
      </div>
    </div>
  );
}
