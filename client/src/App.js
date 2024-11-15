import {React, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataProvider from './store/DataProvider';
import TopNavBar from './components/TopNavBar';
import Accounts from './pages/Accounts';
import Auth from './pages/Auth';
import CashFlow from './pages/CashFlow';
import Transactions from './pages/Transactions';
import Overview from './pages/Overview';
import EducationResources from './pages/Educational_resources';
import './App.css';
import logo from './components/201787360.png';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!isAuthPage && <TopNavBar />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/education-resources" element={<EducationResources />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </main>
      {!isAuthPage && (
        <footer className="bg-gray-100 text-gray-700 py-8">
        <div className="container mx-auto px-4">
          {/* Top section with columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            {/* Logo and Address */}
            <div>
              <img src={logo} alt="FinAI Logo" className="h-10 mx-auto md:mx-0 mb-4" />
              <p>123 Financial St, Suite 101<br />City, State, ZIP</p>
              <p className="mt-2">Contact Us</p>
              <div className="flex justify-center md:justify-start space-x-3 mt-4">
                {/* Social Icons */}
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            
            {/* Products Section */}
            <div>
              <h5 className="font-semibold mb-4">PRODUCTS</h5>
              <ul>
                <li><a href="#">Stocks</a></li>
                <li><a href="#">Mutual Funds</a></li>
                <li><a href="#">ETFs</a></li>
                <li><a href="#">Retirement</a></li>
              </ul>
            </div>
      
            {/* FinAI Section */}
            <div>
              <h5 className="font-semibold mb-4">FINAI</h5>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help and Support</a></li>
              </ul>
            </div>
      
            {/* Quick Links */}
            <div>
              <h5 className="font-semibold mb-4">QUICK LINKS</h5>
              <ul>
                <li><a href="#">Calculators</a></li>
                <li><a href="#">Glossary</a></li>
                <li><a href="#">Open Demat Account</a></li>
                <li><a href="#">Terms and Conditions</a></li>
              </ul>
            </div>
          </div>
      
          {/* Bottom section with copyright and app links */}
          <div className="border-t border-gray-300 mt-8 pt-4 text-center">
            <p>© 2024 FinAI. All rights reserved. Built with ❤️ in India</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </DataProvider>
  );
};

export default App;