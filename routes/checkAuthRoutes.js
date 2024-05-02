const express = require('express');
const path = require("path");
const passport = require("passport");

const Advisor = require("./../models/advisorModel");

const authController = require('./../controllers/authcontroller');
const checkAuthProtectController = require('./../controllers/checkAuthProtectController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.protect, authController.logout);
router.get('/hehe-client', authController.protect, authController.restrictTo('client'), checkAuthProtectController.badhiyaHai);
router.get('/hehe-advisor', authController.protect, authController.restrictTo('advisor'), checkAuthProtectController.badhiyaHai);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword)

// router.get('/signin-google', passport.authenticate('google', { scope: ['profile', 'email'] })); //http://localhost:3000/ap1/v1/check-auth/signin-google
// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), authController.OauthJWTtoken);
router.get('/signin-google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' ,session: false }), authController.OauthJWTtoken);
module.exports = router;