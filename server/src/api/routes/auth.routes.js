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
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

module.exports = router;
