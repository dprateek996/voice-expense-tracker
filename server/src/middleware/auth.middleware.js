const { verifyAccessToken } = require('../utils/jwt.util');

const protect = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Not authorized, token invalid or expired' });
  }

  req.user = decoded;
  next();
};

module.exports = { protect };