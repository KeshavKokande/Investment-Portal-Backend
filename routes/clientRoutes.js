const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");
const clientController = require("../controllers/clientController");

router.post('/register-client', authController.protect, authController.restrictTo('client'), clientController.register)
router.get('/get-all-advisors', authController.protect, authController.restrictTo('client'), clientController.listOfAllAdvisors);
router.get('/list-of-plans/:advisorId', authController.protect, authController.restrictTo('client'), clientController.listOfPlans)
router.post('/buyPlan/advisor/:advisorId/plan/:planId', authController.protect, authController.restrictTo('client'), clientController.buyAPlan);
router.get('/getAdvisors', authController.protect, authController.restrictTo('client'), clientController.listOfAdvisors);
router.get('/get-subscribed-plans', authController.protect, authController.restrictTo('client'), clientController.listOfSubscribedPlans);
router.get('/get-returns-of-subscribed-plans', authController.protect, authController.restrictTo('client'), clientController.listOfSubscribedPlansDetails)
router.get('/get-all-plans', authController.protect, authController.restrictTo('client'), clientController.browseAllPlans);
router.get('/getAdvisor/:advisorId', authController.protect, authController.restrictTo('client'), clientController.getAdvisor);
router.get('/get-own-details', authController.protect, authController.restrictTo('client'), clientController.getOwnDetails);
router.patch('/edit-profile',authController.protect, authController.restrictTo('client'), clientController.editProfile);
router.get('/get-all-notifications', authController.protect, authController.restrictTo('client'), clientController.getAllNotification);

module.exports = router;