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

exports.viewNotification = asyncErrorHandler(async (req, res, next) => {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { seen: true }, { new: true });

    res.status(200).json({
        status: "success",
        notification
    });
})