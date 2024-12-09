"use client";

import { JBETHPaymentTerminalABI } from "@/abi/JBETHPaymentTerminal";
import { getCycle } from "@/api/cycle";
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
import { formatRichText } from "@/lib/format";
import { getTokensPerEth } from "@/lib/juicebox";
import { cn } from "@/lib/utils";
import sdk from "@farcaster/frame-sdk";
import { ErrorMessage } from "@hookform/error-message";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery } from "@tanstack/react-query";
import { ConnectKitButton } from "connectkit";
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from "lucide-react";
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

export function PaymentComponent({ projectId }: { projectId: number }) {
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", { projectId }],
    queryFn: async () => {
      return await getProject({ projectId });
    },
  });

  const { data: tokenRewards } = useQuery({
    queryKey: ["tokenRewards", { projectId }],
    queryFn: async () => {
      return await getTokenRewards({
        projectId,
        cycleId: project?.latestFundingCycle ?? 0,
      });
    },
    enabled: !!project,
  });

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

  if (isLoadingProject) return "Loading…";

  if (!project) return "Project not found";

  if (!address)
    return (
      <div className="p-4">
        <header className="mb-8 space-y-4 border-b pb-4">
          <ConnectKitButton />
        </header>
        <p>Please connect.</p>
      </div>
    );

  async function onSubmit({ amount, message }: FieldsOutput) {
    console.log(amount, message);
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
    <div className="p-4">
      <header className="mb-8 space-y-4 border-b pb-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-3xl">
            Contribute to {project.metadata.name}
          </h1>
          <ConnectKitButton />
        </div>
      </header>
      <div className="mb-8 space-y-4">
        <p className="line-clamp-5 max-w-prose text-balance">
          {formatRichText(project.metadata.description)}
        </p>
        <Link
          href={`https://juicebox.money/v2/p/${projectId}?tabid=about`}
          className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:no-underline"
        >
          Learn more <ExternalLinkIcon size="1em" />{" "}
        </Link>
      </div>
      {/* TODO: Figure out the typing here. The valibot resolver transforms
       * to the right types, but react-hook-form doesn't like it.
       * @ts-ignore-next-line */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Textarea
            placeholder="Message"
            id="message"
            {...register("message")}
          />
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
              {project.metadata.payDisclosure && `this project's notice and`}{" "}
              the{" "}
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
    </div>
  );
}

async function getTokenRewards({
  projectId,
  cycleId,
}: {
  projectId: number;
  cycleId: number;
}) {
  const cycleData = await getCycle({
    projectId,
    cycleId,
  });

  if (!cycleData) return null;

  const tokensPerEth = getTokensPerEth({
    reservedRate: cycleData.reservedRate,
    weight: cycleData.weight,
  });

  console.log(cycleData, tokensPerEth);

  if (tokensPerEth === 0n) return null;

  const receivedRate = 10000n - BigInt(cycleData.reservedRate);
  return (tokensPerEth * receivedRate) / 10000n;
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
