const express = require('express')

const { getTopMonthlySellers } = require('../controllers/sales')

const router = express.Router()

router.get('/top-sellers', getTopMonthlySellers)

module.exports = router