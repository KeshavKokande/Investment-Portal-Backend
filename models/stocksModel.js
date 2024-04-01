const mongoose = require("mongoose");
const axios = require('axios');

const stockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        unique: true,
        uppercase: true
    },
    historical: {
      type: [
        {
          date: String,
          open: Number,
          high: Number,
          low: Number,
          close: Number,
          adjClose: Number,
          volume: Number,
          unadjustedVolume: Number,
          change: Number,
          changePercent: Number,
          vwap: Number,
          label: String,
          changeOverTime: Number,
        },
      ],
      select: false
    },
}, {
    collection: "stocks",
    versionKey: false,
    timestamps: true
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;