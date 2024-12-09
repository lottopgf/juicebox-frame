"use server";

import { CACHE_TIME } from "@/lib/config";
import { ipfsURL } from "@/lib/ipfs";
import { unstable_cache } from "next/cache";
import { flatten, type InferOutput, object, safeParse, string } from "valibot";
import { type Reward } from "./project";

const RewardMetadataSchema = object({
  description: string(),
  name: string(),
  image: string(),
});

export type RewardMetadata = InferOutput<typeof RewardMetadataSchema>;

const cachedMetadataRequest = unstable_cache(
  (url: string) => fetch(url).then((res) => res.json()),
  ["rewardTierMetadata"],
  { revalidate: CACHE_TIME },
);

export async function resolveRewards(rewards: Reward[]) {
  const tiers = rewards.map((reward) => reward.tiers ?? []).flat(1);

  const resolvedRewards = await Promise.all(
    tiers.map(async (tier) => {
      const url = ipfsURL(tier.encodedIpfsUri);
      if (!url) {
        return null;
      }
      const metadata = await cachedMetadataRequest(url);
      const result = safeParse(RewardMetadataSchema, metadata);

      if (!result.success) {
        console.error(
          `Reward tier metadata parse error: %O`,
          flatten(result.issues),
        );
        console.log("Raw data:", metadata);
        return null;
      }

      return result.output;
    }),
  );

  const mergedRewardTiers = tiers.map((tier, index) => {
    const metadata = resolvedRewards.at(index);
    return {
      price: tier.price,
      remainingQuantity: tier.remainingQuantity,
      image: metadata?.image,
      name: metadata?.name,
      description: metadata?.description,
    };
  });

  return mergedRewardTiers;
}
