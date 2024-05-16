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