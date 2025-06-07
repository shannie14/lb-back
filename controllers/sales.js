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

const getGrossByYearAndType = async (req, res) => {
    try {
        const grossByYearAndType = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: "$year",
                        category: { $ifNull: ["$category", "n/a"] }
                    },
                    totalGross: { $sum: "$total" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.category": 1 }
            },
            {
                $group: {
                    _id: "$_id.year",
                    categories: {
                        $push: {
                            category: "$_id.category",
                            totalGross: "$totalGross"
                        }
                    },
                    combinedTotalGross: { $sum: "$totalGross" }
                }
            },
            {
                $project: {
                    _id: 1,
                    combinedTotalGross: 1,
                    categories: {
                        $map: {
                            input: "$categories",
                            as: "category",
                            in: {
                                category: "$$category.category",
                                totalGross: "$$category.totalGross",
                                percentage: {
                                    $round: [
                                        {
                                            $multiply: [
                                                { $divide: ["$$category.totalGross", "$combinedTotalGross"] },
                                                100
                                            ]
                                        },
                                        1 // Round to the nearest tenth
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json(grossByYearAndType);
    } catch (error) {
        res.status(500).json({ message: "Error fetching gross by year and category", error });
    }
};

module.exports = { getTopMonthlySellers, getGrossByYearAndType };
