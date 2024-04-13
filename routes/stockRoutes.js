const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");

const stocks = require('./../utils/nse-stocks-data');

router.get('/getEquityHistoricalData', stocks.getEquityHistoricalData);
router.post('/daysandgraph', stocks.getGraphData);
router.get('/getEquityStockIndices', stocks.getEquityStockIndices);
router.post('/calculatePlanData', stocks.calculatePlanData);

module.exports = router;