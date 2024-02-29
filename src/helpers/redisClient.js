const Redis = require("ioredis");

const config = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_URL || "127.0.0.1",
  username: process.env.REDIS_USERNAME || "",
  password: process.env.REDIS_PASSWORD || ""
};

const client = new Redis(config);
module.exports = client;
