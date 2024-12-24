import * as v from "valibot";
import { parseEther } from "viem";

export const FieldsSchema = v.object({
  amount: v.pipe(
    v.string(),
    v.minLength(1, "Amount is required"),
    v.transform((input) => parseEther(input)),
    v.custom(
      (input) => typeof input === "bigint" && input > 0n,
      "Amount must be greater than 0",
    ),
  ),
  message: v.optional(v.string()),
  terms: v.pipe(
    v.boolean(),
    v.literal(true, "Please accept the notice and risks"),
  ),
});

export type Fields = v.InferInput<typeof FieldsSchema>;
export type FieldsOutput = v.InferOutput<typeof FieldsSchema>;
