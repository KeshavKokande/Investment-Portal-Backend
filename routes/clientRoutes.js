const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");
const clientController = require("../controllers/clientController");

const stocks = require('./../utils/nse-stocks-data');

router.post('/register-client', authController.protect, authController.restrictTo('client'), clientController.register)
router.get('/get-all-advisors', authController.protect, authController.restrictTo('client'), clientController.listOfAllAdvisors);
router.get('/list-of-plans/:advisorId', authController.protect, authController.restrictTo('client'), clientController.listOfPlans)
router.post('/subscribePlan/advisor/:advisorId/plan/:planId', authController.protect, authController.restrictTo('client'), clientController.buyASubscription);
router.post('/invest-on-a-plan/advisor/:advisorId/plan/:planId', authController.protect, authController.restrictTo('client'), clientController.investPlan);
router.get('/getAdvisors', authController.protect, authController.restrictTo('client'), clientController.listOfAdvisors);
router.get('/get-subscribed-plans', authController.protect, authController.restrictTo('client'), clientController.listOfSubscribedPlans);
router.get('/get-returns-of-subscribed-plans', authController.protect, authController.restrictTo('client'), clientController.listOfSubscribedPlansDetails)
router.get('/get-all-plans', authController.protect, authController.restrictTo('client'), clientController.browseAllPlans);
router.get('/getAdvisor/:advisorId', authController.protect, authController.restrictTo('client'), clientController.getAdvisor);
router.get('/get-own-details', authController.protect, authController.restrictTo('client'), clientController.getOwnDetails);
router.patch('/edit-profile',authController.protect, authController.restrictTo('client'), clientController.editProfile);
router.get('/get-all-notifications', authController.protect, authController.restrictTo('client'), clientController.getAllNotification);
router.get('/get-all-investedPlans', authController.protect, authController.restrictTo('client'), clientController.investedPlans);
router.get('/get-transactions', authController.protect, authController.restrictTo('client'), clientController.allTransactions);

module.exports = router;