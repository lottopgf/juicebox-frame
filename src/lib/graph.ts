import { GraphQLClient } from "graphql-request";

const JUICEBOX_GRAPH_API_KEY = process.env.JUICEBOX_GRAPH_API_KEY!;

const JUICEBOX_GRAPH_URL = `https://subgraph.satsuma-prod.com/${JUICEBOX_GRAPH_API_KEY}/juicebox/mainnet/api`;

export const graphClient = new GraphQLClient(JUICEBOX_GRAPH_URL);
