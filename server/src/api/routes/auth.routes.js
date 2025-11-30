const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken
} = require('../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');

// AUTH ROUTES (must match frontend exactly)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshAccessToken);

module.exports = router;