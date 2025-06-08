const express = require('express')

const { getDailyOrders } = require('../controllers/daily')

const router = express.Router()

router.get('/', getDailyOrders)



module.exports = router