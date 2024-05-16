const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");

const stocks = require('./../utils/nse-stocks-data');

router.get('/get_symbol_lastprice', stocks.getStocksSymbols);
router.get('/calculate_total_value', stocks.getTotalClosePrice);
module.exports = router;