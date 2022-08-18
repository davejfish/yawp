const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const router = Router();
const Restaurant = require('../models/restaurants');

module.exports = router
  .delete('/review/:id', authenticate, async (req, res, next) => {
    try {
      const response = await Restaurant.deleteReview(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/:restid/reviews', authenticate, async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        rest_id: req.params.restid,
        user_id: req.user.id
      };
      const response = await Restaurant.insert(data);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/search/:id', async (req, res, next) => {
    try {
      const response = await Restaurant.getByName(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/:restid', async (req, res, next) => {
    try {
      const response = await Restaurant.getByID(req.params.restid);
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
