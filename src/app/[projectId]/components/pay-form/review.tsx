"use client";

import type { Project } from "@/api/project";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatEther } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Fields } from "@/schemas/pay-from-schema";
import sdk from "@farcaster/frame-sdk";
import { ErrorMessage } from "@hookform/error-message";
import { AlertTriangleIcon, ChevronDownIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Controller,
  useFormState,
  useWatch,
  type Control,
} from "react-hook-form";
import { ETH } from "./constants";

function Notice({ notice }: { notice: string | undefined }) {
  const [open, setOpen] = useState(false);
  return (
    <Alert className="w-full" variant="warning">
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

export function ReviewForm({
  control,
  project,
  tokenRewards,
  onDiscard,
  outputAmount,
  loading,
}: {
  control: Control<Fields>;
  project: Project;
  tokenRewards?: bigint | null;
  outputAmount: string | null;
  onDiscard: () => void;
  loading: boolean;
}) {
  const errors = useFormState({ control }).errors;
  const formattedInput = useWatch({ control, name: "amount" });
  const fromToken = ETH;

  return (
    <div className="flex flex-col gap-4 p-3 pt-4">
      <h2 className="text-2xl font-medium">Review</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 rounded-lg border border-slate-600 bg-slate-900 p-3 shadow-sm">
          <div className="flex flex-row items-center justify-between gap-3">
            <span>Pay {fromToken.symbol}</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={fromToken.icon} />
                <AvatarFallback>{fromToken.symbol}</AvatarFallback>
              </Avatar>
              {formattedInput}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-3">
            <span>Receive tokens:</span>
            <span>+{outputAmount}</span>
          </div>
        </div>
        {tokenRewards && (
          <div className="flex flex-row items-center justify-between gap-3">
            <span>Rewards:</span>{" "}
            <span>{formatEther(tokenRewards)} TOKENS per ETH</span>
          </div>
        )}
      </div>
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
              href="https://docs.juicebox.money/dev/learn/risks"
              target="_top"
              className="underline decoration-dotted"
              onClick={(e) => {
                sdk.actions.openUrl(e.currentTarget.href);
              }}
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

      <div className="flex flex-row gap-3">
        <Button variant="secondary" type="button" onClick={onDiscard}>
          Discard
        </Button>
        <Button className="flex-1" type="submit">
          {loading && <Loader className="h-5 w-5 animate-spin" />}
          Pay
        </Button>
      </div>
    </div>
  );
}
