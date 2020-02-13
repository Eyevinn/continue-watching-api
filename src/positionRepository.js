const redisClient = require("./helpers/redisClient");

const KEY_PREFIX = "resume";
const generateKey = (...args) => args.join(":");
const ONE_YEAR = 1 * 60 * 60 * 24 * 365;

const store = async (userId, assetId, position) => {
  if (!userId || !assetId || !position) return false;
  const key = generateKey(KEY_PREFIX, userId, assetId);
  const success = await redisClient.setex(
    key,
    ONE_YEAR,
    position
  );
  return success;
};

const get = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const key = generateKey(KEY_PREFIX, userId, assetId);
  const position = await redisClient.get(key);
  return position;
};

const list = async userId => {
  if (!userId) return false;
  const pattern = generateKey(`*${KEY_PREFIX}`, `${userId}*`);
  const keys = await redisClient.keys(pattern);
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
  const assetId = key.split(":").pop();
  const item = { assetId, position: val, expiration };
  return item;
};

const del = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const key = generateKey(KEY_PREFIX, userId, assetId);
  const success = await redisClient.del(key);
  return success;
};

module.exports = {
  store,
  get,
  list,
  del
};
