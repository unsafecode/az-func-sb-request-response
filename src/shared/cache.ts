import { createClient, Multi, RedisClient } from "redis";
import bluebird from "bluebird";

// See https://docs.microsoft.com/it-it/azure/azure-cache-for-redis/cache-nodejs-get-started#connect-to-the-cache
// Convert Redis client API to use promises, to make it usable with async/await syntax
bluebird.promisifyAll(RedisClient.prototype);
bluebird.promisifyAll(Multi.prototype);

export class Cache {
  cnn: RedisClient;
  constructor() {
    this.cnn = createClient(
      6380,
      process.env.REDISCACHEHOSTNAME,
      {
        auth_pass: process.env.REDISCACHEKEY,
        tls: { servername: process.env.REDISCACHEHOSTNAME },
      }
    );
  }

  async getAsync(keys: string[]) {
    //   this.cnn.hgetall()
  }
}
