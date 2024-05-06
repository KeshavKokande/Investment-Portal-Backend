const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

module.exports = async function getPlanDescription(stocks) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `Write a description and a name of a investment plan which consists of stocks: ${stocks}. Do not disclose the stock names and leverage the returns on these stocks in the last 2 years. Keep the description within 5 lines and appealing to the new plan buyers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}