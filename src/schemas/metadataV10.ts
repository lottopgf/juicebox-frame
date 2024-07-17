import {
  any,
  array,
  boolean,
  number,
  object,
  optional,
  pipe,
  string,
  value,
} from "valibot";

export const METADATA_V10_SCHEMA = object({
  name: string(),
  infoUri: string(),
  logoUri: string(),
  coverImageUri: string(),
  description: string(),
  twitter: string(),
  discord: string(),
  telegram: string(),
  tokens: array(any()),
  tags: array(string()),
  domain: string(),
  version: pipe(number(), value(10)),
  projectTagline: string(),
  payDisclosure: optional(string()),
  projectRequiredOFACCheck: optional(boolean()),
  nftPaymentSuccessModal: optional(
    object({
      ctaText: string(),
      ctaLink: string(),
      content: string(),
    })
  ),
});
