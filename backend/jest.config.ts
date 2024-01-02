import { Config } from 'jest';

const jestConfig: Config = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  globals: {
    jest: true,
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/build',
    '<rootDir>/coverage',
    '<rootDir>/dist',
    '<rootDir>/node_modules',
    '<rootDir>/mocks',
  ],
  modulePaths: ['<rootDir>/src/'],
  preset: 'ts-jest',
  roots: ['<rootDir>/src/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  verbose: true,
};

module.exports = jestConfig;
