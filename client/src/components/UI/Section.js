import React, { useState, useEffect, useRef, useContext } from 'react';
import { getFinancialData } from '../../pages/CashFlow';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import useAxios from '../../hooks/use-axios';
import aiLogo from './images.png';

const Section = ({ children }) => {
  // Get financial data from the CashFlow page
  const financialData = JSON.parse(localStorage.getItem('financialDataList'));
    const { income, expenses, totalSavings, savingsRate } = financialData || {};
  const { isSignedIn, user, isLoaded } = useUser();

  // State management
  const [isChatOpen, setIsChatOpen] = useState(false);          // Controls chat window visibility
  const [message, setMessage] = useState("");                    // Current message input
  const [chatMessages, setChatMessages] = useState([]);          // Array of chat messages
  const [isListening, setIsListening] = useState(false);        // Voice input status
  const [isLoading, setIsLoading] = useState(false);            // Loading state for API calls

  // Use ref to hold the recognition instance
  const recognitionRef = useRef(null);

  // console.log("financal data:: ", financialData);

  useEffect(() => {
    if(user){
      localStorage.setItem('Userid', JSON.stringify(user.id));
    }
  },[user])

  // Set up speech recognition
  useEffect(() => {
    console.log("User:" ,localStorage.getItem('Userid'));
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();

      // Configure speech recognition settings
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";// Set language to English

      // Handle speech recognition results
      recognitionRef.current.onresult = (event) => {
        const voiceMessage = event.results[0][0].transcript;
        setMessage(voiceMessage);
        handleSendMessage(voiceMessage);
      };

      // Reset listening state when recognition ends
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error detected:', event.error);
        setIsListening(false);
      };
    } else {
      alert("Speech Recognition is not supported in this browser.");
    }
  }, []); // Dependency array is empty to run this effect only once


  // Toggle chat window visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  /**
   * Format AI messages with proper styling and structure
   * @param {string} text - The message text to format
   * @returns {JSX.Element[]} Formatted message elements
   */
  const formatAIMessage = (text) => {
    // Split the text into sections based on the number pattern
    const sections = text.split(/(?=\d+\.\s)/);
    
    return sections.map((section, index) => {
      // Parse the section into number and content
      const match = section.match(/^(\d+\.\s)(.*)/s);
      
      if (match) {
        const [, number, content] = match;
  
        // Process the content to bold text between asterisks
        const processedContent = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => `<strong>${p1}</strong>`);
  
        return (
          <div key={index} className="mb-4">
            <div className="text-xl font-bold inline-block">{number}</div>
            <p className="text-white/90 text-base leading-relaxed inline" dangerouslySetInnerHTML={{ __html: processedContent.trim() }} />
          </div>
        );
      }
  
      // Check if the section contains bold text without preceding number
      const boldMatch = section.match(/^(.*?)\*\*(.*?)\*\*(.*)$/s);
      if (boldMatch) {
        const [_, beforeBold, boldText, afterBold] = boldMatch;
  
        return (
          <div key={index} className="mb-4">
            {beforeBold.trim() && <p className="text-white/90 text-base leading-relaxed">{beforeBold.trim()}</p>}
            <p className="text-white/90 text-base leading-relaxed"><strong>{boldText}</strong></p>
            {afterBold.trim() && <p className="text-white/90 text-base leading-relaxed">{afterBold.trim()}</p>}
          </div>
        );
      }
  
      // Handle any remaining text that doesn't match the pattern
      if (section.trim()) {
        return (
          <p key={index} className="text-white/90 text-base leading-relaxed mb-4">
            {section.trim()}
          </p>
        );
      }
      return null;
    });
  };

  /**
   * Handle sending messages to the AI
   * @param {string} msg - Message to send (defaults to current message state)
   */
  const handleSendMessage = async (msg = message) => {
    if (msg.trim()) {
      // Add user message to chat
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: msg, sender: "user" }
      ]);

      // Reset message input and show loading state
      setMessage("");
      setIsLoading(true);
      // Prepare data for API call
      const bodyData = {
        User:  localStorage.getItem('Userid'),
        totalBudget: totalSavings,
        totalIncome: income,
        totalSpend: expenses,
        savingsRate: savingsRate,
        userQuery: msg,
      };

      
      

      try {
        // Make API call to get AI advice
        const response = await fetch('http://localhost:8080/api/advice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Process and display AI response
        const data = await response.json();
        const advice = data.advice;

        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: advice, sender: "ai" }
        ]);
      } catch (error) {
        console.error("Error fetching advice:", error);
        // Display error message in chat
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, there was an error getting advice.", sender: "ai" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Enter key press in message input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage(message);
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <section className="mx-auto my-5 w-11/12 grow relative">
      {children}

      {/* AI Advisor Button */}
      <motion.button
        className="fixed bottom-5 right-5 p-2 flex flex-col items-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-2xl hover:from-blue-600 hover:to-purple-600 transition-transform transform hover:scale-105 duration-300 ease-in-out"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }} // Scale up slightly on hover
        whileTap={{ scale: 0.95 }} // Scale down on click
      >
        <img src={aiLogo} alt="AI Logo" className="h-8 w-8 mb-1" /> {/* AI Logo above the text */}
        
      </motion.button>

      {/* Chat Window */}
      {isChatOpen && (
        <div
          className="fixed bottom-20 right-5 bg-white shadow-2xl rounded-xl p-4 border border-gray-200"
          style={{ width: '550px', height: '500px' }}
        >
          {/* Chat Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Ask AI Advisor</h3>
            <button onClick={toggleChat} className="text-gray-400 hover:text-gray-600 transition-colors">
              ×
            </button>
          </div>

          {/* Chat Messages Container */}
          <div
            className="overflow-y-auto border-t border-gray-100 pt-2 text-sm text-gray-600"
            style={{ height: '370px' }}
          >
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div key={index} className={`flex items-start mb-4 ${msg.sender === "user" ? "justify-end" : ""}`}>
                  {msg.sender === "user" ? (
                    // User Message
                    <>
                      <div className="bg-gray-800 text-white p-3 rounded-lg max-w-md shadow-lg text-right">
                        {msg.text}
                      </div>
                      <span className="ml-2 mt-1" style={{ fontSize: '25px' }}>
                        🤔
                      </span>
                    </>
                  ) : (
                    // AI Message
                    <>
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3">
                          <span className="text-white text-xs">AI</span>
                        </div>
                        <div className="bg-green-900 text-white p-4 rounded-lg max-w-md shadow-lg space-y-2">
                          {formatAIMessage(msg.text)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              // Empty State Message
              <p className="text-center italic text-gray-400">Start your conversation...</p>
            )}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex justify-center mt-2">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>

          {/* Message Input Area */}
          <div className="mt-3 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-all mb-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={startListening}
              className={`p-2 rounded-full ${isListening ? "bg-red-500" : "bg-gray-300"} hover:bg-red-500 transition-all`}
              title="Voice Input"
            >
              🎤
            </button>
          </div>
        </div>
      )}
      
      {/* Loading Animation Styles */}
      <style jsx>{`
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 2px;
          border-radius: 50%;
          background-color: #007bff;
          animation: jump 0.6s infinite alternate;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes jump {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default Section;