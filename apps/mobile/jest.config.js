module.exports = {
  presets: ['ts-jest'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@truzon/types/(.*)$': '<rootDir>/../../packages/types/src/$1',
    '^@truzon/validation/(.*)$': '<rootDir>/../../packages/validation/src/$1',
    '^@truzon/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
    '^@truzon/api-client/(.*)$': '<rootDir>/../../packages/api-client/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};