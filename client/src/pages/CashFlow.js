import Header from '../components/UI/Header';
import Section from '../components/UI/Section';
import NetworkErrorMessage from '../components/NetworkErrorMessage';
import NoDataAvailableMessage from '../components/NoDataAvailableMessage';
import Card from '../components/UI/Card';
import ExpenseSankeyDiagram from '../components/data-visualisations/ExpenseSankeyDiagram';
import IncomeSankeyDiagram from '../components/data-visualisations/IncomeSankeyDiagram';
import DropdownMenu from '../components/DropdownMenu';
import { useState, useEffect } from 'react';
import useAxios from '../hooks/use-axios';
import { initialFinancialData } from '../store/financial_data'; // Import initial financial data


const {
  getTransactionMonths,
  getColor,
  getTransactionName,
  formatDate,
  formatCurrency,
  formatPercent,
  humanize,
  isObjectEmpty
} = require('../utils/helpers');

const buildCard = (title, value, color, isPercent) => {
  return (
    <Card className='p-5 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105'>
      <div className='flex flex-col items-center'>
        <p className='text-sm font-semibold text-gray-600'>{title}</p>
        <p className={`text-3xl font-extrabold ${color}`}>
          {isPercent ? formatPercent(value) : formatCurrency(value)}
        </p>
      </div>
    </Card>
  );
};

let financialDataList = []; // Define a list to store financial data

const CashFlow = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [filteredTransactionData, setFilteredTransactionData] = useState(null);
  const [financial_Data, setFinancialData] = useState(initialFinancialData); // Initialize with zero values
  const { error, sendRequest } = useAxios('/links', 'get');

  useEffect(() => {
    sendRequest(response => {
      const data = response.data;
      setTransactionData(data.flatMap(link => link.transactions.data));
    });
  }, []);

  const onDropdownSelectHandler = month => {
    if (month === 'All') {
      setFilteredTransactionData(transactionData);
    } else {
      const filteredData = transactionData.filter(transaction => {
        const transactionMonth = formatDate(transaction.date);
        return transactionMonth === month;
      });
      setFilteredTransactionData(filteredData);
    }
  };

  let expenses = 0;
  let income = 0;
  let totalSavings = 0;
  let savingsRate = 0;

  let expenseData = null;
  let incomeData = null;
  if (filteredTransactionData) {
    expenseData = [['From', 'To', 'Amount']];
    incomeData = [['From', 'To', 'Amount']];

    filteredTransactionData.forEach(transaction => {
      const name = getTransactionName(transaction);
      let amount = transaction.amount;

      if (!name.startsWith('Transfer From') && !transaction.pending) {
        if (amount > 0) {
          const category = humanize(
            transaction.personal_finance_category.primary
          );
          expenses += amount;

          expenseData.push(['Spending', category, amount]);
          expenseData.push([category, name, amount]);
        } else {
          amount = Math.abs(amount);
          income += amount;
          incomeData.push([name, 'Income', amount]);
        }
      }
    });

    totalSavings = income - expenses;
    if (totalSavings > 0) {
      savingsRate = totalSavings / income;
    }
  }

  // Update the financialDataList with the calculated values
  financialDataList = {
    income,
    expenses,
    totalSavings,
    savingsRate,
  };
  
  console.log("Financial Data Object:", financialDataList);

  return (
    <>
      <Header title='Cash Flow' />
      <Section financialData={financialDataList}>
        {error && error.message === 'Network Error' && <NetworkErrorMessage />}
        {!error && isObjectEmpty(transactionData) ? (
          <NoDataAvailableMessage />
        ) : (
          <>
            {transactionData && (
              <>
                <DropdownMenu
                  items={getTransactionMonths(transactionData)}
                  label='Filter by month'
                  onSelect={onDropdownSelectHandler}
                  className='mb-5'
                  excludeAllOption={true}
                />
                <div className='mb-5 grid grid-cols-4 gap-5'>
                  {buildCard('Income', income, getColor(income))}
                  {buildCard('Expenses', expenses, getColor(-expenses))}
                  {buildCard(
                    'Total Savings',
                    totalSavings,
                    getColor(totalSavings)
                  )}
                  {buildCard('Savings Rate', savingsRate, 'text-black', true)}
                </div>
                {expenseData && expenseData.length > 1 && (
                  <Card className='mb-5'>
                    <div className='px-5 pt-5'>
                      <p className='text-sm font-semibold text-gray-500'>
                        Cash Flow
                      </p>
                      <p className='text-xl font-bold'>Expenses</p>
                    </div>
                    <ExpenseSankeyDiagram data={expenseData} />
                  </Card>
                )}
                {incomeData && incomeData.length > 1 && (
                  <Card className='mb-5'>
                    <div className='px-5 pt-5'>
                      <p className='text-sm font-semibold text-gray-500'>
                        Cash Flow
                      </p>
                      <p className='text-xl font-bold'>Income</p>
                    </div>
                    <IncomeSankeyDiagram data={incomeData} />
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </Section>
    </>
  );
};

// Export the financialDataList for use in other files
export const getFinancialData = () => financialDataList;

export default CashFlow;