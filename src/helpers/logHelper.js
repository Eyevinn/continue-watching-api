const log = logMessage => {
  if (process.env.NODE_ENV !== "production") {
    console.log(logMessage);
  }
};

module.exports = {
  log
};
