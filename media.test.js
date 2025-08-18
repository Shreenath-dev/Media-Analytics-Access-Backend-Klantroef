import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from './config';
import { app } from './server';

jest.mock('redis');
const { __mockClient: mockRedisClient } = require('redis');


let mongoServer;
let authToken;
let testUserId;
let serverInstance;

beforeAll(async () => {
    await mongoose.connection.close();
    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    testUserId = new mongoose.Types.ObjectId();
    authToken = jwt.sign({ userId: testUserId }, config.ACCESS_TOKEN_SECRET);

    serverInstance = app.listen();
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    serverInstance.close();
});

beforeEach(() => {
    jest.clearAllMocks();
    mockRedisClient.get.mockResolvedValue(null);
});



describe('Media API', () => {
    let mediaId;
    const API_PREFIX = '/api/v1/user';

    it('should upload a media file and save metadata', async () => {
        const res = await request(serverInstance)
            .post(`${API_PREFIX}/media`)
            .set('Authorization', `Bearer ${authToken}`)
            .field('title', 'Test Video')
            .field('type', 'video')
            .attach('mediaFile', Buffer.from('fake file content'), 'test-video.mp4');

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('Media uploaded and metadata saved successfully.');
        mediaId = res.body.mediaAsset._id;
    });

    it('should return a secure streaming URL', async () => {
        const res = await request(serverInstance)
            .get(`${API_PREFIX}/media/${mediaId}/stream-url`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.stream_url).toBe('https://s3.mock.url/signed-link');
    });

    it('should log a view for a media asset and invalidate the cache', async () => {
        const res = await request(serverInstance)
            .post(`${API_PREFIX}/media/${mediaId}/view`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(201);
        expect(mockRedisClient.del).toHaveBeenCalledWith(`analytics:${mediaId}`);
    });

    it('should fetch analytics from the database on a cache miss', async () => {
        await request(serverInstance).post(`${API_PREFIX}/media/${mediaId}/view`).set('Authorization', `Bearer ${authToken}`);

        const res = await request(serverInstance)
            .get(`${API_PREFIX}/media/${mediaId}/analytics`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.source).toBe('database');
    });

    it('should fetch analytics from the cache on a cache hit', async () => {
        const mockCachedAnalytics = { total_views: 50 };
        mockRedisClient.get.mockResolvedValue(JSON.stringify(mockCachedAnalytics));

        const res = await request(serverInstance)
            .get(`${API_PREFIX}/media/${mediaId}/analytics`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.source).toBe('cache');
    });
});
