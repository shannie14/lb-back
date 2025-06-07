// controllers/salesController.js

const Order = require('../models/salesModel');

const getTopMonthlySellers = async (req, res) => {
    try {
        const currentDate = new Date();
        const past30DaysDate = new Date();
        past30DaysDate.setDate(currentDate.getDate() - 30);

        // Fetch and filter last 30 days of orders
        const orders = await Order.find({});
        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= past30DaysDate && orderDate <= currentDate;
        });

        // Aggregate units & sales per product
        const aggregatedOrders = filteredOrders.reduce((acc, order) => {
            if (!acc[order.product]) {
                acc[order.product] = { totalUnits: 0, totalSales: 0 };
            }
            acc[order.product].totalUnits += order.quantity;
            acc[order.product].totalSales += order.subtotal;
            return acc;
        }, {});

        // Compute overall totals
        const totalUnits = Object.values(aggregatedOrders)
            .reduce((sum, item) => sum + item.totalUnits, 0);
        const totalSalesNumber = Object.values(aggregatedOrders)
            .reduce((sum, item) => sum + item.totalSales, 0);

        // Format products for JSON
        const formattedOrders = Object.entries(aggregatedOrders)
            .map(([product, { totalUnits, totalSales }]) => ({
                product,
                totalUnits,
                totalSales: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(totalSales),
            }))
            .sort((a, b) => b.totalUnits - a.totalUnits)
            .slice(0, 6);

        // Format overall total sales
        const formattedTotalSales = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(totalSalesNumber);

        // === WRAP YOUR RESPONSE IN AN ARRAY ===
        const payload = [{
            topProducts: formattedOrders,
            totalUnits,
            totalSales: formattedTotalSales,
        }];

        return res.json(payload);
    } catch (error) {
        console.error("Error fetching top sellers:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { getTopMonthlySellers };
