const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for your collection
const stocksSchema = new Schema({
    symbol: String,
    data: [{
        date: Date,
        price: Number,
    }],
}, {
  collection: "stock_prices",
  versionKey: false,
  timestamps: true
});

// Create a model based on the schema
const Stock = mongoose.model('Stock', stocksSchema);

module.exports = Stock;