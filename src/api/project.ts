import { graphClient } from "@/lib/graph";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { METADATA_V10_SCHEMA } from "@/schemas/metadataV10";
import { gql } from "graphql-request";
import {
  array,
  bigint,
  coerce,
  nullable,
  number,
  object,
  parse,
  string,
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
  volume: coerce(bigint(), (input) => BigInt(String(input))),
  volumeUSD: coerce(bigint(), (input) => BigInt(String(input))),
  trendingVolume: coerce(bigint(), (input) => BigInt(String(input))),
  currentBalance: coerce(bigint(), (input) => BigInt(String(input))),
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

  const projectData = parse(ProjectSchema, data.projects.at(0));

  const url = ipfsURL(cidFromURL(projectData.metadataUri));

  if (!url) {
    throw new Error("Invalid metadata URI");
  }

  const projectMetadata = await fetch(url)
    .then((res) => res.json())
    .then((data) => parse(METADATA_V10_SCHEMA, data));

  return { ...projectData, metadata: projectMetadata };
}
