import request from 'supertest';
import app from '../server';
import sequelize from '../config/database';
import User from '../models/User';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should reject duplicate username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    it('should validate username length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'loginuser',
        password: 'password123'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});

