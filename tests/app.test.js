// tests/app.test.js
const request = require('supertest');
const app = require('./../app');

describe('Test API routes', () => {
    it('should respond with 404 for non-existing routes', async () => {
        await request(app)
            .get('/non-existing-route')
            .expect(404);
    });

    it('should respond with 200 for existing route', async () => {
        await request(app)
            .get('/api/v1/check-auth') // Assuming this is an existing route
            .expect(200);
    });
});

// You can write more test cases to cover other routes and scenarios
