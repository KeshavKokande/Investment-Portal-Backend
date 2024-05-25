const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require("bcrypt");
const passport = require('passport');
const dotenv = require("dotenv");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./../models/userModel');
const Client = require('./../models/clientModel');
const OTP = require('./../models/otpModel');

const AppError = require('./../utils/appError');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const mailSender = require('../utils/email');
const { getOnboardingWelcomeMessage, getOnbardingExploreFeatures, interestingFinancialInvestmentFact } = require("../utils/getPlanDescrpGenAI");

const { appendFile } = require('fs');

dotenv.config({ path: './config.env' });

const signToken = (email) => {
    return jwt.sign({email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

async function sendOnboardingEmail(email, welcomeMSG, usersJourney) {
    try {
      const mailResponse = await mailSender(
        email, 
        "Welcome to inVest",
        `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="robots" content="noindex, nofollow">
    <title>Welcome Email</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
    body {
      margin: 0;
      padding: 0;
      mso-line-height-rule: exactly;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
     }
    body, table, td, p, a, li {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: 'Lato', Arial, Helvetica, sans-serif;
    }
    table td {
      border-collapse: collapse;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      border-color: #FFFFFF;
    }
    p, a, li, td, blockquote {
      mso-line-height-rule: exactly;
    }
    p, a, li, td, body, table, blockquote {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    img, a img {
      border: 0;
      outline: none;
      text-decoration: none;
    }
    img {
      -ms-interpolation-mode: bicubic;
    }
    * img[tabindex="0"] + div {
      display: none !important;
    }
    a[href^=tel],a[href^=sms],a[href^=mailto], a[href^=date] {
      color: inherit;
      cursor: default;
      text-decoration: none;
    }
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important}
    .logo {
      width: 220px!important;
      height: 35px!important;
    }
    .logo-footer {
      width: 129px!important;
      height: 29px!important;
    }
    .table-container .alert-icon {
      width: 120px!important;
      height: 120px!important;
    }
    .table-container .avatar-img {
      width: 64px!important;
      height: 64px!important;
    }
    .x-gmail-data-detectors, .x-gmail-data-detectors * {
      border-bottom: 0 !important;
      cursor: default !important}
    @media screen {
      body {
      font-family: 'Lato', Arial, Helvetica, sans-serif;
    }
    }
    @media only screen and (max-width: 640px) {
      body {
      margin: 0px!important;
      padding: 0px!important;
    }
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: none!important;
    }
    .table-main, .table-container,.social-icons,table,.table-container td {
      width: 100%!important;
      min-width: 100%!important;
      margin: 0!important;
      float: none!important;
    }
    .table-container img {
      width: 100%!important;
      max-width: 100%!important;
      display: block;
      height: auto!important;
    }
    .table-container a {
      width: 50%!important;
      max-width: 100%!important;
    }
    .table-container .logo {
      width: 200px!important;
      height: 30px!important;
    }
    .table-container .alert-icon {
      width: 120px!important;
      height: 120px!important;
    }
    .social-icons {
      float: none!important;
      margin-left: auto!important;
      margin-right: auto!important;
      width: 220px!important;
      max-width: 220px!important;
      min-width: 220px!important;
      background: #383e56!important;
    }
    .social-icons td {
      width: auto!important;
      min-width: 1%!important;
      margin: 0!important;
      float: none!important;
      text-align: center;
    }
    .social-icons td a {
      width: auto!important;
      max-width: 100%!important;
      font-size: 10px!important;
    }
    .mobile-title {
      font-size: 34px!important;
    }
    .table-container .logo-footer {
      width: 129px!important;
      height: 29px!important;
    }
    .block-img {
      width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
    .info-block {
      padding: 0!important;
    }
    .video-img {
      width: 100%!important;
      height: auto!important;
    }
    .post-footer-container td {
      text-align: center!important;
      padding: 0 40px 0 40px!important;
    }
    }
     
    </style>
    </head>
    <body style="padding: 0; margin: 0; -webkit-font-smoothing:antialiased; background-color:#f1f1f1; -webkit-text-size-adjust:none;">
    <!--Main Parent Table -->
    <table width="100%" border="0" cellpadding="0" direction="ltr" bgcolor="#f1f1f1" cellspacing="0" role="presentation" style="width: 640px; min-width: 640px; margin:0 auto 0 auto;">
    <tbody>
    <tr>
        <td style="display:none;font-size:0;line-height:0;color:#111111;">
             Sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
        </td>
    </tr>
    <tr>
        <td>
            <!--Content Starts Here -->
            <!--Top Header Starts Here -->
            <table border="0" bgcolor="#121212" cellpadding="0" cellspacing="0" width="640" role="presentation" width="640" style="width: 640px; min-width: 640px;" align="center" class="table-container ">
            <tbody>
            <tr width="640" style="width: 640px; min-width: 640px; " align="center">
                <td>
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#f1f1f1">
                    <tr>
                        <td height="35" style="line-height:35px;min-height:35px;">
                        </td>
                    </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" width="640" style="width: 640px; min-width: 640px;" role="presentation" align="center" bgcolor="#f1f1f1">
                    <tr>
                        <td align="left">
                            <table cellpadding="0" cellspacing="0" border="0" role="presentation" align="center" bgcolor="#f1f1f1">
                            <tr>
                                <td>
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" role="presentation">
                                    <tr>
                                        <td align="center">
                                        <img src="https://drive.google.com/uc?export=view&id=1VVi6txfAqzPmIxC9AX3-tS8eMEberhZY" alt="Logo" width="220" height="35" class="logo">
                                        </td>
                                    </tr>
                                    </table>
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#f1f1f1">
                                    <tr>
                                        <td height="35" style="line-height:35px;min-height:35px;">
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                    </tr>
                    </table>
                </td>
            </tr>
            </tbody>
            </table>
            <!--Top Header Ends Here -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#f6f5f5">
            <tbody>
            <tr>
                <td valign="top" bgcolor="#383e56" background="assets/top-section-bg-01.jpg">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation">
                    <tr>
                        <td height="60" style="line-height:60px;min-height:60px;">
                        </td>
                    </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation">
                    <tbody>
                    <tr>
                        <td align="center" style="color:#FFFFFF;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:800;font-size:34px;-webkit-font-smoothing:antialiased;line-height:1.2;" class="table-container mobile-title">
                             Congratulations, you’re <br>
                             ready to get started!
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="color:#FFFFFF;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;-webkit-font-smoothing:antialiased;line-height:1.4;" class="table-container">
                             ${welcomeMSG}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:40px 40px 10px 40px;" class="table-container">
                           
                        </td>
                    </tr>
                    </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation">
                    <tr>
                        <td height="60" style="line-height:60px;min-height:60px;">
                        </td>
                    </tr>
                    </table>
                </td>
            </tr>
            </tbody>
            </table>
            <!--Welcome  Section Starts Here -->
            <table align="center" border="0" bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" width="640" role="presentation" class="table-container ">
            <tbody>
            <tr width="640" style="width: 640px; min-width: 640px;">
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation">
                    <tr>
                        <td height="25" style="line-height:25px;min-height:25px;">
                        </td>
                    </tr>
                    </table>
                    <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation">
                    <tr>
                        <td height="35" style="line-height:35px;min-height:35px;">
                        </td>
                    </tr>
                    </table>
                </td>
            </tr>
            </tbody>
            </table>
            <!--Welcome  Section Ends Here -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;text-align:center;" bgcolor="#FFFFFF" role="presentation" class="table-container ">
            <tbody>
            <tr>
                <td style="color: #45535C; font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 26px; line-height: 26px;font-weight:bold;text-align: left;padding: 0 40px;" class="table-container">
                     Your account is now active!
                </td>
            </tr>
            <tr>
                <td align="center" style="color:#5a5a5a;text-align:left;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;-webkit-font-smoothing:antialiased;line-height:1.4;" class="table-container">
                    ${usersJourney}
                </td>
            </tr>
            <tr>
                <td height="10" style="line-height:10px;min-height:10px;">
                </td>
            </tr>
            </tbody>
            </table>
            <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation">
            <tr>
                <td height="15" style="line-height:15px;min-height:15px;">
                </td>
            </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;text-align:center;" bgcolor="#FFFFFF" role="presentation">
            <tbody>
            <tr>
                <td align="left" width="64" style="color:#5a5a5a;text-align:left;padding:20px 0 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                <img src="https://drive.google.com/uc?export=view&id=179lS4W9H3ut3jenvqG39yMtG7fH-gJ3i" alt="Section Image" width="64" height="64" class="avatar-img">
                </td>
                <td align="left" width="576" style="color:#5a5a5a;text-align:left;padding:20px 0 0 20px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:15px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                     Sincerely,<br>
                     Mukul Patwal, CEO @ inVEST
                </td>
            </tr>
            </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tr>
                <td height="60" style="line-height:60px;min-height:60px;">
                </td>
            </tr>
            </table>
            <table bgcolor="#383e56" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="35" style="line-height:35px;min-height:35px;">
                </td>
            </tr>
            </table>
            <table bgcolor="#383e56" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="35" style="line-height:35px;min-height:35px;">
                </td>
            </tr>
            </table>
            <table cellpadding="0" width="640" style="width: 640px; min-width: 640px;" cellspacing="0" border="0" role="presentation" align="center" bgcolor="#383e56">
            <tbody>
            <tr>
                <td>
                    <table cellpadding="0" width="220" cellspacing="0" border="0" role="presentation" align="center" bgcolor="#383e56">
                    <tbody>
                    <tr class="social-icons">
                        <td style="padding:0 10px 0 10px;">
                        <a href="https://www.facebook.com/IncedoInc/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=19hhqtUi6pPKKbUeEvjHJ69xtHFBz1NGS" alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                        <td style="padding:0 10px 0 10px;;">
                        <a href="https://www.x.com/IncedoInc/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=1bstAJOYHMDN6DAPLpt4-0p-vjpXmLA_Q" alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                        <td style="padding:0 10px 0 10px;">
                        <a href="https://www.linkedin.com/company/incedo-inc/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=1qrmBCctKFTjmUJbast53T6J88w_BBHE1" alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                        <td style="padding:0 10px 0 10px;">
                        <a href="https://www.instagram.com/incedoinc/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=11I44tSlbzbZgNuBaXxVL62Z7gTiotJKq" alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                    </tr>
                    </tbody>
                    </table>
                </td>
            </tr>
            </tbody>
            </table>
            <table bgcolor="#383e56" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="35" style="line-height:35px;min-height:35px;">
                </td>
            </tr>
            </table>
            <table bgcolor="#383e56" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td style="color:#FFFFFF; font-size:14px; line-height:22px; text-align:center;border:none;font-weight:bold;">
                     109 Udyog Vihar, Gurugram, Haryana 122015 <br>
                     © 2024 inVEST <br>
                    </td>
            </tr>
            </table>
            <table bgcolor="#383e56" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="60" style="line-height:60px;min-height:60px;">
                </td>
            </tr>
            </table>
            <!--Bottom Section Starts Here -->
            <!-- <table bgcolor="#CCCCCC" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="1" style="line-height:1px;min-height:1px;">
                </td>
            </tr>
            </table>
            <table bgcolor="#f1f1f1" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="40" style="line-height:40px;min-height:40px;">
                </td>
            </tr>
            </table>
            <table align="center" border="0" bgcolor="#f1f1f1" cellpadding="0" cellspacing="0" width="640" role="presentation" class="table-container ">
            <tbody>
            <tr width="640" style="width: 640px; min-width: 640px;">
                <td align="left">
                    <table cellpadding="0" cellspacing="0" border="0" align="left" width="140" role="presentation" class="table-container">
                    <tbody>
                    <tr>
                        <td style="color:#444444; font-size:12px; line-height:22px; text-align:center;border:none;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">
                             Powered by:
                        </td>
                    </tr>
                    <tr>
                        <td height="20" style="line-height:20px;min-height:20px;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                        <img src="https://drive.google.com/uc?export=view&id=1VVi6txfAqzPmIxC9AX3-tS8eMEberhZY" alt="MailerSend Logo" width="129" height="29" class="logo-footer">
                        </td>
                    </tr>
                    </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" align="left" width="500" role="presentation" class="post-footer-container">
                    <tbody>
                    <tr>
                        <td style="color:#444444; font-size:18px; line-height:22px; text-align:left;border:none;font-weight:bold; padding:0 0 0 40px;">
                             Want to improve your business?
                        </td>
                    </tr>
                    <tr>
                        <td height="10" style="line-height:210px;min-height:10px;">
                        </td>
                    </tr>
                   
                    <tr>
                        <td height="20" style="line-height:20px;min-height:20px;">
                        </td>
                    </tr>
                    </tbody>
                    </table>
                    <table bgcolor="#f1f1f1" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation">
                    <tr>
                        <td height="35" style="line-height:35px;min-height:35px;">
                        </td>
                    </tr>
                    </table>
                </td>
            </tr>
            </tbody>
            </table> -->
            <!--Bottom Section Ends Here -->
            <!--Main Td  Ends Here -->
        </td>
    </tr>
    </tbody>
    <!--Main Parent Table Ends Here -->
    </table>
    </body>
    </html>
     `
      );
      console.log("Onboarding email sent successfully: ", mailResponse);
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
    }
  }

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.email);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    const { name, email, password, confirmPassword, otp } = req.body;
    // Check if all details are provided
    if (!name || !email || !password || !otp) {
        return next(new AppError(`All the credentials are necessary!!!`, 401));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 403));
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return next(new AppError('OTP is not valid!!!', 400));
    }

    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword: confirmPassword
    });
    
    const mailBody = await getOnboardingWelcomeMessage(newUser.name);
    const usersJourney = await getOnbardingExploreFeatures(newUser.name);

    await sendOnboardingEmail(newUser.email, mailBody, usersJourney);

    createSendToken(newUser, 201, res);
})

exports.login = asyncErrorHandler(async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password){
        return next(new AppError('Enter the email and password for logging in !!! :(', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new AppError('User Not found!!! :('));
    }

    if(!(await user.correctPassword(password, user.password))){
        return next(new AppError('Invalid Credentials!!! :('))
    }

    createSendToken(user, 200, res);
})

exports.protect = asyncErrorHandler(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if(req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
        console.log("Checking cookie: ");
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log("Checking headers: ");
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You are not logged in, please logged in to get access !!! (⩺_⩹)'))
    }
    
    // 2) Token Verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    let currentUser = await User.findOne({email: decoded.email});

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist ( RIP 八 ) or this user doesn\'t belong to access this route', 401))
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please login again', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

exports.restrictTo = (role) => {
    return (req, res, next) => {
        if(role !== req.user.role){
            return next(new AppError(`You are not allowed to do ${req.originalUrl}. Let me remind u, U r a ${req.user.role} ¯\\_(ツ)_/¯`, 403))
        }

        next();
    };
}

exports.logout = (req, res, next) => {
    // const cookieOptions = {
    //     expires: new Date(Date.now() - 10 * 1000), // Set to expire 10 seconds ago
    //     httpOnly: true
    // };

    // // Set the cookie 'jwt' with an expired date, effectively deleting it
    // res.cookie('jwt', '', cookieOptions);
    res.status(200).json({ 
        status: 'success',
        message: 'Logged Out !!! :)'
    });
};


exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {

    // 1. Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2. Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. Send it to users's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/check-auth/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}. \nIf you didn't forget the password, please ignore tis email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!'))
    }

})

exports.resetPassword = asyncErrorHandler(async(req, res, next) => {
    // 1. Get user based on the email
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    // 2. If a token has not expired, and there is user, set the new passwod
    if(!user){
        return next(new AppError('Token is invalid or has expired!', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3. Update changedPasswordAt property for the user

    // 4. Log the user in, send JWT
    createSendToken(user, 200, res);
});

// *************************************************************************************************************************************

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/api/v1/check-auth/auth/google/callback",
//     passReqToCallback: true
//   },
//   async function (request, accessToken, refreshToken, profile, done)  {
//     try {
//       let user = await User.findOne({ email: profile.emails[0].value });
//       if (!user) {
//         // Create a new user if one doesn't exist
//         const password = await bcrypt.hash(profile.id, 12);
//         user = await User.create({
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           password,
//           confirmPassword: password,
//           OAuthId: profile.id
//           //   role: 'client', // Default role
//         });
//       }
//       done(null, user);
//     } catch (error) {
//       done(error, false);
//     }
//   }
// ));

// exports.OauthJWTtoken = (req, res, next) => {
//     createSendToken(req.user, 200, res);
// }

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://team4api.azurewebsites.net/api/v1/check-auth/auth/google/callback",
    passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done)  {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
        // Create a new user if one doesn't exist
        const password = await bcrypt.hash(profile.id, 12);
        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password,
            confirmPassword: password,
            OAuthId: profile.id,
            isSSOUser: true
        });
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
    }
));
 
passport.serializeUser((user, cb) => {
    console.log("Serializing User: ", user);
    cb(null, user.email);
})
 
passport.deserializeUser(async( email, cb ) => {
    const user = await User.findOne({ email }).catch((err) => {
        console.log("Error in deserializing: ", err);
        cb(err, null)
    });
 
    console.log("Deserialized User:", user);
 
    if(user){
        cb(null, user);
    }
})
 
// exports.OauthJWTtoken = asyncErrorHandler(async(req, res, next) => {
//     const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
 
//     // const cookieOptions = {
//     //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//     //     httpOnly: true
//     // };
 
//     // res.cookie('jwt', token, cookieOptions);
//     const user = await User.findById(req.user);

//     const registeredUser = await Client.findOne({ userIdCredentials: user._id });
//     let newUser = '';
//     const fact = await interestingFinancialInvestmentFact(user.name);
//     let wlcmMSG = '';
//     let usersJourney = '';

//     if(!registeredUser){
//         newUser =true;
//         wlcmMSG = await getOnboardingWelcomeMessage(user.name);
//         usersJourney = await getOnbardingExploreFeatures(user.name);
//     } else {
//         newUser = false;
//     }
//     // if(!registeredUser){
//     //     res.cookie('name',user.name);
//     //     res.cookie('email',user.email);
//     //     res.redirect("https://invest-public.azurewebsites.net/client_registration_form");
//     // } else {
//     //     res.redirect("https://invest-public.azurewebsites.net/client_dashboard")
//     // }


//     res.status(200).json({
//         status: "success",
//         token,
//         newUser,
//         wlcmMSG,
//         usersJourney,
//         fact
//     });
   
// })
exports.OauthJWTtoken = asyncErrorHandler(async (req, res, next) => {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    const registeredUser = await Client.findOne({ userIdCredentials: req.user._id });

    let newUser = '';
    const fact = await interestingFinancialInvestmentFact(req.user.name);
    let wlcmMSG = '';
    let usersJourney = '';

    if (!registeredUser) {
        newUser = true;
        wlcmMSG = await getOnboardingWelcomeMessage(req.user.name);
        usersJourney = await getOnbardingExploreFeatures(req.user.name);

        await sendOnboardingEmail(req.user.email, wlcmMSG, usersJourney);

    } else {
        newUser = false;
    }

    // Send the token and additional information to a redirect URL
    const redirectUrl = `https://invest-public.azurewebsites.net/api/v1/check-auth/auth/google/callback?token=${token}&newUser=${newUser}&fact=${encodeURIComponent(fact)}&wlcmMSG=${encodeURIComponent(wlcmMSG)}&usersJourney=${encodeURIComponent(usersJourney)}`;
    res.redirect(redirectUrl);
});