const express = require('express');
const router = express.Router();
const behaviorController = require('../controllers/behaviorController');

router.post('/analyze-behavior', behaviorController.analyze);

module.exports = router;
