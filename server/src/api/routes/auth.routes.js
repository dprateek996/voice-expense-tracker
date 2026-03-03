const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../../middleware/validation.middleware');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
