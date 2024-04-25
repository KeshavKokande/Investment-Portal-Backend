const stockNSE = require("stock-nse-india")
const { format, subDays } = require('date-fns');

const  nseIndia = new  stockNSE.NseIndia()

const asyncErrorHandler = require("./../utils/asyncErrorHandler");

// To get equity details for specific symbol
// nseIndia.getEquityDetails('IRCTC').then(details  => {
// console.log(details)
// })


// To get equity historical data for specific symbol
// exports.getEquityHistoricalData = asyncErrorHandler(async (req, res, next) => {
//     // const range = req.body.range;
//     const range = {
//         start: new Date("2024-04-08"),
//         end: new Date("2024-04-08")
//     }
//     const data = await nseIndia.getEquityHistoricalData('IRCTC', range);
//     res.status(200).json({
//         status: "success",
//         data
//     });
// }) 



// // Utility functions
// function getWeekdayDateRange(startDate, endDate) {
//     const dateRange = [];
//     let currentDate = new Date(startDate);

//     while (currentDate <= endDate) {
//         if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends (Sunday and Saturday)
//             dateRange.push(new Date(currentDate));
//         }
//         currentDate.setDate(currentDate.getDate() + 1);
//     }

//     return dateRange;
// }

// function chunkArray(array, size) {
//     const chunks = [];
//     for (let i = 0; i < array.length; i += size) {
//         chunks.push(array.slice(i, i + size));
//     }
//     return chunks;
// }

// const fetchStockData = async (stockSymbol, startDate, endDate) => {
//     try {
//         // Get equity historical data for the entire date range
//         const data = await nseIndia.getEquityHistoricalData(stockSymbol, {
//             start: startDate,
//             end: endDate,
//         });

//         return JSON.stringify(data);
//     } catch (error) {
//         console.error(`Error fetching data for ${stockSymbol} from ${startDate} to ${endDate}: ${error}`);
//         return [];
//     }
// };

// exports.getGraphData = asyncErrorHandler(async (req, res, next) => {
//     const { stocks, num_days } = req.body;

//     if (!stocks || typeof stocks !== 'object') {
//         throw new Error('Stocks data should be in a dictionary format.');
//     }

//     const endDate = new Date(); // Use today's date
//     const startDate = new Date(endDate.getTime() - (num_days - 1) * 24 * 60 * 60 * 1000); // Calculate start date

//     const stockSymbols = Object.keys(stocks);
//     const stockData = [];

//     // Fetch historical data for each stock
//     await Promise.all(stockSymbols.map(async stockSymbol => {
//         const data = await fetchStockData(stockSymbol, startDate, endDate);
//         console.log("data: ", data);
//         stockData.push({ symbol: stockSymbol, data });
//     }));

//     // Calculate total value for each date
//     const dateRange = getWeekdayDateRange(startDate, endDate);
//     const formattedStockData = dateRange.map(date => {
//         const formattedDate = date.toISOString().split('T')[0];
//         let totalValue = 0;

//         stockData.forEach(({ symbol, data }) => {
//             const stockPrice = data.find(entry => entry.DATE === formattedDate)?.CH_CLOSING_PRICE;
//             if (stockPrice) {
//                 totalValue += parseFloat(stocks[symbol]) * stockPrice;
//             }
//         });

//         return { date: formattedDate, totalValue };
//     });

//     res.status(200).json({
//         status: "success",
//         stockData: formattedStockData
//     });
// });


// exports.getEquityStockIndices = asyncErrorHandler(async (req, res, next) => {

//     const equityStockIndices = await nseIndia.getEquityStockIndices('NIFTY 50');
    
//     // Extract symbols and last prices
//     const symbolsAndPrices = equityStockIndices.data.map(stock => ({
//         [stock.symbol]: stock.lastPrice
//     }));
    
//     // Combine objects into a single object
//     const symbolLastPriceObject = Object.assign({}, ...symbolsAndPrices);

//     res.status(200).json({
//         status: "success",
//         data: symbolLastPriceObject,
//         equityStockIndices
//     });
// });

// exports.calculatePlanData = asyncErrorHandler(async (req, res, next) => {
//     const stocks = req.body.stocks;
//     const index = 'NIFTY 50'
//     const data = await nseIndia.getEquityStockIndices(index);
//     const individualStocks = stocks.map(stock => {
//         const foundStock = data.data.find(item => item.symbol === stock.symbol);
//         if (foundStock) {
//             return {
//                 current_value: stock.qty * foundStock.lastPrice,
//                 symbol: stock.symbol,
//                 today_change_percent: foundStock.pChange,
//                 total_change_percent: ((foundStock.lastPrice - stock.avg_price) / stock.avg_price) * 100
//             };
//         } else {
//             return {
//                 current_value: 0,
//                 symbol: stock.symbol,
//                 today_change_percent: 0,
//                 total_change_percent: 0
//             };
//         }
//     });

//     const totalCurrentValue = individualStocks.reduce((total, stock) => total + stock.current_value, 0);

//     res.status(200).json({
//         status: "success",
//         individual_stocks: individualStocks,
//         total_current_value: totalCurrentValue
//     });
// });


// exports.getEquitySeries = asyncErrorHandler(async (req, res, next) => {
//     const stock = 'IRCTC';
//     const data = await nseIndia.getEquitySeries(stock);
//     res.status(200).json({
//         status: "success",
//         data
//     });
// });



// *********************************************************************************
// exports.calculate_total_value = async (req, res, next) => {
//     const { stocks, num_days } = req.body;

//     if (!stocks || typeof stocks !== 'object') {
//         return res.status(400).json({ error: 'Stocks data should be in a dictionary format.' });
//     }

//     const endDate = new Date(); // Use today's date
//     const startDate = subDays(endDate, num_days - 1);
//     const dateRange = { start: startDate, end: endDate };

//     try {
//         const stockSymbols = Object.keys(stocks);
//         const stockData = await Promise.all(stockSymbols.map(async stockSymbol => {
//             const data = await nseIndia.getEquityHistoricalData(stockSymbol, dateRange);
//             return data[0].data; // Assuming data[0] contains the relevant data
//         }));

//         const result = {};
//         stockData.forEach(stock => {
//             stock.forEach(entry => {
//                 const date = format(new Date(entry.CH_TIMESTAMP), 'yyyy-MM-dd');
//                 const totalValue = stocks[entry.CH_SYMBOL] * entry.CH_CLOSING_PRICE;
//                 result[date] = (result[date] || 0) + totalValue;
//             });
//         });

//         const response = Object.entries(result).map(([date, total_value]) => ({
//             date,
//             total_value: total_value.toFixed(2) // Round to 2 decimal places
//         }));

//         res.status(200).json({
//             status: "success",
//             stockData: response
//         });
//     } catch (error) {
//         next(error); // Pass the error to Express's error handling middleware
//     }
// };
// *********************************************************************************
exports.calculate_total_value = asyncErrorHandler(async (req, res, next) => {
    const { stocks, num_days } = req.body;
    const end_date = new Date();
    const start_date = new Date(end_date.getTime() - num_days * 24 * 60 * 60 * 1000);

    const total_close_price_by_date = {};
    const historical_data = {};

    // Fetch historical data for each stock once
    for (const symbol of Object.keys(stocks)) {
        const range = {
            start: start_date,
            end: new Date(end_date.getTime() + 24 * 60 * 60 * 1000), // Add one day to end date
        };
        const data = await nseIndia.getEquityHistoricalData(symbol, range);
        historical_data[symbol] = data[0].data; // Assuming data[0] contains the relevant data
    }

    for (let day_delta = 0; day_delta < num_days; day_delta++) {
        const current_date = new Date(start_date.getTime() + day_delta * 24 * 60 * 60 * 1000);
        let total_close_price = 0;

        for (const [symbol, quantity] of Object.entries(stocks)) {
            const data = historical_data[symbol];

            if (data.length > 0) {
                const relevant_data = data.find(item => item.CH_TIMESTAMP === current_date.toISOString().split('T')[0]);
                if (relevant_data) {
                    const close_price = relevant_data.CH_CLOSING_PRICE;
                    total_close_price += close_price * quantity;
                }
            }
        }

        total_close_price = total_close_price.toFixed(2);
        if (total_close_price > 0) { // Only include dates with total_value > 0
            total_close_price_by_date[current_date.toISOString().split('T')[0]] = total_close_price;
        }
    }

    const result = Object.entries(total_close_price_by_date).map(([date, value]) => ({ date, total_value: value }));
    res.status(200).json({
        status: "success",
        result
    });
})
