Personal Financial Management Application

<p align="center">
  <img width="1425" alt="Screenshot 2024-04-24 at 5 39 14 PM" src="https://github.com/karamvirr/personal-financial-management/assets/21179214/520d7655-a7e5-466a-9e02-cc4c3d2a2b58">
</p>


This personal finance application allows users to seamlessly connect their bank accounts and access a comprehensive view of their financial landscape all in one place. Built with React for the frontend and Node.js for the backend, this application leverages the Plaid API to securely connect with financial institutions and utilizes MongoDB for robust data storage. The backend architecture includes a custom API that ensures smooth interaction between the frontend, Plaid API, and the database. The frontend dashboard provides users with detailed visualizations of their cash flows, transactions, and account balances, enabling them to make informed financial decisions. This application is ideal for individuals looking to manage their finances effectively and gain insights into their spending habits.

🛠 Technologies

	•	React
	•	Node.js
	•	axios
	•	Express
	•	MongoDB
	•	Plaid API
	•	Jest
	•	OpenAI API - Utilized for generating financial advice and insights through AI models.

:books: Requirements

	•	Git: You will need Git to clone the repository.
	•	Node.js: Node.js 10.x or higher is required.
	•	MongoDB: The application uses MongoDB as a database. You must have MongoDB installed and running on your machine or use a cloud-based instance. MongoDB can be installed from MongoDB’s official site.
	•	npm or Yarn: You will need npm (which comes with Node.js) or Yarn to install dependencies. Install npm through Node.js or get Yarn from Yarn’s official site.
	•	Plaid API Keys: You will need to create an account on Plaid and obtain your API keys.
	•	OpenAI API Key: Sign up on OpenAI to obtain an API key for accessing the AI model used for generating financial advice.

:rocket: Getting Started

To get started with this application, follow these steps:

	1.	Clone the repository:

git clone https://github.com/karamvirr/personal-financial-management.git
cd personal-financial-management


	2.	Install backend dependencies:

cd server
npm install # or 'yarn install'


	3.	Install frontend dependencies:

cd ../client
npm install # or 'yarn install'


	4.	Set up your environment variables in a .env file located in the server directory (refer to .env.sample for additional information):

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=
PLAID_PRODUCTS=
PLAID_COUNTRY_CODES=
MONGODB_CLUSTER_URL=
OPENAI_API_KEY= # Add your OpenAI API key here

All user information will be stored in the specified MongoDB cluster. If you do not have a MongoDB cluster URL, you can use this app in demo mode, which will utilize mock data.

	5.	Run the backend:

npm run start # or 'yarn start'
# To run in demo mode, which uses a mock database, use 'npm run start:demo' or 'yarn start:demo'


	6.	In a new terminal, start the frontend:

cd client
npm run start # or 'yarn start'


	7.	Open http://localhost:3000 in your browser.

Here you can link your bank accounts and start tracking your financial transactions and account balances. The dashboard provides a comprehensive overview of your finances, including detailed visualizations of your cash flows and transactions.

:clipboard: Features

	•	Bank Account Integration: Securely link your bank accounts using the Plaid API.
	•	Financial Dashboard: Visualize your cash flows, transactions, and account balances in one place.
	•	AI-Powered Insights: Leverage the OpenAI API for personalized financial advice based on user data and queries.
	•	Demo Mode: Test the application with mock data without needing real bank connections.

:question: Contributing

Contributions are welcome! If you have suggestions for improvements or want to report issues, please open an issue or submit a pull request.
