import sanitize from "sanitize-html";
import { formatEther as rawFormatEther, type Address } from "viem";

export function parseEther(amount: bigint) {
  return Number(rawFormatEther(amount));
}

const formatter = Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatEther(amount: bigint) {
  return formatter.format(parseEther(amount));
}

export function formatNumber(amount: number) {
  return formatter.format(amount);
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

export function formatAddress(address?: Address, length: number = 4) {
  if (!address) return null;
  return `${address.slice(0, length + 2)}…${address.slice(-length)}`;
}
