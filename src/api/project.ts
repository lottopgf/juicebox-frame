import { graphClient } from "@/lib/graph";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { METADATA_V10_SCHEMA } from "@/schemas/metadataV10";
import { gql } from "graphql-request";
import {
  array,
  flatten,
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
      }
    }
  }
`;

const RewardSchema = object({
  address: string(),
  name: string(),
  symbol: string(),
});

const ProjectSchema = object({
  handle: nullable(string()),
  owner: string(),
  metadataUri: string(),
  paymentsCount: number(),
  volume: pipe(
    string(),
    transform((input) => BigInt(String(input)))
  ),
  volumeUSD: pipe(
    string(),
    transform((input) => BigInt(String(input)))
  ),
  trendingVolume: pipe(
    string(),
    transform((input) => BigInt(String(input)))
  ),
  currentBalance: pipe(
    string(),
    transform((input) => BigInt(String(input)))
  ),
  latestFundingCycle: number(),
  nftCollections: array(RewardSchema),
});

export async function getProject({
  projectVersion = "2",
  projectId,
}: {
  projectVersion?: string;
  projectId: number;
}) {
  const data: any = await graphClient.request(projectQuery, {
    PV: projectVersion,
    ProjectId: projectId,
  });

  const projectResult = safeParse(ProjectSchema, data.projects.at(0));

  if (!projectResult.success) {
    console.error(flatten(projectResult.issues));
    throw new Error("Failed to parse project data");
  }

  const projectData = projectResult.output;

  const url = ipfsURL(cidFromURL(projectData.metadataUri));

  if (!url) {
    throw new Error("Invalid metadata URI");
  }

  const metadataResult = await fetch(url)
    .then((res) => res.json())
    .then((data) => safeParse(METADATA_V10_SCHEMA, data));

  if (!metadataResult.success) {
    console.error(flatten(metadataResult.issues));
    throw new Error("Failed to parse project data");
  }

  return { ...projectData, metadata: metadataResult.output };
}
