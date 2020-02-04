/* eslint-disable */
module.exports = {
  testMatch: ["**/tests/**/*.js?(x)", "!**/tests/integration/**/*.js?(x)"],
  coverageDirectory: "./coverage",
  coverageReporters: [
    "lcov"
  ],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    // Non-library folders/files
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/app/**",
    "!jest.config.js",
    "!jest.setup.js"
  ],
  globals: { "__VERSION__": "1.0.0" }
};
