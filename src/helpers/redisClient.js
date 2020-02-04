const redis = require("redis");
const promisifyAll = require("util-promisifyall");

const config = {
  redisUrl: process.env.REDIS_URL || "127.0.0.1",
  redisPort: process.env.REDIS_PORT || 6379,
  redisAuth: process.env.REDIS_AUTH || ""
};

promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient(config.redisPort, config.redisUrl);
if (config.redisAuth) {
  client.auth(config.redisAuth, err => {
    if (err) {
      throw err;
    }
  });
}

module.exports = client;
