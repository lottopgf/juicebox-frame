import { graphClient } from "@/lib/graph";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { METADATA_V10_SCHEMA } from "@/schemas/metadataV10";
import { gql } from "graphql-request";
import { array, bigint, coerce, number, object, parse, string } from "valibot";

const projectQuery = gql`
  query Project($PV: String = "2", $ProjectId: Int!) {
    projects(where: { pv: $PV, projectId: $ProjectId }) {
      handle
      owner
      metadataUri
      paymentsCount
      volume
      volumeUSD
      currentBalance
      latestFundingCycle
      nftCollections {
        address
        name
        symbol
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
  handle: string(),
  owner: string(),
  metadataUri: string(),
  paymentsCount: number(),
  volume: coerce(bigint(), (input) => BigInt(String(input))),
  volumeUSD: coerce(bigint(), (input) => BigInt(String(input))),
  currentBalance: coerce(bigint(), (input) => BigInt(String(input))),
  latestFundingCycle: number(),
  nftCollections: array(RewardSchema),
});

export async function getProject(id: number) {
  const data: any = await graphClient.request(projectQuery, {
    ProjectId: id,
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
