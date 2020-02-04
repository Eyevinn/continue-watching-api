const redisClient = require("../helpers/redisClient");

const KEY_ASSET = (userId, assetId) => `${userId}:${assetId}`;
const KEY_USER = userId => `*${userId}*`;
const ONE_YEAR = 1 * 60 * 60 * 24 * 365;

const store = async (userId, assetId, position) => {
  if (!userId || !assetId || !position) return false;
  let success = await redisClient.setAsync(
    KEY_ASSET(userId, assetId),
    position
  );
  success = await redisClient.expireAsync(KEY_ASSET(userId, assetId), ONE_YEAR);
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
    const expiration = await redisClient.ttlAsync(key);
    const item = { assetId: key.split(":")[1], position: val, expiration };
    continueWatchingList.push(item);
    if (continueWatchingList.length >= expectedLength) {
      keepGoing = false;
      continueWatchingList.sort((a, b) => b.expiration - a.expiration);
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
