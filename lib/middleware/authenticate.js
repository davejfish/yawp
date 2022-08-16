const jwt = require('jsonwebtoken');
const Restaurant = require('../models/restaurants');

module.exports = async (req, res, next) => {
  try{
    const cookie = req.cookies && req.cookies[process.env.COOKIE_NAME];
    if (!cookie) throw new Error('you must be signed in to continue');
    
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;

    if (req.method === 'DELETE') {
      const query = await Restaurant.getReviewByID(req.params.id);
      if (!query) throw new Error('review does not exist');
  
      if (user.email !== 'admin' && req.user.id !== query.user_id) {
        throw new Error('You do not have permission to delete this review');
      } 
    }

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
