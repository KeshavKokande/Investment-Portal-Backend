const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');

const User = require('../models/userModel');

const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const AppError = require("./../utils/appError");

exports.sendOTP = asyncErrorHandler(async (req, res) => {
    const { email } = req.body;
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    // If user found with provided email
    if (checkUserPresent) {
      return next(new AppError('User is already registered', 404));
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });   

    let result = await OTP.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
    
});