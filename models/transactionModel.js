const mongoose = require("mongoose");
const validator = require("validator");

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
    },
    date: {
        type: Date,
        default: Date.now()
    }
},
{
    collection: "transactions",
    versionKey: false,
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;