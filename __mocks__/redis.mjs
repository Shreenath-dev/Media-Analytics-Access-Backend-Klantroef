const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(),
  on: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
};

const redis = {
  createClient: jest.fn(() => mockRedisClient),
  __mockClient: mockRedisClient,
};

module.exports = redis;
