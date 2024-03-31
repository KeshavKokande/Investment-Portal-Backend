const Notification = require("./../models/notificationModel");
const asyncErrorHandler = require("./asyncErrorHandler");

exports.triggerNotification = asyncErrorHandler(async (message, senderId, recipientId) => {
    const notification = new Notification({
        message,
        sender: senderId,
        recipient: recipientId
    })
    await notification.save();
    console.log("Notification triggered successfully!!!");
})