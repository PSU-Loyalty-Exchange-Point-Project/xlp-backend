const express = require('express');
const router = express.Router();
const termsController = require('../controllers/termsController');

router.get('/terms', termsController.showTermsAndConditions);

module.exports = router;
