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
      message: 'successfully signed in',
      success: true,
    });
  });

});
