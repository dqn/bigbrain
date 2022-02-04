/**
 * @type {import('@jest/types').Config.InitialOptions}
 * */
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  verbose: true,
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};
