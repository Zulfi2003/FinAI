const dotenv = require("dotenv");
const OpenAI = require("openai");
const Sentiment = require('sentiment');
const { addChatRecord, Chat } = require('../models/chat');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const miniModelName = "gpt-4o-mini";
const mainModelName = "gpt-4o-mini";

// Sentiment analysis instance
const sentiment = new Sentiment();
const userId= "user";
// Function to fetch user's past context from the database using Mongoose
const fetchUserContext = async (userId) => {
  try {
    const context = await Chat.findOne({ userId });
    return context || {}; // Return empty object if no context found
  } catch (error) {
    console.error("Error fetching user context:", error);
    return {};
  }
};

// Function to save or update the user's context in the database using Mongoose
const saveUserContext = async (userId, contextData) => {
  try {
    await Chat.updateOne(
      { userId },
      { $set: contextData },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error saving user context:", error);
  }
};

// Function to analyze sentiment of a given text
const getSentimentScore = (text) => {
  const result = sentiment.analyze(text);
  return result.score; // Positive, negative, or neutral sentiment score
};

// Function to generate a prompt using gpt-4o-mini
const generatePromptWithMiniModel = async (userId, totalBudget, totalIncome, totalSpend, savingsRate, userQuery) => {
  try {
    const userContext = await fetchUserContext(userId);
    const sentimentScore = getSentimentScore(userQuery);
    const tone = sentimentScore < 0 ? "encouraging" : "neutral"; // Adjust tone based on sentiment

    const miniUserPrompt = `
      You are a helpful and ${tone} financial assistant.
      Based on previous user data: ${JSON.stringify(userContext)}.
      Current financial data:
      - Total Budget: ${totalBudget} USD
      - Expenses: ${totalSpend} USD
      - Income: ${totalIncome} USD
      - Savings Rate: ${savingsRate}%
      User query: ${userQuery}
      Generate a prompt for the gpt-4o-mini model accoridng to the user query.Make it like it just response in 3-4 lines only not descriptive and ask for more detil about a specific topic or area of interest they would like to know make it feel like conversative.dont ask about information you have already with you.
    `;

    const openAiClient = new OpenAI({
      baseURL: endpoint,
      apiKey: token,
      dangerouslyAllowBrowser: true
    });

    const response = await openAiClient.chat.completions.create({
      messages: [
        { role: "system", content: "You are a prompt generator for a financial assistant." },
        { role: "user", content: miniUserPrompt }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: miniModelName
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating prompt with mini model:", error.response ? error.response.data : error.message);
    return "Error generating prompt. Please try again later.";
  }
};

// Function to get financial advice using gpt-4o
const getFinancialAdvice = async (userId, prompt) => {
  try {
    const openAiClient = new OpenAI({
      baseURL: endpoint,
      apiKey: token,
      dangerouslyAllowBrowser: true
    });

    const response = await openAiClient.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful financial assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: mainModelName
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching financial advice:", error.response ? error.response.data : error.message);
    return "Error retrieving advice. Please try again later.";
  }
};

// Main function to generate personalized financial advice
const provideFinancialAdvice = async (userId, totalBudget, totalIncome, totalSpend, savingsRate, userQuery) => {
  try {
    const prompt = await generatePromptWithMiniModel(userId, totalBudget, totalIncome, totalSpend, savingsRate, userQuery);
    const advice = await getFinancialAdvice(userId, prompt);

    // Update the context with the latest query and advice
    await saveUserContext(userId, { lastQuery: userQuery, lastAdvice: advice });

    // Log the chat session in the database
    await addChatRecord(userId, userQuery, advice);

    return advice;
  } catch (error) {
    console.error("Error providing financial advice:", error);
    return "Error retrieving advice. Please try again later.";
  }
};

// Export the function for use in other parts of the application
module.exports = provideFinancialAdvice;