import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import RegistrationModal from './components/RegistrationModal';
import MessagePopup from './components/MessagePopup';
import Messages from './components/Messages';
import MessageBox from './components/MessageBox';
import './App.css';

function App() {
  const [messageHistory, setMessageHistory] = useState([
    { role: 'system', content: 'You are a helpful tutor, and your primary role is to encourage independent problem-solving in users tackling LeetCode-like problems. DO NOT offer hints. Primarily ask thought-provoking questions to guide them. DO NOT directly solve the problems or outlining ANY step-by-step approaches. Your goal is to stimulate the users critical thinking and problem-solving skills, NOT to provide complete answers or solutions or to guide them easily to the answer.' },

    { role: 'assistant', content: 'Hello! I am Chat GP-Leet and I am here to help you with coding problems.' },

    { role: 'assistant', content: 'Paste the URL link or prompt to the problem you are working on and feel free to ask me for tips and guidance.' },
  ]);
  const [darkMode, setDarkMode] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleRegisterClick = () => {
    setShowRegistrationModal(true);
  };

  const handleModalClose = () => {
    setShowRegistrationModal(false);
  };

  const handleRegistrationSubmit = (email, password) => {
    // Perform registration logic here
    setMessage('Check your email for verification');
    setShowMessagePopup(true);
    setShowRegistrationModal(false);
    setTimeout(() => setShowMessagePopup(false), 10000); // Hide popup after 3 seconds
  };

  const handleSendMessage = async (newMessage) => {
    const updatedHistory = [...messageHistory, { role: 'user', content: newMessage }];
    setMessageHistory(updatedHistory);

    try {
      const response = await axios.post('http://localhost:3000/api/chat/message', {
        userMessage: newMessage,
        previousMessages: updatedHistory,
      });
      const aiMessage = response.data.aiMessage;
      setMessageHistory([
        ...updatedHistory,
        { role: aiMessage.role, content: aiMessage.content },
      ]);
    } catch (error) {
      console.error('Error communicating with the server:', error);
    }
  };

  return (
    <div className="App">
      {showRegistrationModal && <RegistrationModal onClose={handleModalClose} onSubmit={handleRegistrationSubmit} />}
      {showMessagePopup && (
        <MessagePopup message={message} onClose={() => setShowMessagePopup(false)} />
      )}
      <NavBar
        toggleSideBar={() => setShowSideBar(s => !s)}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
      />
      <div className="main-container">
        <SideBar
          show={showSideBar}
          onRegisterClick={handleRegisterClick}
        />
        <div className={"content"}>
          <Messages messages={messageHistory} />
          <MessageBox onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;