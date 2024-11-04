require('dotenv').config();

const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 8080;
// set DEMO_MODE to false if in test environment
process.env.DEMO_MODE =
  process.env.NODE_ENV === 'test' ? 'false' : process.env.DEMO_MODE;
console.log('Demo mode enabled:', process.env.DEMO_MODE);

// connect to MongoDB database
require('./db')();

// Import your financial advice function
const provideFinancialAdvice = require('./ai_advice/ai_advisory'); // Adjust path if necessary

// configure routes
app.use('/links', require('./routes/links'));
app.use('/plaid', require('./routes/plaid'));

const userId = 'user';
// New route for financial advice
app.post('/api/advice', async (req, res) => {
  console.log("Received Data:", req.body);
  const { totalBudget, totalIncome, totalSpend, savingsRate, userQuery } = req.body;

  // Ensure all required fields are present
  if (!totalBudget || !totalIncome || !totalSpend || !savingsRate|| !userQuery) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  // console.log("In index.js");
  // console.log("USER :", userId);
  // console.log("Total Budget:", totalBudget);
  // console.log("Total Income:", totalIncome);
  // console.log("Total Spend:", totalSpend);
  // console.log("Savings Rate:", savingsRate);
  // console.log("User Query:", userQuery);

  try {
      const advice = await provideFinancialAdvice(userId, totalBudget, totalIncome, totalSpend, savingsRate, userQuery);
      res.json({ advice });
  } catch (error) {
      console.error('Error fetching financial advice:', error);
      res.status(500).json({ error: 'Failed to get advice. Please try again.' });
  }
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}...`);
});

module.exports = server;
