const express = require('express')

const { getTopMonthlySellers, getGrossByYearAndType } = require('../controllers/sales')

const router = express.Router()

router.get('/top-sellers', getTopMonthlySellers)
router.get('/annual-type', getGrossByYearAndType)

module.exports = router