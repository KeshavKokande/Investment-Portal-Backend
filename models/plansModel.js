const mongoose = require("mongoose");
const validator = require("validator");

const keyValueSchema = new mongoose.Schema({
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock'
    },
    dateOfBuying: {
        type: Date,
        default: Date.now()
    },
    dateOfSelling: Date,
    contri: Number
});

const plansSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, 'Need to name a plan!!!']
    },
    capValue: {
        type: Number,
        // Sum of Investment amounts by clients (those who buyied this plan)
    },
    maxVal: {
        type: String,   
        required: [true, 'Enter the max- value']
    },
    returnProfitPercentage: {
        type: String,
    },
    risk: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
            required: true
    },
    advisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advisor'
    },
    minInvestmentAmount: {
        type: Number,
        required: [true, 'Atleast this amount need to be invested!']
    },
    noOfSubscription: {
        type: Number,
        default: 0
    },
    advise: {
        type: String,
        required: [true, 'Add you advise, cause thats ur sale speech']
    },
    stocks: {
        type: [keyValueSchema],
        validate: {
            validator: function(value) {
                // Calculate the total contribution sum
                const totalContribution = value.reduce((acc, curr) => acc + curr.contri, 0);
                // Check if the total contribution is exactly 100
                return totalContribution === 100;
            },
            message: props => `Total contribution should sum up to 100`
        },
        required: [true, 'Stocks need to be added']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    photo: {
        data: Buffer, // Store image data as buffer
        contentType: String // Store image content type
    },
    isPremium: {
        type: Boolean,
        default: false
    }
}, {
    collection: "plans",
    versionKey: false,
    timestamps: true
});

plansSchema.methods.calculateWeightedCAGR1Y = function() {
    let weightedSumCAGR = 0;

    // Calculate weighted sum of CAGR
    this.stocks.forEach(stock => {
        weightedSumCAGR += stock.contri * stock.stockId.CAGR1Y;
    });

    // Calculate weighted CAGR1Y
    const weightedCAGR1Y = weightedSumCAGR;
    return weightedCAGR1Y;
};

const Plan = mongoose.model('Plan', plansSchema);
module.exports = Plan;