const fastify = require("fastify")({
  ignoreTrailingSlash: true
});
const cors = require("cors");
fastify.use(cors());
fastify.register(require("./routes/position"), {
  prefix: "/position"
});

module.exports = fastify;
