const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    order_id: {
        type: String,
    },
    date: {
        type: String,
    },
    month: {
        type: Number,
    },
    year: {
        type: Number,
    },
    sku: {
        type: String,
    },
    product: {
        type: String,
    },
    category: {
        type: String,
    },
    holding: {
        type: String,
    },
    unitPrice: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    subtotal: {
        type: Number,
    },
    tax: {
        type: Number,
    },
    shipping: {
        type: Number,
    },
    total: {
        type: Number,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },

})

// Mongoose automatically looks for the plural, lowercased version of your model name (1st argument)
const Order = mongoose.model('lbsales', salesSchema);

module.exports = Order;
