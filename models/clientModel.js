const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter the name!!!']
    },
    email: {
        type: String,
        required: [true, 'Email is required for advisor']
    },
    userIdCredentials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    age: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    agreement: {
        type: Boolean,
        default: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'], 
    },
    jobRole: {
        type: String,
        default: ""
    },
    qualification: {
        type: String,
        default: ""
    },
    question_0: {
        type: String,
        default: ""
    },
    question_1: {
        type: String,
        default: ""
    },
    question_2: {
        type: String,
        default: ""
    },
    question_3: {
        type: String,
        default: ""
    },
    question_4: {
        type: String,
        default: ""
    },
    planIds: {
        type: [String]
    },
    subscribedPlanIds: {
        type: [{
            planId: String,
            subscriptionDate: Date,
            subscriptionExpires: Date,
        }]
    },
    advisorIds: {
        type: [String]
    },
    photoId: {
        data: Buffer, // Store image data as buffer
        contentType: String // Store image content type
    },
    profilePhoto: {
        data: Buffer, // Store image data as buffer
        contentType: String // Store image content type
    }
},  {
    collection: "clients",
    versionKey: false,
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;