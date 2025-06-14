// controllers/salesController.js

const Order = require('../models/salesModel');

const getTopMonthlySellers = async (req, res) => {
    try {
        // parse query, fall back to today’s month/year if invalid or missing
        const now = new Date();
        const rqMonth = parseInt(req.query.month, 10);
        const rqYear = parseInt(req.query.year, 10);
        const monthParam = !isNaN(rqMonth) ? rqMonth : now.getMonth() + 1;
        const yearParam = !isNaN(rqYear) ? rqYear : now.getFullYear();

        // fetch only that month/year
        const orders = await Order.find({
            month: monthParam,
            year: yearParam
        });

        // aggregate
        const agg = orders.reduce((acc, o) => {
            if (!acc[o.product]) {
                acc[o.product] = { totalUnits: 0, totalSales: 0 };
            }
            acc[o.product].totalUnits += o.quantity;
            acc[o.product].totalSales += o.subtotal;
            return acc;
        }, {});

        // compute totals
        const totalUnits = Object.values(agg).reduce((s, x) => s + x.totalUnits, 0);
        const totalSalesNum = Object.values(agg).reduce((s, x) => s + x.totalSales, 0);

        // top 10 formatted
        const topProducts = Object.entries(agg)
            .map(([product, { totalUnits, totalSales }]) => ({
                product,
                totalUnits,
                totalSales: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(totalSales),
            }))
            .sort((a, b) => b.totalUnits - a.totalUnits)
            .slice(0, 10);

        const formattedTotalSales = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(totalSalesNum);

        return res.json([{
            month: monthParam,
            year: yearParam,
            topProducts,
            totalUnits,
            totalSales: formattedTotalSales,
        }]);
    } catch (err) {
        console.error("Error fetching top sellers:", err);
        return res.status(500).send("Internal Server Error");
    }
};

// shared pipeline builder
function buildPipeline(groupField) {
    return [
        {
            $group: {
                _id: { year: "$year", key: { $ifNull: [`$${groupField}`, 'n/a'] } },
                totalGross: { $sum: "$total" }
            }
        },
        { $sort: { '_id.year': 1, '_id.key': 1 } },
        {
            $group: {
                _id: '$_id.year',
                categories: { $push: { category: '$_id.key', totalGross: '$totalGross' } },
                combinedTotalGross: { $sum: '$totalGross' }
            }
        },
        {
            $project: {
                _id: 1,
                combinedTotalGross: 1,
                categories: {
                    $map: {
                        input: '$categories', as: 'c',
                        in: {
                            category: '$$c.category',
                            totalGross: '$$c.totalGross',
                            percentage: { $round: [{ $multiply: [{ $divide: ['$$c.totalGross', '$combinedTotalGross'] }, 100] }, 1] }
                        }
                    }
                }
            }
        },
        { $sort: { _id: 1 } }
    ];
}

// GET /sales/annual-type
async function getGrossByYearAndType(req, res) {
    try {
        const result = await Order.aggregate(buildPipeline('category'));
        res.json(result);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

// GET /sales/annual-brand
async function getGrossByYearAndBrand(req, res) {
    try {
        const result = await Order.aggregate(buildPipeline('holding'));
        res.json(result);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


module.exports = { getTopMonthlySellers, getGrossByYearAndType, getGrossByYearAndBrand };
