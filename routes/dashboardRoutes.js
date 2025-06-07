const express = require('express');
const path = require('path');
const router = express.Router();

const audienceData = require(path.join(__dirname, '../data/audience.json'));

router.get('/audience', (req, res) => {
    res.json(audienceData);
});

const socialData = require(path.join(__dirname, '../data/social.json'));

router.get('/social', (req, res) => {
    res.json({ socialData });
});

// Export the router
module.exports = router;