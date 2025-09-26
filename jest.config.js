module.exports = {
  // The directory where Jest should output its coverage files
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: 'coverage',
  // The file extensions Jest should scan for tests
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  // Any transformations to apply to test files before running them
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
};
