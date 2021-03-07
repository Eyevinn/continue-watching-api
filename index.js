require("dotenv-vars");
const logger = require("./src/helpers/logHelper");
const port = process.env.PORT || 3000;

async function server() {
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
