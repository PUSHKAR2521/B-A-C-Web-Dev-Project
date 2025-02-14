const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.redirect('/bac');
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.redirect('/bac');
  }
};

module.exports = isAuthenticated;
