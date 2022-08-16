const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  username: 'fake', 
  password: '123456',
  email: 'test@example.com'
};

const agent = request.agent(app);

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });

  it('#POST /user should create and sign in a new user', async () => {
    const response = await agent.post('/api/v1/user').send(mockUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      username: 'fake',
      id: '4',
      email: 'test@example.com',
      message: 'successfully signed in',
      success: true,
    });
  });

  it('#POST /sign-in should sign in an existing user', async () => {
    const response = await agent.post('/api/v1/user/sign-in').send({
      username: 'yawper',
      email: 'yawper@yawp.com',
      password: 'fakehash',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'successfully signed in',
      success: true,
    });
  });

  it('#GET /users should return a list of all users if admin', async () => {

    const failure = await request(app).get('/api/v1/user/users');
    expect(failure.status).toBe(401);

    await agent.post('/api/v1/user').send({
      username: 'fake',
      email: 'admin',
      password: 'fakehash'
    });
    const response = await agent.get('/api/v1/user/users');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
    });
  });

  it('#GET /profile/:id gets a user with all reviews', async () => {
    await agent.post('/api/v1/user').send({
      username: 'fake',
      email: 'admin',
      password: 'fakehash'
    });
    const response = await agent.get('/api/v1/user/users/profile/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      username: 'yawper',
      email: 'yawper@yawp.com',
      reviews: [
        'best miso ramen of all time',
        '15/10 best ever',
        'KARAAGE CURRY!!!!',
        'new york style pizza in Japan. 8/10.',
      ],
    });
  });
  
});
