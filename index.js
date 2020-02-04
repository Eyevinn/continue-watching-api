const server = require("./src/server");
const logger = require("./src/helpers/logHelper");
const port = process.env.PORT || 3000;

/** Start the server */
server.listen(port, "0.0.0.0", err => {
  if (err) {
    throw err;
  }
  logger.log(
    `Continue Watching API is listening at ${server.server.address().port}`
  );
});
