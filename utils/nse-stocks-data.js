const Stocks = require('./../models/stocksModel');

const asyncErrorHandler = require("./../utils/asyncErrorHandler");

exports.getStocksSymbols = asyncErrorHandler(async (req, res, next) => {
    const latestPricesByDate = await Stocks.aggregate([
        { $unwind: '$data' },
        { $sort: { 'data.date': -1 } },
        {
            $group: {
                _id: '$symbol',
                latest_price: { $first: '$data.price' },
            },
        },
    ]);

    const symbolPricesByDate = latestPricesByDate.reduce((acc, doc) => {
        acc[doc._id] = doc.latest_price.toString();
        return acc;
    }, {});

    res.status(200).json({
        status: 'success',
        symbolPricesByDate,
    });
});

exports.getTotalClosePrice = asyncErrorHandler(async (req, res, next) => {
    const { stocks, num_days } = req.body;

    const end_date = new Date();
    const start_date = new Date(end_date - num_days * 24 * 60 * 60 * 1000);

    const totalClosePriceByDate = {};

    // Retrieve historical data from MongoDB
    const stocksSymbols = Object.keys(stocks);
    const historicalData = await Stocks.find({ symbol: { $in: stocksSymbols } });

    historicalData.forEach((stock) => {
        stock.data.forEach((data) => {
            const dataDate = new Date(data.date);
            if (dataDate >= start_date && dataDate <= end_date) {
                const closePrice = data.price;
                const totalValue = closePrice * stocks[stock.symbol];
                const formattedDate = dataDate.toISOString().slice(0, 10);

                if (!totalClosePriceByDate[formattedDate]) {
                    totalClosePriceByDate[formattedDate] = totalValue;
                } else {
                    totalClosePriceByDate[formattedDate] += totalValue;
                }
            }
        });
    });

    // Format the data for output
    const formattedData = Object.keys(totalClosePriceByDate).map((date) => ({
        date,
        total_value: totalClosePriceByDate[date],
    }));

    res.status(200).json({
        status: 'success',
        data: formattedData,
    });
});

async function sortDataByDate(symbolData) {
    return symbolData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

exports.calculateSTS = asyncErrorHandler(async(req, res, next) => {
    const plansData = req.body.plans_data;
    let responseData = [];
    for (let planData of plansData) {
        let results = [];
        for (let stockData of planData.stocks) {
            let { symbol, qty, price: avgPrice } = stockData;

            if (!(symbol && qty && avgPrice)) {
                return next(new AppError('Missing data in stocks information.', 404));
            }

            let symbolData = await Stocks.findOne({ symbol }).lean();
            if (symbolData) {
                let sortedData = await sortDataByDate(symbolData.data);
                let currentPrice = sortedData[0]?.price || 0;
                let previousClose = sortedData[1]?.price || 0;
                let closePrice = sortedData[0]?.price || 0;

                let todayChangePercent = 0;
                let totalChangePercent = ((closePrice - avgPrice) / avgPrice) * 100;
                if (currentPrice !== 0 && previousClose !== 0) {
                    todayChangePercent = ((currentPrice - previousClose) / previousClose) * 100;
                    totalChangePercent = ((currentPrice - avgPrice) / avgPrice) * 100;
                }

                results.push({
                    symbol,
                    todayChangePercent: todayChangePercent.toFixed(2),
                    totalChangePercent: totalChangePercent.toFixed(2),
                    currentValue: (qty * currentPrice).toFixed(2)
                });
            } else {
                results.push({
                    symbol,
                    todayChangePercent: 'N/A',
                    totalChangePercent: 'N/A',
                    currentValue: 'N/A'
                });
            }
        }

        let totalCurrentValue = results.reduce((acc, stock) => acc + parseFloat(stock.currentValue || 0), 0);
        responseData.push({
            planId: planData._id,
            planName: planData.planName,
            individualStocks: results,
            totalCurrentGains: (((totalCurrentValue + parseFloat(planData.cash || 0) - parseFloat(planData.startVal || 0)) / Math.max(parseFloat(planData.startVal || 1), 1)) * 100).toFixed(2),
            totalCurrentValue: (totalCurrentValue + parseFloat(planData.cash || 0)).toFixed(2),
            initialValue: parseFloat(planData.startVal || 0).toFixed(2)
        });
    }

    res.status(200).json({
        status: "success",
        responseData
    });
});

// Function to calculate stocks
exports.calculateStocks = asyncErrorHandler(async(req, res, next) => {
    const stocksData = req.body.stocks;
    let results = [];
    for (let stock of stocksData) {
        let { symbol, qty, avg_price: avgPrice } = stock;

        let symbolData = await Stocks.findOne({ symbol });
        if (symbolData && symbolData.data && symbolData.data.length >= 2) {
            let sortedData = await sortDataByDate(symbolData.data);
            let currentPrice = sortedData[0].price;
            let previousClose = sortedData[1].price;
            let closePrice = sortedData[0].price;

            let todayChangePercent = ((currentPrice - previousClose) / previousClose) * 100;
            let totalChangePercent = ((currentPrice - avgPrice) / avgPrice) * 100;

            results.push({
                symbol,
                today_change_percent: todayChangePercent.toFixed(2),
                total_change_percent: totalChangePercent.toFixed(2),
                current_value: (qty * currentPrice).toFixed(2)
            });
        } else {
            // Handle case where data is not found or insufficient
            results.push({
                symbol,
                today_change_percent: 0,
                total_change_percent: 0,
                current_value: 0
            });
        }
    }

    let totalCurrentValue = results.reduce((acc, stock) => acc + parseFloat(stock.current_value || 0), 0);
    totalCurrentValue = totalCurrentValue.toFixed(2);
    res.status(200).json({
        individual_stocks: results,
        total_current_value: totalCurrentValue
    });
})