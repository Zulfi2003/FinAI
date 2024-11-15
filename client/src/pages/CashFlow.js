import Header from '../components/UI/Header';
import Section from '../components/UI/Section';
import NetworkErrorMessage from '../components/NetworkErrorMessage';
import NoDataAvailableMessage from '../components/NoDataAvailableMessage';
import Card from '../components/UI/Card';
import ExpenseSankeyDiagram from '../components/data-visualisations/ExpenseSankeyDiagram';
import IncomeSankeyDiagram from '../components/data-visualisations/IncomeSankeyDiagram';
import DropdownMenu from '../components/DropdownMenu';
import { useState, useEffect, useContext } from 'react';
import useAxios from '../hooks/use-axios';

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

const CashFlow = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [filteredTransactionData, setFilteredTransactionData] = useState(null);
  const [financialDataList, setFinancialDataList] = useState({
    income: 0,
    expenses: 0,
    totalSavings: 0,
    savingsRate: 0,
  });

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

  useEffect(() => {
    if (filteredTransactionData) {
      let expenses = 0;
      let income = 0;
      let totalSavings = 0;
      let savingsRate = 0;

      filteredTransactionData.forEach(transaction => {
        const name = getTransactionName(transaction);
        let amount = transaction.amount;

        if (!name.startsWith('Transfer From') && !transaction.pending) {
          if (amount > 0) {
            expenses += amount;
          } else {
            income += Math.abs(amount);
          }
        }
      });

      totalSavings = income - expenses;
      if (totalSavings > 0) {
        savingsRate = totalSavings / income;
      }

      setFinancialDataList({
        income,
        expenses,
        totalSavings,
        savingsRate,
      });
      const financialData = { income, expenses, totalSavings, savingsRate };
      localStorage.setItem('financialDataList', JSON.stringify(financialData));
    }
  }, [filteredTransactionData]);

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
                  {buildCard('Income', financialDataList.income, getColor(financialDataList.income))}
                  {buildCard('Expenses', financialDataList.expenses, getColor(-financialDataList.expenses))}
                  {buildCard(
                    'Total Savings',
                    financialDataList.totalSavings,
                    getColor(financialDataList.totalSavings)
                  )}
                  {buildCard('Savings Rate', financialDataList.savingsRate, 'text-black', true)}
                </div>
                {filteredTransactionData && financialDataList.expenses > 0 && (
                  <Card className='mb-5'>
                    <div className='px-5 pt-5'>
                      <p className='text-sm font-semibold text-gray-500'>
                        Cash Flow
                      </p>
                      <p className='text-xl font-bold'>Expenses</p>
                    </div>
                    <ExpenseSankeyDiagram
                      data={[['From', 'To', 'Amount'], ...filteredTransactionData
                        .filter(transaction => transaction.amount > 0)
                        .map(transaction => [
                          'Spending',
                          getTransactionName(transaction),
                          transaction.amount
                        ])]}
                    />
                  </Card>
                )}
                {filteredTransactionData && financialDataList.income > 0 && (
                  <Card className='mb-5'>
                    <div className='px-5 pt-5'>
                      <p className='text-sm font-semibold text-gray-500'>
                        Cash Flow
                      </p>
                      <p className='text-xl font-bold'>Income</p>
                    </div>
                    <IncomeSankeyDiagram
                      data={[['From', 'To', 'Amount'], ...filteredTransactionData
                        .filter(transaction => transaction.amount < 0)
                        .map(transaction => [
                          getTransactionName(transaction),
                          'Income',
                          Math.abs(transaction.amount)
                        ])]}
                    />
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

export default CashFlow;