const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  username: 'faker',
  email: 'fake@fake.com',
  password: 'fakehash',
};

const agent = request.agent(app);

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });

  it('#GET /restaurants should return a list of restaurants', async () => {
    const response = await request(app).get('/api/v1/restaurants');

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
    });
  });

  it('#GET /restaurants/:id should return a restaurant with reviews', async () => {
    const response = await request(app).get('/api/v1/restaurants/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: '1',
      name: 'Imagine',
      reviews: [
        'best miso ramen of all time',
        '15/10 best ever',
        'karaage so juicy',
      ]
    });
  });

  it('#POST /restaurants/review should add a review for a restaurant', async () => {
    const failure = await request(app).post('/api/v1/restaurants/review').send({
      rest_id: 2,
      user_id: 4,
      review: 'testing a review'
    });

    expect(failure.status).toBe(401);

    const user = await agent.post('/api/v1/user').send(mockUser);

    const response = await agent.post('/api/v1/restaurants/review').send({
      rest_id: 2,
      user_id: user.body.id,
      review: 'testing a review'
    });

    expect(response.status).toBe(200);
  });
  
});
