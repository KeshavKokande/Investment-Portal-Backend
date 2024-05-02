const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");

const stocks = require('./../utils/nse-stocks-data');

// router.get('/getEquityHistoricalData', stocks.getEquityHistoricalData);
// router.post('/daysandgraph', stocks.getGraphData);
// router.get('/getEquityStockIndices', stocks.getEquityStockIndices);
// router.post('/calculatePlanData', stocks.calculatePlanData);
// router.get('/getEquitySeries', stocks.getEquitySeries);

router.post('/calculate_total_value', stocks.calculate_total_value);

module.exports = router;