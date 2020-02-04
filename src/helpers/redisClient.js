const redis = require("redis");

const config = {
  redisUrl: process.env.REDIS_URL || "127.0.0.1",
  redisPort: process.env.REDIS_PORT || 6379,
  redisAuth: process.env.REDIS_AUTH || ""
};

const client = redis.createClient(config.redisPort, config.redisUrl);
if (config.redisAuth) {
  client.auth(config.redisAuth, err => {
    if (err) {
      throw err;
    }
  });
}

module.exports = client;
