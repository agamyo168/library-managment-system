module.exports = {
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // The file extensions Jest should scan for tests
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  // Any transformations to apply to test files before running them
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
