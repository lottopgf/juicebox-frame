import { Button } from "@/components/ui/button";
import { Check, X, Loader } from "lucide-react";
import { useMemo } from "react";
import type { Hex } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

export function CompletedStep({
  hash,
  onDismiss,
  onTryAgain,
}: {
  hash: Hex;
  onDismiss: () => void;
  onTryAgain: () => void;
}) {
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
        </>
      );

    if (isFailure)
      return (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500 border-opacity-20 bg-red-500 bg-opacity-15">
            <X className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-medium">Payment failed!</h1>
          <Button onClick={onTryAgain}>
            Try again
          </Button>
        </>
      );

    if (isSuccess)
      return (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500 border-opacity-20 bg-green-500 bg-opacity-15">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-2xl font-medium">Payment successful!</h1>
          <Button onClick={onDismiss}>
            Close
          </Button>
        </>
      );
  }, [isFailure, isSuccess, isWaiting, onDismiss, onTryAgain]);

  return (
    <div className="flex flex-col gap-4 p-3 pt-4">
      <h1 className="text-3xl font-medium">Completed</h1>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-600 bg-slate-900 px-3 py-5 shadow-sm">
          {Body}
        </div>
      </div>
    </div>
  );
}
