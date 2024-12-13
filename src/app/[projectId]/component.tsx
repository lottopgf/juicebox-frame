"use client";

import { JBETHPaymentTerminalABI } from "@/abi/JBETHPaymentTerminal";
import { getProject } from "@/api/project";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  JB_ETH_TOKEN_ADDRESS,
  JBETHPAYMENTTERMINAL_ADDRESS,
} from "@/lib/config";
import { cn } from "@/lib/utils";
import sdk from "@farcaster/frame-sdk";
import { ErrorMessage } from "@hookform/error-message";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { ConnectKitButton } from "connectkit";
import { AlertTriangleIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as v from "valibot";
import { formatEther, parseEther, zeroHash } from "viem";
import { useAccount, useWriteContract } from "wagmi";

const FieldsSchema = v.object({
  amount: v.pipe(
    v.string(),
    v.minLength(1, "Amount is required"),
    v.transform((input) => parseEther(input)),
    v.custom(
      (input) => typeof input === "bigint" && input > 0n,
      "Amount must be greater than 0",
    ),
  ),
  message: v.optional(v.string()),
  terms: v.pipe(
    v.boolean(),
    v.literal(true, "Please accept the notice and risks"),
  ),
});

type Fields = v.InferInput<typeof FieldsSchema>;
type FieldsOutput = v.InferOutput<typeof FieldsSchema>;

type Project = Awaited<ReturnType<typeof getProject>>;

export function PaymentComponent({
  projectId,
  project,
  tokenRewards,
}: {
  projectId: number;
  project: Project;
  tokenRewards: bigint | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Fields>({
    defaultValues: {
      amount: "0.01",
      message: "",
      terms: false,
    },
    resolver: valibotResolver(FieldsSchema),
  });

  useEffect(() => {
    if (project) {
      sdk.actions.ready();
    }
  }, [project]);

  const { writeContractAsync } = useWriteContract();

  const { address } = useAccount();

  async function onSubmit({ amount, message }: FieldsOutput) {
    if (!address) return;

    await writeContractAsync({
      abi: JBETHPaymentTerminalABI,
      functionName: "pay",
      args: [
        BigInt(projectId), // _projectId
        amount, // _amount
        JB_ETH_TOKEN_ADDRESS, // _token
        address, // _beneficiary
        BigInt(0), // _minReturnedTokens
        false, // _preferClaimedTokens
        message ?? "", // _memo
        zeroHash, // _metadata
      ],
      address: JBETHPAYMENTTERMINAL_ADDRESS,
      value: amount,
    });
  }

  return (
    /* TODO: Figure out the typing here. The valibot resolver transforms
     * to the right types, but react-hook-form doesn't like it.
     * @ts-ignore-next-line */
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-semibold">Contribute</h2>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          type="text"
          placeholder="Amount"
          id="amount"
          {...register("amount")}
        />
        <ErrorMessage
          errors={errors}
          name="amount"
          render={({ message }) => (
            <p className="text-sm text-red-500">{message}</p>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea placeholder="Message" id="message" {...register("message")} />
        <ErrorMessage
          errors={errors}
          name="message"
          render={({ message }) => (
            <p className="text-sm text-red-500">{message}</p>
          )}
        />
      </div>
      <div>Rewards: {formatEther(tokenRewards ?? 0n)} tokens per ETH</div>
      {project.metadata.payDisclosure && (
        <Notice notice={project.metadata.payDisclosure} />
      )}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="terms"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Checkbox
                id="terms"
                onCheckedChange={onChange}
                onBlur={onBlur}
                checked={value}
              />
            )}
          />
          <label
            htmlFor="terms"
            className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I understand and accept{" "}
            {project.metadata.payDisclosure && `this project's notice and`} the{" "}
            <Link
              target="_blank"
              href="https://docs.juicebox.money/dev/learn/risks"
              className="underline decoration-dotted"
            >
              risks
            </Link>{" "}
            associated with the Juicebox protocol.
          </label>
        </div>
        <ErrorMessage
          errors={errors}
          name="terms"
          render={({ message }) => (
            <p className="text-sm text-red-500">{message}</p>
          )}
        />
      </div>

      <Button className="w-full" type="submit">
        Pay
      </Button>
    </form>
  );
}

function Notice({ notice }: { notice: string | undefined }) {
  const [open, setOpen] = useState(false);
  return (
    <Alert className="max-w-prose">
      <AlertTriangleIcon className="size-4" />
      <AlertTitle>Project Notice</AlertTitle>
      <AlertDescription>
        <p className={cn(open ? "line-clamp-none" : "line-clamp-3")}>
          {notice}
        </p>
        {!open && (
          <p>
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:no-underline"
            >
              <ChevronDownIcon size="1em" /> Read more
            </button>
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
