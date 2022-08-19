const { Router } = require('express');
const { exchangeCodeForToken, getGoogleProfile } = require('../services/google');
const router = Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = router
  .get('/login', async (req, res) => {
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&scope=${process.env.GOOGLE_SCOPE}&response_type=code&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const profile = await getGoogleProfile(token);

      let user = await User.getByEmail(profile.email);
      if (!user) {
        user = await User.insert({
          username: profile.given_name,
          email: profile.email,
          passwordHash: 'fakehash'
        });
      }

      const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/restaurants');
    } catch (e) {
      next(e);
    }
    
  });

