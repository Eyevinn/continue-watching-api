const redisClient = require("../helpers/redisClient");

const KEY_ASSET = (userId, assetId) => `${userId}:${assetId}`;
const KEY_USER = userId => `*${userId}*`;

const store = (userId, assetId, position) => {
  return new Promise((resolve, reject) => {
    if (!userId || !assetId || !position) return reject();
    redisClient.set(KEY_ASSET(userId, assetId), position, (err, reply) => {
      if (err || !reply) return reject();
      return resolve(reply);
    });
  });
};

const get = (userId, assetId) => {
  return new Promise((resolve, reject) => {
    if (!userId || !assetId) return reject();
    redisClient.get(KEY_ASSET(userId, assetId), (err, reply) => {
      if (err || !reply) return reject();
      return resolve(reply);
    });
  });
};

const list = userId => {
  return new Promise((resolve, reject) => {
    if (!userId) return reject();
    redisClient.keys(KEY_USER(userId), (err, keyList) => {
      if (err || !keyList) return reject();
      return resolve(keyList);
    });
  });
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
