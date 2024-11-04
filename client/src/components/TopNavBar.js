import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { FaChartLine, FaExchangeAlt, FaWallet, FaChartBar, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from './201787360.png'; // Adjust the path as necessary

const TopNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/overview', icon: <FaChartLine />, label: 'Overview' },
    { to: '/transactions', icon: <FaExchangeAlt />, label: 'Transactions' },
    { to: '/accounts', icon: <FaWallet />, label: 'Accounts' },
    { to: '/cash-flow', icon: <FaChartBar />, label: 'Cash Flow' },
    { to: '/education-resources', icon: <FaGraduationCap />, label: 'Education' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <motion.img
              src={logo}
              alt="finAI Logo"
              className="h-12 w-25 transition-transform duration-300 ease-in-out transform hover:scale-110 shadow-lg rounded-full" // Added shadow and rounded corners
              initial={{ scale: 0.5 }} // Initial scale for animation
              animate={{ scale: 1 }} // Animate to full size
              transition={{ duration: 0.5 }} // Duration of the animation
            />
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition duration-300 transform hover:scale-105"
                activeClassName="text-blue-200 font-bold"
              >
                {item.icon}
                <span className="transition-transform duration-300">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="block py-2 px-4 text-white hover:bg-blue-700 rounded transition duration-300 transform hover:scale-105"
              activeClassName="bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </header>
  );
};

export default TopNavBar;