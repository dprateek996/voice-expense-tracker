// src/api/routes/auth.routes.js

const express = require('express');
const {
  register,
  login,
  refreshAccessToken,
  getMe,
  logout,
} = require('../controllers/auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;
