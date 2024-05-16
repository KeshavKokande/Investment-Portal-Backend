const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable || `AIzaSyDOPt0fkC3LA74JL2MOCY5kTx_l2uSn1Sk`
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function getPlanDescription(stocks) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `Write a description and a name of a investment plan which consists of stocks: ${stocks}. Do not disclose the stock names and leverage the returns on these stocks in the last 2 years. Keep the description within 5 lines and appealing to the new plan buyers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

async function getOnboardingWelcomeMessage(userName) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `Write a welcome onboarding message to a new user name ${userName} on our application name inVEST. It does have financial advisors and each advisor have their plans, which consists of stocks and client can subscribe to the premium plans to keep record of the stocks that are rebalanced according to live stocks data`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

module.exports = {
    getPlanDescription,
    getOnboardingWelcomeMessage
};
