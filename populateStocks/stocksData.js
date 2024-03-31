const axios = require("axios");

const Stock = require('./../models/stocksModel');

const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const AppError = require("./../utils/appError");

// List of symbols to fetch data for
const symbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
    'NVDA', 'META', 'V', 'JNJ', 'UNH',
    'WMT', 'HD', 'KO', 'BAC', 'INTC',
    'CVS', 'PFE', 'XOM', 'DIS', 'CRM',
    'NFLX', 'COST', 'LIN', 'ABT', 'MRK',
    'LLY', 'CAT', 'ADM', 'TMO'
];  
  
// API endpoint URL
const API_URL = 'https://financialmodelingprep.com/api/v3/historical-price-full';

const uploadStock = asyncErrorHandler (async (symbol) => {
    const response = await axios.get(`${API_URL}/${symbol}?apikey=9dPUZYcQb2ivJ5Fz9Ep3PIlFiIVGGl5s`);
    const historicalData = response.data.historical;
    
    // Create new stock document with fetched historical data
    const newStock = new Stock({
      symbol: symbol,
      historical: historicalData,
    });

    // Save the document to MongoDB
    await newStock.save();
    console.log(`Data for symbol ${symbol} saved successfully!`);
})

exports.fillStocks = (req, res, next) => {
    for (const symbol of symbols) {
        uploadStock(symbol);
    }
    next();
};