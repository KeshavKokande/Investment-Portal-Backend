const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");

const stocks = require('./../utils/nse-stocks-data');

router.get('/getStocks', authController.protect, authController.restrictTo('client'), stocks.getStocksSymbols);
router.get('/getEquityHistoricalData', authController.protect, authController.restrictTo('client'), stocks.getEquityHistoricalData);
router.post('/daysandgraph', authController.protect, authController.restrictTo('client'), stocks.getGraphData);

module.exports = router;