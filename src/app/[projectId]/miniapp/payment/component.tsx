"use client";

import { JBETHPaymentTerminalABI } from "@/abi/JBETHPaymentTerminal";
import {
  CHAIN,
  JB_ETH_TOKEN_ADDRESS,
  JBETHPAYMENTTERMINAL_ADDRESS,
} from "@/lib/config";
import { contractTransaction } from "frog/web";
import { parseEther, zeroAddress, zeroHash } from "viem";

export function PaymentComponent({ projectId }: { projectId: number }) {
  const amount = parseEther("0.01");
  const address = zeroAddress;

  return (
    <>
      <button
        onClick={() =>
          contractTransaction({
            abi: JBETHPaymentTerminalABI,
            functionName: "pay",
            args: [
              BigInt(projectId), // _projectId
              amount, // _amount
              JB_ETH_TOKEN_ADDRESS, // _token
              address, // _beneficiary
              BigInt(0), // _minReturnedTokens
              false, // _preferClaimedTokens
              "", // _memo
              zeroHash, // _metadata
            ],
            chainId: `eip155:${CHAIN.id}`,
            to: JBETHPAYMENTTERMINAL_ADDRESS,
            value: amount,
          })
        }
      >
        Contract Tx
      </button>
    </>
  );
}
