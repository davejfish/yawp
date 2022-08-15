const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  username: 'fake', 
  password: '123456',
  email: 'test@example.com'
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });

  it('#POST /user should create a new user', async () => {
    const response = await request(app).post('/api/v1/user').send(mockUser);
    const { username, email } = mockUser;

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      username,
      email,
    });
  });

});
