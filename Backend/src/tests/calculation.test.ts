import request from 'supertest';
import app from '../server';
import sequelize from '../config/database';
import User from '../models/User';
import Calculation from '../models/Calculation';
import { generateToken } from '../utils/jwt';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Calculation API', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    const user = await User.create({
      username: 'calcuser',
      password: 'password123'
    });
    userId = user.id;
    authToken = generateToken(user.id);
  });

  describe('POST /api/calculations/starting-number', () => {
    it('should create a starting number', async () => {
      const response = await request(app)
        .post('/api/calculations/starting-number')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          startingNumber: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.calculation.startingNumber).toBe(10);
      expect(response.body.calculation.result).toBe(10);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/calculations/starting-number')
        .send({
          startingNumber: 10
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/calculations/operation', () => {
    let parentId: number;

    beforeEach(async () => {
      const calculation = await Calculation.create({
        userId,
        parentId: null,
        startingNumber: 10,
        operationType: null,
        rightOperand: null,
        result: 10
      });
      parentId = calculation.id;
    });

    it('should add an operation', async () => {
      const response = await request(app)
        .post('/api/calculations/operation')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          parentId,
          operationType: 'add',
          rightOperand: 5
        });

      expect(response.status).toBe(201);
      expect(response.body.calculation.result).toBe(15);
    });

    it('should handle division by zero', async () => {
      const response = await request(app)
        .post('/api/calculations/operation')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          parentId,
          operationType: 'divide',
          rightOperand: 0
        });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/calculations', () => {
    it('should get all calculations', async () => {
      await Calculation.create({
        userId,
        parentId: null,
        startingNumber: 20,
        operationType: null,
        rightOperand: null,
        result: 20
      });

      const response = await request(app)
        .get('/api/calculations');

      expect(response.status).toBe(200);
      expect(response.body.calculations).toBeInstanceOf(Array);
    });
  });
});

