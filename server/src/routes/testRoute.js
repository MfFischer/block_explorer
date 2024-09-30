// src/routes/testRoute.js
const express = require('express');
const router = express.Router();

// Define the test route
router.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

module.exports = router;
