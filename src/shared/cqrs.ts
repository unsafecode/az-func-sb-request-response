import { ServiceBusMessage } from "@azure/service-bus";
import serviceBusClient from "./service-bus";
const { v4: uuidv4 } = require("uuid");

export interface Query<TResult> {}

class AzSBQueryBus {
  private readonly sender = serviceBusClient.createSender(
    process.env.QUERY_TOPIC
  );

  constructor() {
    this.sender;
  }
  async queryAsync<TQuery extends Query<TResult>, TResult>(
    query: TQuery
  ): Promise<TResult> {
    const sessionId = uuidv4();

    const message: ServiceBusMessage = {
      body: query,
      replyToSessionId: sessionId,
      applicationProperties: {
        query: query.constructor.name,
        replyToSessionId: sessionId,
      },
    };
    await this.sender.sendMessages([message]);

    const receiver = await serviceBusClient.acceptSession(
      `${query.constructor.name}-result`,
      sessionId
    );
    const [result] = await receiver.receiveMessages(1);

    await receiver.close();

    return result.body as TResult;
  }

  async respondAsync<TResult>(result: TResult, sessionId: string) {
    const message: ServiceBusMessage = {
      body: result,
      sessionId: sessionId,
      applicationProperties: {
        queryResult: result.constructor.name,
      },
    };
    await this.sender.sendMessages([message]);
  }
}

interface CommandResult {
  success: boolean;
  transactionId?: string;
  error?: Error;
}

class AzSBCommandBus {
  async sendAsync<TCommand>(command: TCommand): Promise<CommandResult> {
    try {
      const sender = serviceBusClient.createSender(process.env.COMMAND_TOPIC);
      const transactionId = uuidv4();

      await sender.sendMessages([
        {
          body: command,
          applicationProperties: {
            transactionId,
            commandName: command.constructor.name,
          },
        },
      ]);

      return {
        success: true,
        transactionId,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}

const QueryBus = new AzSBQueryBus();
const CommandBus = new AzSBCommandBus();

export { QueryBus, CommandBus };
