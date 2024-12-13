import { mainnet } from "viem/chains";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const CHAIN = mainnet;

export const TIMELINE_RANGE_IN_DAYS = 30;
export const CACHE_TIME = 3600;

export const JBETHPAYMENTTERMINAL_ADDRESS =
  "0x1d9619E10086FdC1065B114298384aAe3F680CC0";
export const JB_ETH_TOKEN_ADDRESS =
  "0x000000000000000000000000000000000000EEEe";
