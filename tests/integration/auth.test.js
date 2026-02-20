const request = require('supertest');
const { start } = require('../../index');
const { User } = require('../../models/user');
const { generateAuthToken } = require('../../models/user');
const { sequelize } = require('../../startup/db');

jest.setTimeout(15000);

let server;

describe('auth middleware', () => {

  beforeAll(async () => {
    server = await start();
    await sequelize.sync({ force: true }); // Ensure tables exist
  });

  afterAll(async () => {
    await sequelize.close();
    await server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post('/api/genres') // Using genres endpoint to test auth
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  beforeEach(async () => {
    // Clear users table before each test
    await User.destroy({ where: {} });

    // Create a test user
     const user = await User.create({
    name: 'Test User',        
    email: 'test@test.com',   
    password: 'password123',  
    isAdmin: true              
  });

    // Generate token for this user
    token = generateAuthToken({ id: user.id, isAdmin: true });
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'abc';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 201 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });

});
