const express = require('express');
const router = express.Router();
const { getRefinedTranscript } = require('../controllers/refine.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/', protect, getRefinedTranscript);

module.exports = router;