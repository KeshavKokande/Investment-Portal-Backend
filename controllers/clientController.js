const mongoose = require('mongoose');

const Client = require("../models/clientModel");
const Advisor = require("../models/advisorModel");
const Plan = require("../models/plansModel");
const Transaction = require("../models/transactionModel");
const Notification = require("../models/notificationModel");

const notification = require("./../utils/notification");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const AppError = require('../utils/appError');

exports.register = asyncErrorHandler(async (req, res, next) => {

    const clientObj = {
        name: req.user.name,
        email: req.user.email,
        userIdCredentials: req.user._id,
        photoId: {
            data: new Buffer.from(req.body.photoId.data, 'base64'),
            contentType: req.body.photoId.contentType
        },
        profilePhoto: {
            data: new Buffer.from(req.body.profilePhoto.data, 'base64'),
            contentType: req.body.profilePhoto.contentType
        },
        address: req.body.address,
        age: req.body.age,
        phone:req.body.phone,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        qualification: req.body.qualification,
        agreement: req.body.agreement,
        question_0: req.body.question_0,
        question_1: req.body.question_1,
        question_2: req.body.question_2,
        question_3: req.body.question_3,
        question_4: req.body.question_4
    };

    const client = await Client.create({...clientObj});

    // Convert the buffer to a base64-encoded string
    const base64ImageData = client.photoId.data.toString('base64');

    res.status(201).json({
        status: 'success',
        client: {
                ...client.toObject(),
                photoId: {
                    ...client.photoId.toObject(),
                    data: base64ImageData
                }
            }
    });
})

exports.listOfAllAdvisors = asyncErrorHandler(async (req, res, next) => {
    const listOfNamesOfAdvisors = await Advisor.find();
    
    res.status(200).json({
        status: 'success',
        listOfNamesOfAdvisors
    });
});

exports.listOfPlans = asyncErrorHandler(async (req, res, next) => {

    const advisorId = req.params.advisorId;

    const client = await Client.findOne({ userIdCredentials: req.user._id });

    const plans = await Plan.find({ 
        advisorId,
        _id: { $nin: client.planIds } 
    });
        
    res.status(200).json({
        status: 'success',
        plans
    });
})

exports.buyAPlan = asyncErrorHandler( async(req, res, next) => {

    const planId = req.params.planId;
    const advisorId = req.params.advisorId;
  
    const plan = await Plan.findById(planId);
    const client = await Client.findOne({ userIdCredentials: req.user._id });
    const advisor = await Advisor.findById(advisorId);

    if(!client){
        return next(new AppError('U need to first register urself to make profile!!!', 404));
    }

    if(client.planIds.includes(plan._id)){
        return next(new AppError('This plan u already buied u moron!!! (⩺_⩹)', 400));
    }

    // const planStatsObj = plan.stocks.map(stock => ({
    //     stockName: stock.stockName,
    //     contriAmount: (stock.contri / 100) * req.body.investedAmount
    // }));

    const transaction = await Transaction.create({
        planId,
        planName: plan.planName,
        advisorId,
        clientId : client._id,
        clientName: client.name,
        investedAmount: req.body.investedAmount,
        // planStats: planStatsObj
    });

    if(!advisor.clientIds){
        advisor.clientIds = [];
        advisor.clientIds.push(client._id.toString());
        await advisor.save()
    } else {
        if (!advisor.clientIds.includes(client._id.toString())) {
            advisor.clientIds.push(client._id.toString());
            await advisor.save();
        }
    }

    if(!client.advisorIds){
        client.advisorIds = [];
        client.planIds = [];
        client.advisorIds.push(advisor._id.toString());
        client.planIds.push(plan._id.toString());
        await client.save();
    } else {
        if (!client.advisorIds.includes(advisor._id.toString())){
            client.advisorIds.push(advisor._id.toString());
        }
        if(!client.planIds.includes(plan._id.toString())){
            client.planIds.push(plan._id.toString());
        }
        await client.save();
    }

    plan.noOfSubscription += 1;
    await plan.save();
    notification.triggerNotification(`${client.name} bought your plan, ${plan.planName}`, client.userIdCredentials, advisor.userIdCredentials);
    res.status(201).json({
        status: 'success',
        transaction
    });
})

exports.listOfAdvisors = asyncErrorHandler(async (req, res, next) => {
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    const advisorObjectIds = client.advisorIds.map(id => new mongoose.Types.ObjectId(id));

    const advisors = await Advisor.find({ _id: { $in: advisorObjectIds } });

    res.status(200).json({
        status: 'success',
        advisors
    });
})

exports.listOfSubscribedPlans = asyncErrorHandler(async (req, res, next) => {
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    const transactions = await Transaction.find({ clientId: client._id });

    const AdvisorIds = transactions.map(transaction => {
        return transaction.advisorId
    });

    const advisorNames = await Promise.all(AdvisorIds.map(async (id) => {
        const advisor = await Advisor.findById(id).select('name');
        return advisor.name; // Return the name of the advisor
    }));

    res.status(200).json({
        status: 'success',
        transactions,
        advisorNames
    });
})

exports.listOfSubscribedPlansDetails = asyncErrorHandler( async(req, res, next) => {
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    const transactions = await Transaction.find({ clientId: client._id });

    let totalCumulativeProfit = 0;
    let profits = [];

    transactions.forEach(transaction => {
        let totalProfit = 0; // Initialize total profit for each transaction separately

        transaction.planStats.forEach(stat => {
            // Generate a random value between -0.03 and 0.05
            const randomMultiplier = Math.random() * (0.05 + 0.03) - 0.03;
            const profitForStat = stat.contriAmount * randomMultiplier;
            console.log(`${stat.contriAmount} : `, randomMultiplier, "Profit: ", profitForStat);

            totalProfit += profitForStat; // Calculate profit for each stat
        });

        console.log("*********************************")
        const cumulativeProfit = transaction.investedAmount + totalProfit;
        console.log("Profit from this plan: ", totalProfit)
        console.log("Initial Invested Amount in this plan: ", transaction.investedAmount)
        console.log("Return from this plan: ", cumulativeProfit)
        console.log();
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log()
        totalCumulativeProfit += cumulativeProfit;
        profitElement = {
            planId: transaction.planId,
            profit: totalProfit
        }
        profits.push(profitElement);
    });

    res.status(200).json({
        status: 'success',
        profits
    });
})

exports.browseAllPlans = asyncErrorHandler(async (req, res, next) => {
    const plans = await Plan.find();

    res.status(200).json({
        status: 'success',
        plans
    })
});

exports.getAdvisor = asyncErrorHandler(async (req, res, next) => {
    const advisorId = req.params.advisorId;

    const advisor = await Advisor.findById(advisorId);

    res.status(200).json({
        status: 'success',
        advisor
    });
})

exports.getOwnDetails = asyncErrorHandler(async (req, res, next) => {
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    res.status(200).json({
        status: 'success',
        client
    });
})

exports.editProfile = asyncErrorHandler(async (req, res, next) => {
    const clientObj = {...req.body};
    const client = await Client.findOne({ userIdCredentials: req.user._id });
 
    const updatedClient = await Client.findByIdAndUpdate(client._id, clientObj, {new: true });
 
    res.status(200).json({
        status: 'success',
        updatedClient
    });
})

exports.getAllNotification = asyncErrorHandler(async (req, res, next) => {
    const notifications = await Notification.find({ recipient: req.user._id });

    res.status(200).json({
        status: 'success',
        notifications
    });
})