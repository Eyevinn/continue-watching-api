const redisClient = require("../helpers/redisClient");

const KEY_ASSET = (userId, assetId) => `${userId}:${assetId}`;
const KEY_USER = userId => `*${userId}*`;

const store = async (userId, assetId, position) => {
  if (!userId || !assetId || !position) return false;
  const success = await redisClient.setAsync(
    KEY_ASSET(userId, assetId),
    position
  );
  return success;
};

const get = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const position = await redisClient.getAsync(KEY_ASSET(userId, assetId));
  return position;
};

const list = async userId => {
  if (!userId) return false;
  const keys = await redisClient.keysAsync(KEY_USER(userId));
  if (!keys) return [];

  const expectedLength = keys.length;
  let keepGoing = true;
  const continueWatchingList = [];

  while (keepGoing) {
    const key = keys.shift();
    const val = await redisClient.getAsync(key);
    const item = { assetId: key.split(":")[1], position: val };
    continueWatchingList.push(item);
    if (continueWatchingList.length >= expectedLength) {
      keepGoing = false;
      return continueWatchingList;
    }
  }
};

const del = (userId, assetId) => {
  return new Promise((resolve, reject) => {
    if (!userId || !assetId) return reject();
    redisClient.del(KEY_ASSET(userId, assetId), success => {
      return resolve(success);
    });
  });
};

module.exports = {
  store,
  get,
  list,
  del
};
