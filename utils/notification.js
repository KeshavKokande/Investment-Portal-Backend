const Client = require("../models/clientModel");
const Notification = require("./../models/notificationModel");

const asyncErrorHandler = require("./asyncErrorHandler");

exports.triggerNotification = async (message, senderId, recipientId) => {
    try{
        const notification = new Notification({
            message,
            sender: senderId,
            recipient: recipientId
        })
        await notification.save();
        console.log(`Notification triggered successfully: ${message}`);
    } catch (err) {
        console.error("Error triggering notifications: ", err);
        next(err);
    }
}

exports.triggerMultipleNotification = async (message, senderId, recipientIds) => {
    try {
        for (const recipientId of recipientIds) {
            const client = await Client.findOne({ _id: recipientId });
            const personalizedMessage = message.replace(/\*/g, client.name);  // Replace all occurrences of '*'
            const notification = new Notification({
                message: personalizedMessage,
                sender: senderId,
                recipient: recipientId
            });
            await notification.save();
        }
        console.log(`Notifications triggered successfully: ${message}`);
    } catch (err) {
        console.error("Error triggering notifications:", err);
        next(err);
    }
}


exports.viewNotification = asyncErrorHandler(async (req, res, next) => {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { seen: true }, { new: true });

    res.status(200).json({
        status: "success",
        notification
    });
})