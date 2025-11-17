const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');

// The only route in this file
router.post('/login', login);

module.exports = router;
