// require('dotenv').config();

// const cors = require('cors');
// const express = require('express');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const PORT = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 8080;
// // set DEMO_MODE to false if in test environment
// process.env.DEMO_MODE =
//   process.env.NODE_ENV === 'test' ? 'false' : process.env.DEMO_MODE;
// console.log('Demo mode enabled:', process.env.DEMO_MODE);

// // connect to MongoDB database
// require('./db')();

// // Import your financial advice function
// const provideFinancialAdvice = require('./ai_advice/ai_advisory'); // Adjust path if necessary

// // configure routes
// app.use('/links', require('./routes/links'));
// app.use('/plaid', require('./routes/plaid'));

// // New route for financial advice
// app.post('/api/advice', async (req, res) => {
//   console.log("Received Data:", req.body);
//   const { User, totalBudget, totalIncome, totalSpend, savingsRate, userQuery } = req.body;

//   // Ensure all required fields are present
//   if ( !User || !totalBudget || !totalIncome || !totalSpend || !savingsRate|| !userQuery) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }
//   // console.log("In index.js");
//   // console.log("USER :", User);
//   // console.log("Total Budget:", totalBudget);
//   // console.log("Total Income:", totalIncome);
//   // console.log("Total Spend:", totalSpend);
//   // console.log("Savings Rate:", savingsRate);
//   // console.log("User Query:", userQuery);

//   try {
//       const advice = await provideFinancialAdvice(User, totalBudget, totalIncome, totalSpend, savingsRate, userQuery);
//       res.json({ advice });
//   } catch (error) {
//       console.error('Error fetching financial advice:', error);
//       res.status(500).json({ error: 'Failed to get advice. Please try again.' });
//   }
// });

// // Start the server
// const server = app.listen(PORT, () => {
//   console.log(`app listening on port ${PORT}...`);
// });

// module.exports = server;



//2nd version

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://your-production-domain.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging for production
if (process.env.NODE_ENV === 'production') {
  const morgan = require('morgan');
  app.use(morgan('combined'));
}

// Database connection
require('./db')();

// Routes
app.use('/links', require('./routes/links'));
app.use('/plaid', require('./routes/plaid'));

// Financial advice endpoint
app.post('/api/advice', async (req, res) => {
  try {
    const { User, totalBudget, totalIncome, totalSpend, savingsRate, userQuery } = req.body;

    if (!User || !totalBudget || !totalIncome || !totalSpend || !savingsRate || !userQuery) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const provideFinancialAdvice = require('./ai_advice/ai_advisory');
    const advice = await provideFinancialAdvice(User, totalBudget, totalIncome, totalSpend, savingsRate, userQuery);
    res.json({ advice });
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    res.status(500).json({ 
      error: 'Failed to get advice. Please try again.',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message })
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Start server
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 0 : 8080);
process.env.DEMO_MODE = process.env.NODE_ENV === 'test' ? 'false' : process.env.DEMO_MODE;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = server;

