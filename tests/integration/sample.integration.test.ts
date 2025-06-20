import request from 'supertest';
import app from '../../src/app';

describe('Integration Tests', () => {
  it('should return a 200 status for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should create a user and return the user object', async () => {
    const newUser = { name: 'John Doe', email: 'john@example.com' };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });
});