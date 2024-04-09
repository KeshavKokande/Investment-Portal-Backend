const stockNSE = require("stock-nse-india")
const  nseIndia = new  stockNSE.NseIndia()

const asyncErrorHandler = require("./../utils/asyncErrorHandler");
// To get all symbols from NSE
exports.getStocksSymbols = asyncErrorHandler(async (req, res, next) =>{
    const symbols = await nseIndia.getAllStockSymbols();
    res.status(200).json({
        status: "success",
        symbols
    });
});

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


// const fetchStock = async (stockSymbols, numDays) => {
//   const endDate = new Date();

//   const stockData = [];

//   for (let i = 0; i < numDays; i++) {
//     const currentDate = new Date(endDate - i * 24 * 60 * 60 * 1000);
//     const formattedDate = currentDate.toISOString().split('T')[0];
//     let totalValue = 0;

//     for (const stock of Object.keys(stockSymbols)) {
//        const details = await nseIndia.getEquityHistoricalData(stock, {
//             start: currentDate,
//             end: currentDate,
//         });


//         if (details.length > 0) {
//           const price = details[0].close;
//           totalValue += parseFloat(stockSymbols[stock]) * price;
//         }
//     }

//     if (totalValue > 0) {
//       stockData.push({ date: formattedDate, totalValue });
//     }
//   }

//   return stockData;
// };
const fetchStock = async (stockSymbols, startDate, endDate) => {
    const stockData = [];

    // Loop through each day between startDate and endDate
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        let totalValue = 0;

        // Loop through each stock symbol
        for (const stock of Object.keys(stockSymbols)) {
            try {
                // Get equity historical data for the current date
                const data = await nseIndia.getEquityHistoricalData(stock, {
                    start: currentDate,
                    end: endDate,
                });

                // If data is available, calculate total value
                if (data.length > 0) {
                    const closingPrice = data[0].data[0].CH_CLOSING_PRICE;
                    totalValue += parseFloat(stockSymbols[stock]) * closingPrice;
                }
            } catch (e) {
                console.error(`Error fetching data for ${stock}: ${e}`);
            }
        }

        // If totalValue is positive, add it to stockData
        if (totalValue > 0) {
            stockData.push({ date: formattedDate, totalValue });
        }
    }

    return stockData;
};


exports.getGraphData = asyncErrorHandler(async (req, res, next) => {
    const { stocks, num_days } = req.body;

    if (!stocks || typeof stocks !== 'object') {
        throw new Error('Stocks data should be in a dictionary format.');
    }

    // Calculate start and end dates
    const endDate = new Date(); // Use today's date
    const startDate = new Date(endDate.getTime() - (num_days - 1) * 24 * 60 * 60 * 1000); // Subtract num_days - 1 from today's date

    // Fetch stock data
    const stockData = await fetchStock(stocks, startDate, endDate);

    res.status(200).json({
        status: "success",
        stockData
    });
});
