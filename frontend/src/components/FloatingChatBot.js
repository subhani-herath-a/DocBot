import React, { useState } from 'react';
 import chatbotIcon from '../assets/chatbot_icon.png';
const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  


  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8080/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg"
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
            placeholder="Ask something..."
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={sendMessage}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Send
          </button>
          {response && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{response}</p>}
        </div>
      )}
    </div>
  );
};

export default FloatingChatBot;
