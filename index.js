require("dotenv-vars");
const { Context } = require('@osaas/client-core');
const { ValkeyDb } = require('@osaas/client-db');

const logger = require("./src/helpers/logHelper");
const port = process.env.PORT || 3000;

async function server() {
  const context = new Context();
  const db = new ValkeyDb({ context, name: 'mydb' });
  await db.init();

  const redisUrl = await db.getRedisUrl();
  process.env.REDIS_URL = redisUrl.hostname;
  process.env.REDIS_PORT = redisUrl.port;

  const fastify = require("fastify")({
    ignoreTrailingSlash: true
  });
  await fastify.register(require("fastify-express"));
  const cors = require("cors");
  fastify.use(cors());

  const fastifyRateLimit = require("fastify-rate-limit");
  fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  fastify.register(require("./src/routes"), {
    prefix: "/position"
  });

  return fastify;
}

server()
  .then(fastify => {
    /** Start the server */
    fastify.listen(port, "0.0.0.0", () => {
      logger.log(
        `Continue Watching API is listening at ${fastify.server.address().port}`
      );
    });
  })
  .catch(err => {
    throw err;
  });
