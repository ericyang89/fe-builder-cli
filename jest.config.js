module.exports = {
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).ts?(x)'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  cacheDirectory: '<rootDir>/.cache/unit',
  preset: 'ts-jest',
};