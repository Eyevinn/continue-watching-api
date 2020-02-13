const positionRepository = require("./positionRepository");

module.exports = (fastify, opts, next) => {
  fastify.post("/:userId/:assetId/:position", async (req, res) => {
    const userId = req.params.userId;
    const assetId = req.params.assetId;
    const position = req.params.position;

    const store = await positionRepository.store(userId, assetId, position);
    res
      .header("Cache-Control", "public, no-cache")
      .code(200)
      .send(store);
  });

  fastify.get("/:userId/:assetId", async (req, res) => {
    const userId = req.params.userId;
    const assetId = req.params.assetId;

    const position = await positionRepository.get(userId, assetId);
    if (!position) {
      return res.code(404).send();
    }
    res
      .header("Cache-Control", "public, no-cache")
      .code(200)
      .send(position);
  });

  fastify.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    const keys = await positionRepository.list(userId);
    res
      .header("Cache-Control", "public, no-cache")
      .code(200)
      .send(keys);
  });

  next();
};
