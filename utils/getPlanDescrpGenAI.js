const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function getPlanDescription(stocks) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `Write a description of a investment plan which consists of stocks: ${stocks}. Do not disclose the stock names and leverage the returns on these stocks in the last 2 years. Keep the description within 5 lines and appealing to the new plan buyers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

async function getOnboardingWelcomeMessage(userName) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `Write a welcome onboarding message to a new user name ${userName} on our application name inVEST. The platform has financial advisors and each advisor have their plans, which consists of stocks and client can subscribe to the premium plans to keep record of the stocks that are rebalanced according to live stocks data. The message should not be longer than 7 lines. Be welcoming and empathetic in tone.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

async function getOnbardingExploreFeatures(userName) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `A new user with name as : ${userName} joined to our application name inVEST. The platform has financial advisors and each advisor have their plans, which consists of stocks and client can subscribe to the premium plans to keep record of the stocks that are rebalanced according to live stocks data. Write the user journey how a new user can explore the features. A new user have to go through a basic questionnaire so that we can recommend some personalized financial advise to invest on some particular plans. Now user can explore the plans and advisor profile and choose any free or premium plan and subscribe to premium plan to get know about the stocks and then invest on that plan and directly invest on the free plans. We have three pricing models for subscription, user can choose whatever suits to them. The subscribed users will receive the notification for the rebalance of the stocks in the premium plans. The message should be in bullet points. Be welcoming and interesting in tone so that a new user wants to try the new features. Do not send * or ** in the message (important) and every step or point must be in next line. Make it look professional`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Users Journey Generated....")
    return text;
}

async function interestingFinancialInvestmentFact(userName) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `A new user with name as : ${userName} joined to our application name inVEST. Give a short 2 liner interesting fact or quote on investment trading related or savage quotes`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Interesting Investment Fact tip generated....")
    return text;
}

module.exports = {
    getPlanDescription,
    getOnboardingWelcomeMessage,
    getOnbardingExploreFeatures,
    interestingFinancialInvestmentFact
};
