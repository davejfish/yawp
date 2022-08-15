const { Router } = require('express');
const router = Router();
const Restaurant = require('../models/restaurants');

module.exports = router
  .get('/', async (req, res, next) => {
    try {
      const response = await Restaurant.getAll();
      res.json(response);
    } catch (e) {
      next(e);
    }
  });
