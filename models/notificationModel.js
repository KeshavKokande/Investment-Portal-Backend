const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    collection: "notification",
    versionKey: false,
    timestamps: true
});


const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;