const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");

const stocks = require('./../utils/nse-stocks-data');

router.get('/get_symbol_lastprice', stocks.getStocksSymbols);
router.post('/calculate_total_value', stocks.getTotalClosePrice);
router.post('/calculate_sts', stocks.calculateSTS);
router.post('/calculate', stocks.calculateStocks);

module.exports = router;