const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const User = require('../models/users');
const UserService = require('../services/user');
const router = Router();

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = router
  .get('/users/profile/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await User.getByID(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/users', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await User.getAll();
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/sign-in', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({
          message: 'successfully signed in',
          success: true,
        });
    } catch (e) {
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const [token, user] = await UserService.createAndSignIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({
          ...user,
          message: 'successfully signed in',
          success: true,
        });
    } catch (e) {
      next(e);
    }
  });
