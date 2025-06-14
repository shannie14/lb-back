const Order = require('../models/salesModel');

const getDailyOrders = async (req, res) => {

    const orders = await Order.find({})
        .sort({ date: 1 })
        .lean();               // lean=plain JS objects, slightly faster
    res.status(200).json(orders);

};

module.exports = { getDailyOrders };
