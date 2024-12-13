"use server";

import { CACHE_TIME } from "@/lib/config";
import { graphClient } from "@/lib/graph";
import { cidFromURL, decodeEncodedIPFSUri, ipfsURL } from "@/lib/ipfs";
import { MetadataSchema } from "@/schemas/metadata";
import { gql } from "graphql-request";
import { unstable_cache } from "next/cache";
import {
  array,
  flatten,
  type InferOutput,
  nullable,
  number,
  object,
  pipe,
  safeParse,
  string,
  transform,
} from "valibot";

const projectQuery = gql`
  query Project($PV: String!, $ProjectId: Int!) {
    projects(where: { pv: $PV, projectId: $ProjectId }) {
      handle # the project's ENS handle
      owner # the current owner's address
      metadataUri # the project's IPFS metadata URI
      paymentsCount # the number of payments the project has received
      volume # the ETH payment volume
      volumeUSD # the payment volume converted to USD (at time received)
      trendingVolume
      currentBalance # the current ETH balance
      latestFundingCycle # the ID of the project's latest cycle
      nftCollections {
        address # the NFT contract's address
        name # the collection's name
        symbol # the collection's ticker
        tiers {
          price # the ETH price of the NFT (18 decimals)
          remainingQuantity # how many are remaining
          initialQuantity # the initial quantity
          encodedIpfsUri # hex-encoded ipfs URI
          resolvedUri # metadata resolver URI, if one exists
        }
      }
    }
  }
`;

const RewardTierSchema = object({
  price: pipe(
    string(),
    transform((input) => BigInt(String(input))),
  ),
  remainingQuantity: pipe(string(), transform(Number), number()),
  initialQuantity: pipe(string(), transform(Number), number()),
  encodedIpfsUri: pipe(
    string(),
    transform((input) => decodeEncodedIPFSUri(input)),
  ),
  resolvedUri: nullable(string()),
});

const RewardSchema = object({
  address: string(),
  name: string(),
  symbol: string(),
  tiers: nullable(array(RewardTierSchema)),
});

export type Reward = InferOutput<typeof RewardSchema>;

const ProjectSchema = object({
  handle: nullable(string()),
  owner: string(),
  metadataUri: string(),
  paymentsCount: number(),
  volume: pipe(
    string(),
    transform((input) => BigInt(String(input))),
  ),
  volumeUSD: pipe(
    string(),
    transform((input) => BigInt(String(input))),
  ),
  trendingVolume: pipe(
    string(),
    transform((input) => BigInt(String(input))),
  ),
  currentBalance: pipe(
    string(),
    transform((input) => BigInt(String(input))),
  ),
  latestFundingCycle: number(),
  nftCollections: array(RewardSchema),
});

interface GetProjectParams {
  projectVersion?: string;
  projectId: number;
}

const cachedRequest = unstable_cache(
  ({ projectVersion = "2", projectId }: GetProjectParams) => {
    return graphClient.request(projectQuery, {
      PV: projectVersion,
      ProjectId: projectId,
    });
  },
  ["project"],
  { revalidate: CACHE_TIME },
);

const cachedMetadataRequest = unstable_cache(
  (url: string) => fetch(url).then((res) => res.json()),
  ["projectMetadata"],
  { revalidate: CACHE_TIME },
);

export async function getProject(params: GetProjectParams) {
  const data = await cachedRequest(params);

  const rawProjectData = data.projects.at(0);

  if (!rawProjectData) {
    throw new Error("Project not found");
  }

  const projectResult = safeParse(ProjectSchema, rawProjectData);

  if (!projectResult.success) {
    console.error(`Project parse error: %O`, flatten(projectResult.issues));
    console.log("Raw data:", rawProjectData);
    throw new Error("Failed to parse project data");
  }

  const projectData = projectResult.output;

  const url = ipfsURL(cidFromURL(projectData.metadataUri));

  if (!url) {
    throw new Error("Invalid metadata URI");
  }

  const rawMetadata = await cachedMetadataRequest(url);

  const metadataResult = safeParse(MetadataSchema, rawMetadata);

  if (!metadataResult.success) {
    console.error(`Metadata parse error: %O`, flatten(metadataResult.issues));
    console.log("Raw data:", rawMetadata);
    throw new Error("Failed to parse project data");
  }

  return { ...projectData, metadata: metadataResult.output };
}

export type Project = Awaited<ReturnType<typeof getProject>>;
