
import React, { useState } from 'react';
import chatbotIcon from '../assets/chatbot_icon.png';

const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    const token = localStorage.getItem('token');
    const userMessage = { sender: 'user', text: prompt };
    setChatHistory((prev) => [...prev, userMessage]);
    setPrompt('');

    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.response || 'No response received.' };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = { sender: 'bot', text: '⚠️ Failed to get response.' };
      setChatHistory((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg z-50"
      >
        <img src={chatbotIcon} alt="Chatbot Icon" className="w-full h-full rounded-full" />
      </button>

      {/* Chatbox */}
      {open && (
        <div className="fixed bottom-24 right-4 w-[90vw] sm:w-96 max-h-[75vh] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl flex flex-col justify-between z-50">
          <div className="overflow-y-auto flex-1 space-y-2 pr-2 mb-2">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[85%] text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 self-end'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center space-x-2">
            <textarea
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Ask me about health..."
              className="flex-1 resize-none p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 8-16 8V4z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatBot;
