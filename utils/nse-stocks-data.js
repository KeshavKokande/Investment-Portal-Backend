const stockNSE = require("stock-nse-india")
const  nseIndia = new  stockNSE.NseIndia()

const asyncErrorHandler = require("./../utils/asyncErrorHandler");

// To get equity details for specific symbol
// nseIndia.getEquityDetails('IRCTC').then(details  => {
// console.log(details)
// })


// To get equity historical data for specific symbol
exports.getEquityHistoricalData = asyncErrorHandler(async (req, res, next) => {
    // const range = req.body.range;
    const range = {
        start: new Date("2024-04-08"),
        end: new Date("2024-04-08")
    }
    const data = await nseIndia.getEquityHistoricalData('IRCTC', range);
    res.status(200).json({
        status: "success",
        data
    });
}) 



const fetchStock = async (stockSymbols, startDate, endDate) => { // batch process & off weekends
    const stockData = [];
    const dateRange = getWeekdayDateRange(startDate, endDate);

    // Batch processing of stock symbols
    const symbolChunks = chunkArray(Object.keys(stockSymbols), 10); // Batch size of 10 symbols

    // Parallel execution of requests for each date
    await Promise.all(dateRange.map(async currentDate => {
        const formattedDate = currentDate.toISOString().split('T')[0];
        let totalValue = 0;

        await Promise.all(symbolChunks.map(async symbols => {
            try {
                // Get equity historical data for the current date and symbols batch
                const data = await Promise.all(symbols.map(async stock => {
                    return nseIndia.getEquityHistoricalData(stock, {
                        start: currentDate,
                        end: currentDate,
                    });
                }));

                // Calculate total value for the current date
                data.forEach((stockData, index) => {
                    if (stockData.length > 0) {
                        const closingPrice = stockData[0].data[0].CH_CLOSING_PRICE;
                        totalValue += parseFloat(stockSymbols[symbols[index]]) * closingPrice;
                    }
                });
            } catch (e) {
                console.error(`Error fetching data for ${symbols.join(', ')} on ${formattedDate}: ${e}`);
            }
        }));

        // If totalValue is positive, add it to stockData
        if (totalValue > 0) {
            stockData.push({ date: formattedDate, totalValue });
        }
    }));

    return stockData;
};

// Utility functions
function getWeekdayDateRange(startDate, endDate) {
    const dateRange = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends (Sunday and Saturday)
            dateRange.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRange;
}

function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

exports.getGraphData = asyncErrorHandler(async (req, res, next) => { // original
    const { stocks, num_days } = req.body;

    if (!stocks || typeof stocks !== 'object') {
        throw new Error('Stocks data should be in a dictionary format.');
    }

    // Calculate start and end dates
    const endDate = new Date(); // Use today's date
    const startDate = new Date(endDate.getTime() - (num_days - 1) * 24 * 60 * 60 * 1000); // Subtract num_days - 1 from today's date

    // Fetch stock data
    const stockData = await fetchStock(stocks, startDate, endDate); // added num_days for executing Manan fetchStocks

    res.status(200).json({
        status: "success",
        stockData
    });
});

exports.getEquityStockIndices = asyncErrorHandler(async (req, res, next) => {

    const equityStockIndices = await nseIndia.getEquityStockIndices('NIFTY 50');
    
    // Extract symbols and last prices
    const symbolsAndPrices = equityStockIndices.data.map(stock => ({
        [stock.symbol]: stock.lastPrice
    }));
    
    // Combine objects into a single object
    const symbolLastPriceObject = Object.assign({}, ...symbolsAndPrices);

    res.status(200).json({
        status: "success",
        data: symbolLastPriceObject,
        equityStockIndices
    });
});

exports.calculatePlanData = asyncErrorHandler(async (req, res, next) => {
    const stocks = req.body.stocks;
    const index = 'NIFTY 50'
    const data = await nseIndia.getEquityStockIndices(index);
    const individualStocks = stocks.map(stock => {
        const foundStock = data.data.find(item => item.symbol === stock.symbol);
        if (foundStock) {
            return {
                current_value: stock.qty * foundStock.lastPrice,
                symbol: stock.symbol,
                today_change_percent: foundStock.pChange,
                total_change_percent: ((foundStock.lastPrice - stock.avg_price) / stock.avg_price) * 100
            };
        } else {
            return {
                current_value: 0,
                symbol: stock.symbol,
                today_change_percent: 0,
                total_change_percent: 0
            };
        }
    });

    const totalCurrentValue = individualStocks.reduce((total, stock) => total + stock.current_value, 0);

    res.status(200).json({
        status: "success",
        individual_stocks: individualStocks,
        total_current_value: totalCurrentValue
    });
});
