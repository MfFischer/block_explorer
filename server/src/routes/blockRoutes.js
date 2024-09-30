const express = require('express');
const router = express.Router();
const { getBlockData } = require('../controllers/blockController');

// Define the route
router.get('/:blockNumber', getBlockData);

module.exports = router;