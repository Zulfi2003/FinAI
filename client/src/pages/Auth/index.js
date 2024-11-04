import React from 'react';
import { Navigate } from "react-router-dom";
import { SignedOut, SignedIn, SignUpButton, SignInButton } from '@clerk/clerk-react';
import avatar from './avatar.png';
import logo from '../../components/201787360.png'; // Import your logo here

const Auth = () => {

  return (
    <div className="min-h-screen bg-grey-200">
       {/* LOGO */}
       <div style={{ position: 'absolute', top: '50px', right: '300px' }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ width: '300px', height: '90px' }} // Customize size as needed
          className="object-contain"
        />
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Image */}
          <div className="flex items-center justify-center w-full">
            <img
              src={avatar}
              alt="Professional portrait"
              className="w-[1000px] h-auto rounded-lg transform translate-x-[5rem]"
            />
          </div>

          {/* Right Content */}
          <div className="ml-[-40px]">
            <div className="text-red-500 font-medium">Welcome to Your Own Personal Finance Tracker!</div>
            <h6 className="text-1xl md:text-5xl font-bold text-gray-900 mt-4">
              Elevate Your Financial Experience
              <br />
              With Next Gen Guidance
            </h6>
            <p className="text-gray-600 mt-6">
              Your Personal Finance Assistant for Smarter Decisions.
            </p>
            <div className="flex space-x-4 mt-8">
            <SignedOut>
            <div className="relative inline-block">
                  <SignUpButton mode="modal" signInForceRedirectUrl="/accounts" forceRedirectUrl="/accounts">
                    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
                <SignInButton mode="modal">
                  Sign in
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Navigate to="/accounts" replace />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Elevate Your Financial Journey
              <br />
              Unleash Your Potential.
            </h2>
            <p className="text-gray-600">
              Discover powerful tools that empower you to take control of your finances and achieve your dreams.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions? Let's Connect!
              <br />
              Engage in Meaningful Conversations.
            </h2>
            <p className="text-gray-600">
              Our platform is here to answer your queries and foster discussions that lead to informed financial decisions.
            </p>
          </div>
        </div>
      </div>

     {/* Footer */}
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">About FinAI</h3>
            <p className="text-gray-600 text-sm">
              Your personal finance assistant designed to help you make smarter financial decisions and reach your goals.
            </p>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Budgeting Tools</a></li>
              <li><a href="#" className="hover:text-gray-900">Investment Tracking</a></li>
              <li><a href="#" className="hover:text-gray-900">Expense Management</a></li>
              <li><a href="#" className="hover:text-gray-900">Savings Planner</a></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Calculators</a></li>
              <li><a href="#" className="hover:text-gray-900">FAQs</a></li>
              <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@finai.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Financial St, Suite 101, City, State, ZIP</li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-300 mt-8 pt-4 text-center">
          <p>© 2024 FinAI. All rights reserved. Built with ❤️ in India.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#"><img src="/path/to/app-store.png" alt="App Store" className="h-8" /></a>
            <a href="#"><img src="/path/to/google-play.png" alt="Google Play" className="h-8" /></a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Auth;