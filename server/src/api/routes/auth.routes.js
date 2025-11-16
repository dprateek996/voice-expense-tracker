const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
} = require('../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../../middleware/validation.middleware');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);
router.get('/me', protect, getMe);

module.exports = router;
