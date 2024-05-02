const mongoose = require("mongoose");

const advisorSchema = new mongoose.Schema({
    ratings: {
        type: String,
        default: 5.0
    },
    name: {
        type: String,
        required: [true, 'Enter the name!!!']
    },
    certificateNo: {
        type: String,
        required: [true, 'Enter the certificate number of the advisor']
    },
    email: {
        type: String,
        required: [true, 'Email is required for advisor'],
        unique: true
    },
    userIdCredentials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    clientIds: {
        type: [String]
    },
    category: {
        type: String,
        enum: ['standard', 'premium', 'executive']
    },
}, {
    collection: "advisors",
    versionKey: false,
    timestamps: true
})

const Advisor = new mongoose.model('Advisor', advisorSchema);
module.exports = Advisor;