const jwt = require('jsonwebtoken');
const CareerUser = require('../models/CareerUser');

const protectCareerUser = async (req, res, next) => {
  let token;

  if (req.cookies.career_token) {
    token = req.cookies.career_token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await CareerUser.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Career Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectCareerUser };
