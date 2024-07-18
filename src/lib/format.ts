import sanitize from "sanitize-html";
import { formatEther as rawFormatEther } from "viem";

export function formatEther(amount: bigint) {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    Number(rawFormatEther(amount))
  );
}

export function formatRichText(text: string) {
  return sanitize(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function formatExcerpt(text: string) {
  if (text.length > 95) {
    return `${text.slice(0, 95)}…`;
  }

  return text;
}
