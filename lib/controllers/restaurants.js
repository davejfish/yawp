const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const router = Router();
const Restaurant = require('../models/restaurants');

module.exports = router
  .delete('/review/:id', authenticate, async (req, res, next) => {
    try {
      const response = await Restaurant.delete(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/review', authenticate, async (req, res, next) => {
    try {
      const response = await Restaurant.insert(req.body);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const response = await Restaurant.getByID(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const response = await Restaurant.getAll();
      res.json(response);
    } catch (e) {
      next(e);
    }
  });
