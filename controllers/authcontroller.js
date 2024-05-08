const AppError = require('./../utils/appError');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const sendEmail = require('./../utils/email');

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

const { appendFile } = require('fs');

dotenv.config({ path: './config.env' });

const signToken = (email) => {
    return jwt.sign({email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.email);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'None',
        secure: true
    };

    // if(process.env.NODE_ENV === 'production'x){
    //     cookieOptions.secure = true
    // }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
    // if(user.role === 'client'){
    //     res.redirect('/api/v1/check-auth/welcome-client');
    // } else {
    //     res.redirect('/api/v1/check-auth/welcome-advisor');
    // }
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
    const cookieOptions = {
        expires: new Date(Date.now() - 10 * 1000), // Set to expire 10 seconds ago
        httpOnly: true
    };

    // Set the cookie 'jwt' with an expired date, effectively deleting it
    res.cookie('jwt', '', cookieOptions);
    res.status(200).json({ 
        status: 'success',
        message: 'Logged Out !!! :)'
    });
    // res.redirect('/api/v1/check-auth/home');
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
 
exports.OauthJWTtoken = asyncErrorHandler(async(req, res, next) => {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
 
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        domain: 'invest-public.azurewebsites.net'
    };
 
    res.cookie('jwt', token, cookieOptions);
    const user = await User.findById(req.user);
    const registeredUser = await Client.findOne({ userIdCredentials: user._id });
    if(!registeredUser){
        res.cookie('name',user.name);
        res.cookie('email',user.email);
        res.redirect("https://invest-public.azurewebsites.net/client_registration_form");
    } else {
        res.redirect("https://invest-public.azurewebsites.net/client_dashboard")
    }
   
})
