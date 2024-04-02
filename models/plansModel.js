const mongoose = require("mongoose");
const validator = require("validator");

const keyValueSchema = new mongoose.Schema({
    // stock: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Stock'
    // },
    symbol: String,
    dateOfBuying: {
        type: Date,
        default: Date.now()
    },
    qty: {
        type: Number
    }
});

const plansSchema = new mongoose.Schema({
    planName: { // I/O
        type: String,
        required: [true, 'Need to name a plan!!!']
    },
    risk: { // I/O
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
            required: true
    },
    advisorId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advisor'
    },
    minInvestmentAmount: { // I/O
        type: Number,
        required: [true, 'Atleast this amount need to be invested!']
    },
    noOfSubscription: {
        type: Number,
        default: 0
    },
    advise: { // I/O
        type: String,
        required: [true, 'Add you advise, cause thats ur sale speech']
    },
    stocks: { // I/O
        type: [keyValueSchema],
        required: [true, 'Stocks need to be added']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    photo: {  // I/O
        data: Buffer, // Store image data as buffer
        contentType: String // Store image content type
    },
    isPremium: { // I/O
        type: Boolean,
        default: false
    },
    subscribedClientIds: {
        type: [String],
        default: [],
        required: function() {
            return this.isPremium === true;
        }
    },
    CAGR: {
        type: [Number],
        default: [0, 0, 0, 0, 0]
    },
    cash:{
        type: Number, 
        default: 0
    }
}, {
    collection: "plans",
    versionKey: false,
    timestamps: true
});

const Plan = mongoose.model('Plan', plansSchema);
module.exports = Plan;