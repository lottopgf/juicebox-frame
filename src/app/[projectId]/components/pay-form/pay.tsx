import { useController, type Control } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import type { Fields } from "@/schemas/pay-from-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@radix-ui/react-label";
import { useAccount, useBalance } from "wagmi";
import { useMemo } from "react";
import { formatEther } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ETH } from "./constants";

export const TokenView: React.FC<{
  token: {
    icon: string;
    symbol: string;
    name: string;
  };
  description: string;
}> = ({ token, description }) => {
  return (
    <div className="flex flex-1 flex-row items-center gap-3">
      <Avatar>
        {token.icon ? <AvatarImage src={token.icon} /> : null}
        <AvatarFallback>{token.symbol}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col">
        <span className="line-clamp-1 text-lg font-semibold text-slate-100">
          {token.name}
        </span>
        <span className="line-clamp-1 text-slate-200">{description}</span>
      </div>
    </div>
  );
};

export function PayStep({
  control,
  onNext,
  outputAmount,
}: {
  control: Control<Fields>;
  onNext: () => void;
  outputAmount: string | null;
}) {
  const wallet = useAccount();
  const fromToken = ETH;

  const { data: sellBalance } = useBalance({
    address: wallet.address,
  });

  const { field } = useController({
    control,
    name: "amount",
  });

  const formattedSellBalance = useMemo(() => {
    if (sellBalance == null) {
      return fromToken.symbol;
    }

    return `${formatEther(sellBalance.value)} ${fromToken.symbol}`;
  }, [fromToken.symbol, sellBalance]);

  const invalidAmount =
    !field.value || isNaN(Number(field.value)) || Number(field.value) < 0;

  const continueDisabled = outputAmount == null || invalidAmount;

  const continueLabel = useMemo(() => {
    if (invalidAmount) {
      return "Enter amount";
    }

    if (outputAmount == null) {
      return "Loading...";
    }

    return "Continue";
  }, [invalidAmount, outputAmount]);

  return (
    <div className="flex flex-col gap-4 p-3 pt-4">
      <h2 className="text-2xl font-medium">Pay</h2>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          <TokenView token={fromToken} description={formattedSellBalance} />
          <div className="py-6">
            <input
              className="w-full bg-transparent text-center font-mono text-5xl font-bold text-slate-100 outline-none placeholder:text-slate-400"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              autoFocus
              placeholder="0"
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value.replaceAll(",", "."));
              }}
            />
          </div>
          <div
            className={cn(
              "flex flex-row items-center justify-between border-t border-slate-600 pt-3 transition-opacity",
              outputAmount == null ? "invisible opacity-0" : "opacity-100",
            )}
          >
            <span>You receive:</span>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-medium text-lg">{outputAmount ?? 0}</span>
                <span className="text-sm text-slate-200">TOKENS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Message (optional):</Label>
          <Input
            className="h-12 border-slate-600 placeholder-slate-400 ring-slate-600 ring-offset-slate-600"
            type="text"
            autoFocus
            placeholder="Add an on-chain message"
            {...control.register("message")}
          />
        </div>
      </div>
      <div className="w-full">
        <Button
          size="lg"
          className="w-full"
          type="button"
          onClick={onNext}
          disabled={continueDisabled}
        >
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
