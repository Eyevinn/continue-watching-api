const redisClient = require("./helpers/redisClient");

const KEY_ASSET = (userId, assetId) => `${userId}:${assetId}`;
const KEY_USER = userId => `*${userId}*`;
const ONE_YEAR = 1 * 60 * 60 * 24 * 365;

const store = async (userId, assetId, position) => {
  if (!userId || !assetId || !position) return false;
  const success = await redisClient.setex(
    KEY_ASSET(userId, assetId),
    ONE_YEAR,
    position
  );
  return success;
};

const get = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const position = await redisClient.get(KEY_ASSET(userId, assetId));
  return position;
};

const list = async userId => {
  if (!userId) return false;
  const keys = await redisClient.keys(KEY_USER(userId));
  if (!keys) return [];

  const requestPromises = [];
  keys.forEach(key => {
    requestPromises.push(getInclExpiration(key));
  });
  const continueWatchingList = await Promise.all(requestPromises);
  if (!continueWatchingList) return [];

  continueWatchingList.sort((a, b) => b.expiration - a.expiration);
  return continueWatchingList;
};

const getInclExpiration = async key => {
  const val = await redisClient.get(key);
  const expiration = await redisClient.ttl(key);
  const item = { assetId: key.split(":")[1], position: val, expiration };
  return item;
};

const del = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const success = await redisClient.del(KEY_ASSET(userId, assetId));
  return success;
};

module.exports = {
  store,
  get,
  list,
  del
};
