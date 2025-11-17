const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  forgotPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../../middleware/validation.middleware');

router.post('/register', validateRegistration, register);
router.get('/login', login); // Changed to GET for testing
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

module.exports = router;
