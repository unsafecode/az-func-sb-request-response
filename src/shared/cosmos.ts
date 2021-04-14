import { CosmosClient } from "@azure/cosmos";
import initConfig from "./config";

const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

export default cosmosClient;