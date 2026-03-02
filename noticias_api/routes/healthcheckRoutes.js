const express = require('express');
const router = express.Router();
const healthcheckController = require('../controllers/healthcheckController');

router.get('/',healthcheckController.healthCheck);

module.exports = router;