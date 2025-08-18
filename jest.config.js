module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],

  testTimeout: 50000,

  clearMocks: true,

  testEnvironment: 'node',

  coverageProvider: 'v8',
};
