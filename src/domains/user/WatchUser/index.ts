import { AzureFunction, Context } from "@azure/functions";

const cosmosDBTrigger: AzureFunction = async function (
  context: Context,
  documents: any[]
): Promise<void> {
  if (!!documents && documents.length > 0) {
    context.bindings.event = [];
    documents.forEach((doc) => {
      context.bindings.event.push(doc);
    });
  }

  context.done();
};

export default cosmosDBTrigger;
