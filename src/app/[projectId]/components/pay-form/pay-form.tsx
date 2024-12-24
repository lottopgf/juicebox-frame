"use client";

import { JBETHPaymentTerminalABI } from "@/abi/JBETHPaymentTerminal";
import { type CycleData } from "@/api/cycle";
import { type Project } from "@/api/project";
import {
  JB_ETH_TOKEN_ADDRESS,
  JBETHPAYMENTTERMINAL_ADDRESS,
} from "@/lib/config";
import { formatNumber } from "@/lib/format";
import { getTokenAToBQuote, getTokenRewards } from "@/lib/juicebox";
import { FieldsSchema, type Fields } from "@/schemas/pay-from-schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { formatUnits, parseEther, zeroHash } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { CompletedStep } from "./completed";
import { PayStep } from "./pay";
import { ReviewForm } from "./review";

const FormLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col rounded-lg border border-slate-600 bg-slate-700 text-slate-100 shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)]">
    {children}
  </div>
);

export function PayForm({
  project,
  projectId,
  cycleData,
}: {
  project: Project;
  projectId: number;
  cycleData: CycleData | null;
}) {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<Fields>({
    defaultValues: {
      amount: "0.01",
      message: "",
      terms: false,
    },
    resolver: valibotResolver(FieldsSchema),
  });

  const [step, setStep] = useState<"form" | "review">("form");

  const { data: hash, writeContractAsync } = useWriteContract();

  const { address } = useAccount();

  const amount = watch("amount");

  const outputAmount = useMemo(() => {
    if (!amount || isNaN(Number(amount)) || !cycleData) return null;
    const payInWei = parseEther(amount);

    const { payerTokens } = getTokenAToBQuote(payInWei, cycleData);
    const output = Number(formatUnits(payerTokens, 18)).toFixed();
    return formatNumber(Number(output));
  }, [amount, cycleData]);

  const tokenRewards = useMemo(() => {
    if (!cycleData) return null;

    return getTokenRewards(cycleData);
  }, [cycleData]);

  const formOnSubmit = useMemo(() => {
    return handleSubmit(async ({ amount, message }) => {
      if (!address) return;

      await writeContractAsync({
        abi: JBETHPaymentTerminalABI,
        functionName: "pay",
        args: [
          BigInt(projectId), // _projectId
          BigInt(amount), // _amount
          JB_ETH_TOKEN_ADDRESS, // _token
          address, // _beneficiary
          BigInt(0), // _minReturnedTokens
          false, // _preferClaimedTokens
          message ?? "", // _memo
          zeroHash, // _metadata
        ],
        address: JBETHPAYMENTTERMINAL_ADDRESS,
        value: BigInt(amount),
      });
    });
  }, [address, handleSubmit, projectId, writeContractAsync]);

  if (!cycleData || cycleData.pausePay) {
    return null;
  }

  if (hash) {
    return (
      <FormLayout>
        <CompletedStep
          hash={hash}
          onDismiss={() => {
            reset({
              amount: "0.01",
              message: "",
              terms: false,
            });
            setStep("form");
          }}
          onTryAgain={() => setStep("review")}
        />
      </FormLayout>
    );
  }

  return (
    <form onSubmit={formOnSubmit}>
      <FormLayout>
        {step === "form" ? (
          <PayStep
            control={control}
            outputAmount={outputAmount}
            onNext={() => {
              setStep("review");
            }}
          />
        ) : (
          <ReviewForm
            loading={isSubmitting}
            control={control}
            project={project}
            outputAmount={outputAmount}
            tokenRewards={tokenRewards}
            onDiscard={() => setStep("form")}
          />
        )}
      </FormLayout>
    </form>
  );
}
