import { any, array, boolean, number, object, string } from "valibot";

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
  version: number(),
  projectTagline: string(),
  payDisclosure: string(),
  projectRequiredOFACCheck: boolean(),
  nftPaymentSuccessModal: object({
    ctaText: string(),
    ctaLink: string(),
    content: string(),
  }),
});
