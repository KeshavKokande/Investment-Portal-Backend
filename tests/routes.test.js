// tests/routes.test.js
const request = require('supertest');
const app = require('./../app'); // assuming your app.js is in the project root

// Mock the authcontroller
jest.mock('./../controllers/authcontroller', () => {
    const originalModule = jest.requireActual('./../controllers/authcontroller');

    return {
        ...originalModule,
        protect: jest.fn((req, res, next) => {
            // Mock implementation for protect middleware
            req.user = { role: 'client' }; // Mock user object
            next();
        }),
        restrictTo: jest.fn(roles => (req, res, next) => {
            // Mock implementation for restrictTo middleware
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            next();
        })
    };
});

describe('Test /api/v1/check-auth routes', () => {
    it('should return 401 for unauthenticated user', async () => {
        await request(app)
            .get('/api/v1/check-auth/hehe-client')
            .expect(401);
    });

    it('should return 403 for unauthorized user', async () => {
        await request(app)
            .get('/api/v1/check-auth/hehe-advisor')
            .set('Authorization', 'Bearer validAccessTokenForClient')
            .expect(403);
    });

    it('should return 200 for authorized user', async () => {
        await request(app)
            .get('/api/v1/check-auth/hehe-client')
            .set('Authorization', 'Bearer validAccessTokenForClient')
            .expect(200);
    });

    // You can write more test cases to cover other routes and scenarios
});
