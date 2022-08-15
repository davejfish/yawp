const { Router } = require('express');
const UserService = require('../services/user');
const router = Router();

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = router
  .post('/', async (req, res, next) => {
    try {
      const token = await UserService.createAndSignIn(req.body);
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
  });
