const express = require("express");

const authController = require('./../controllers/authcontroller');
const advisorController = require('./../controllers/advisorController');

const router = express.Router();

router.post('/register-advisor', authController.protect, authController.restrictTo('advisor'), advisorController.register);
router.post('/add-plans', authController.protect, authController.restrictTo('advisor'), advisorController.addPlan);
router.get('/get-own-details', authController.protect, authController.restrictTo('advisor'), advisorController.getOwndetails);
router.get('/list-of-plans', authController.protect, authController.restrictTo('advisor'), advisorController.listOfPlans);
router.get('/list-of-plans-with-more-subscriptions', authController.protect, authController.restrictTo('advisor'), advisorController.topPlans);
router.get('/list-of-clients', authController.protect, authController.restrictTo('advisor'), advisorController.listOfClients)
router.get('/get-latest-transactions-of-own-plans', authController.protect, authController.restrictTo('advisor'), advisorController.getTransactions);
router.get('/get-no-of-clients', authController.protect, authController.restrictTo('advisor'), advisorController.getNoOfClients);
router.get('/get-total-invested-amount', authController.protect, authController.restrictTo('advisor'), advisorController.totalCummulativeInvestedAmounts);
router.get('/get-total-current-profit', authController.protect, authController.restrictTo('advisor'), advisorController.cummulativeCurrentProfit);
router.patch('/deletePlan/:planId', authController.protect, authController.restrictTo('advisor'), advisorController.deletePlan);
router.get('/get-all-stocks', authController.protect, authController.restrictTo('advisor'), advisorController.getAllStocks);
router.patch('/edit-stocks/:planId', authController.protect, authController.restrictTo('advisor'), advisorController.editStocks);
router.get('/get-plan-details/:planId', authController.protect, authController.restrictTo('advisor'), advisorController.getPlan);

module.exports = router;