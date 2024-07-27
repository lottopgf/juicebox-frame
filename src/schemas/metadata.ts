import { array, object, optional, string } from "valibot";

/**
 * Compatible metadata schema.
 * @see https://docs.juicebox.money/dev/frontend/metadata/#version-9
 */
export const MetadataSchema = object({
  name: string(),
  logoUri: optional(string()),
  infoUri: string(),
  description: string(),
  /** Introduced in V2 */
  payText: optional(string()),
  payButton: optional(string()),
  tokens: optional(
    array(
      object({
        value: string(),
        type: string(),
      }),
    ),
  ),
  /** Introduced in V3 */
  twitter: optional(string()),
  discord: optional(string()),
  payDisclosure: optional(string()),
  /** Introduced in V5 */
  nftPaymentSuccessModal: optional(
    object({
      ctaText: optional(string()),
      ctaLink: optional(string()),
      content: string(),
    }),
  ),
  /** Introduced in V6 */
  telegram: optional(string()),
  /** Introduced in V7 */
  coverImageUri: optional(string()),
  /** Introduced in V8 */
  tags: optional(array(string())),
  /** Introduced in V9 */
  projectTagline: optional(string()),
});
