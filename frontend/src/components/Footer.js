import React, { useState } from 'react';
import chatbotIcon from '../assets/chatbot_icon.png';

const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse("Sorry, I couldn't understand that.");
      }
    } catch (err) {
      console.error('Chatbot Error:', err);
      setResponse('Error connecting to assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg"
      >
        <img
          src={chatbotIcon}
          alt="Chatbot Icon"
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 bg-white dark:bg-gray-800 p-4 rounded shadow-lg w-80">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me something about health..."
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={sendMessage}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>

          {response && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {response}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChatBot;
