module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.test.json",
    },
  },
  testEnvironment: "node",
  collectCoverage: true,
  verbose: true,
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
