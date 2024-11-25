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
  // Force extra space at the end of each paragraph
  text = text.replace(/<\/p>/g, " </p>");
  // Remove all HTML
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
