import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from './components/SupabaseClient';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import RegistrationModal from './components/RegistrationModal';
import MessagePopup from './components/MessagePopup';
import Messages from './components/Messages';
import MessageBox from './components/MessageBox';
import './App.css';

function App() {
  const [messageHistory, setMessageHistory] = useState([
    { role: 'system', content: 'You are a helpful tutor, and your primary role is to encourage independent problem-solving in users tackling LeetCode-like problems. do this by asking single, thought provoking questions. DO NOT offer hints. Primarily ask thought-provoking questions to guide them. DO NOT directly solve the problems. DO NOT outline ANY step-by-step approaches. Your goal is to stimulate the users critical thinking and problem-solving skills, NOT to provide complete answers or solutions or to guide them easily to the answer. If a user mentions something other than coding tutoring advised them you are only able to help with coding problems.' },

    { role: 'assistant', content: 'Hello! I am Chat GPLeet and I am here to help you with coding problems.' },

    { role: 'assistant', content: 'Paste the URL link or prompt to the problem you are working on and feel free to ask me for tips and guidance.' },
    { role: 'assistant', content: 'Be sure to register and login to save your chat history!' },
  ]);
  const [darkMode, setDarkMode] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const session = await supabase.auth.getSession();
      if (session && session.data && session.data.session && session.data.session.user) {
        setUserId(session.data.session.user.id);
      }
    })();
  }, [userId]);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUserId(session?.user?.id || null);

    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    // Log to see the structure of unsubscribe
    console.log('Auth listener unsubscribe function:', unsubscribe);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);



  const handleLogin = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log('User failed to log in:', user)
      console.error('Error logging in:', error);
      return;
    }
    if (user) {
      console.log('User logged in successfully:', user)
      setUserId(user.id);
    } else {
      console.log('Login successful but user not yet defined', user)
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      return;
    }
    setUserId(null);
  };

  const insertMessageHistory = async (messageHistory) => {
    try {
      if (!userId) {
        console.error('User is not logged in');
        return;
      }

      const { data, error } = await supabase
        .from('history')
        .insert([{ user: userId, messages: JSON.stringify(messageHistory) }]);

      setMessageHistory([
        { role: 'system', content: 'You are a helpful tutor, and your primary role is to encourage independent problem-solving in users tackling LeetCode-like problems. do this by asking single, thought provoking questions. DO NOT offer hints. Primarily ask thought-provoking questions to guide them. DO NOT directly solve the problems. DO NOT outline ANY step-by-step approaches. Your goal is to stimulate the users critical thinking and problem-solving skills, NOT to provide complete answers or solutions or to guide them easily to the answer. If a user mentions something other than coding tutoring advised them you are only able to help with coding problems.' },
        { role: 'assistant', content: 'Hello! I am Chat GPLeet and I am here to help you with coding problems.' },
        { role: 'assistant', content: 'Paste the URL link or prompt to the problem you are working on and feel free to ask me for tips and guidance.' },
        { role: 'assistant', content: 'Be sure to register and login to save your chat history!' },
      ]);

      if (error) {
        console.error('Error inserting message history:', error);
      } else {
        console.log('Message history inserted successfully:', data);
      }
    } catch (error) {
      console.error('Error communicating with Supabase:', error);
    }
  };

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
    setMessage('Check your email for verification');
    setShowMessagePopup(true);
    setShowRegistrationModal(false);
    setTimeout(() => setShowMessagePopup(false), 3000);
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
          messageHistory={messageHistory}
          setMessageHistory={setMessageHistory}
          insertMessageHistory={insertMessageHistory}
          userId={userId}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
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