const mongoose = require("mongoose");
const validator = require("validator");

const keyValueSchema = new mongoose.Schema({
    stockName: String,
    contriAmount: Number
});

const transactionSchema = new mongoose.Schema({
    planId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    planName: {
        type: String,
        default: ""
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    advisorId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Advisor'
    },
    clientName: {
        type: String,
        required: [true, 'Need the client Name :)']
    },
    investedAmount: {
        type: Number,
        required: [true, 'Need to know how much u r investing !']
    }, //these planStats need to be removed according to new business model
    planStats: {
        type: [keyValueSchema],
        validate: {
            validator: function(value) {
                // Calculate the total invested amount sum
                const totalInvestedAmount = value.reduce((acc, curr) => acc + curr.contriAmount, 0);
                // Check if the total invested amount is equal to the investedAmount
                return totalInvestedAmount === this.investedAmount;
            },
            message: props => `Total contributed amount should be equal to investedAmount`
        },
        required: [true, 'need the planstate man']
    }
},
{
    collection: "transactions",
    versionKey: false,
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;