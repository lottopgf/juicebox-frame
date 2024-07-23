import sanitize from "sanitize-html";
import { formatEther as rawFormatEther } from "viem";

export function parseEther(amount: bigint) {
  return Number(rawFormatEther(amount));
}

export function formatEther(amount: bigint) {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    parseEther(amount),
  );
}

export function formatRichText(text: string) {
  return sanitize(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function formatExcerpt(text: string) {
  const plainText = formatRichText(text).trim();

  if (plainText.length > 95) {
    return `${plainText.slice(0, 95)}…`;
  }

  return plainText;
}
