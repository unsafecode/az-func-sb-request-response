import { AzureFunction, Context } from "@azure/functions";
import { QueryBus } from "@shared/cqrs";
import cosmosClient from "@shared/cosmos";
import { GetUserQueryResult } from "@models/user";

const serviceBusTopicTrigger: AzureFunction = async function (
  context: Context,
  query: any
): Promise<void> {
  context.log("Query for ID: " + query.id);

  const { database } = await cosmosClient.databases.createIfNotExists({
    id: "test",
  });
  const { container } = await database.containers.createIfNotExists({
    id: "list",
  });
  const { resource } = await container.item(query.id, query.id).read();

  await QueryBus.respondAsync<GetUserQueryResult>(
    resource,
    context.bindingData.userProperties.replyToSessionId
  );

  context.done();
};

export default serviceBusTopicTrigger;
