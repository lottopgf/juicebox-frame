import { graphClient } from "@/lib/graph";
import { gql } from "graphql-request";
import {
  boolean,
  flatten,
  nullable,
  number,
  object,
  pipe,
  safeParse,
  string,
  transform,
} from "valibot";

const cycleQuery = gql`
  query Cycle($Cycle: ID! = "2-618-3") {
    fundingCycles(where: { id: $Cycle }) {
      startTimestamp # when the cycle starts
      endTimestamp # when the cycle ends
      weight # the number of tokens issued per ETH paid in (fixed-point with 18 decimals)
      reservedRate # the percentage of tokens being reserved, as a fraction out of 10_000
      useDataSourceForPay # whether the NFT contract is being used when the project is paid
    }
  }
`;

const CycleSchema = object({
  startTimestamp: number(),
  endTimestamp: nullable(number()),
  weight: pipe(
    string(),
    transform((input) => BigInt(String(input)))
  ),
  reservedRate: number(),
  useDataSourceForPay: boolean(),
});

export async function getCycle({
  projectVersion = "2",
  projectId,
  cycleId,
}: {
  projectVersion?: string;
  projectId: number;
  cycleId: number;
}) {
  const data: any = await graphClient.request(cycleQuery, {
    Cycle: `${projectVersion}-${projectId}-${cycleId}`,
  });

  const result = safeParse(CycleSchema, data.fundingCycles.at(0));

  if (!result.success) {
    console.error(flatten(result.issues));
    throw new Error("Failed to parse cycle data");
  }

  return result.output;
}
