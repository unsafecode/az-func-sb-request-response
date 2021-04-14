import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { QueryBus } from "@shared/cqrs";
import { GetUserQuery, GetUserQueryResult } from "@models/user";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { id } = req.query;
  const result = await QueryBus.queryAsync<GetUserQuery, GetUserQueryResult>({
    id,
  });

  context.res = {
    status: 200 /* Defaults to 200 */,
    body: result,
  };
};

export default httpTrigger;
