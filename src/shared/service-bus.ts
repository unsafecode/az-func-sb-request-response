import { ServiceBusClient } from "@azure/service-bus";
import { DefaultAzureCredential } from "@azure/identity";
import initConfig from "./config";

const fullyQualifiedNamespace = process.env.SERVICEBUS_NAMESPACE;
const credential = new DefaultAzureCredential();
const serviceBusClient = new ServiceBusClient(
  fullyQualifiedNamespace,
  credential
);

export default serviceBusClient;