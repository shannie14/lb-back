const express = require('express')

const { getTopMonthlySellers, getGrossByYearAndType, getGrossByYearAndBrand } = require('../controllers/sales')

const router = express.Router()

router.get('/top-sellers', getTopMonthlySellers)
router.get('/annual-type', getGrossByYearAndType)
router.get('/annual-brand', getGrossByYearAndBrand)

module.exports = router