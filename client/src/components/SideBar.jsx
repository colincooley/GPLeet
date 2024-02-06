import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

function SideBar({ show, onRegisterClick, messageHistory, setMessageHistory, insertMessageHistory, userId, updateUserId, handleLogin, handleLogout }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chatHistory, setChatHistory] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchChatHistory(userId);
    } else {
      setChatHistory(null);
      setMessageHistory([
        { role: 'system', content: 'You are a helpful tutor, and your primary role is to encourage independent problem-solving in users tackling LeetCode-like problems. do this by asking single, thought provoking questions. DO NOT offer hints. Primarily ask thought-provoking questions to guide them. DO NOT directly solve the problems. DO NOT outline ANY step-by-step approaches. Your goal is to stimulate the users critical thinking and problem-solving skills, NOT to provide complete answers or solutions or to guide them easily to the answer. If a user mentions something other than coding tutoring advised them you are only able to help with coding problems.' },

        { role: 'assistant', content: 'Hello! I am GPLeet and I am here to help you with coding problems.' },

        { role: 'assistant', content: 'Paste the URL link or prompt to the problem you are working on and feel free to ask me for tips and guidance.' },
        { role: 'assistant', content: 'Be sure to register and login to save your chat history!' },
      ]);
    }
  }, [userId, setMessageHistory]);

  const onLoginFormSubmit = async (event) => {
    event.preventDefault();
    await handleLogin(email, password);
  };

  async function fetchChatHistory(userId) {
    const { data: chatHistory, error: chatHistoryError } = await supabase
      .from('history')
      .select('messages')
      .eq('user', userId);

    if (chatHistoryError) {
      console.error('Error fetching chat history:', chatHistoryError);
    } else {
      setChatHistory(chatHistory);
    }
  }

  const handleStartNewSession = async () => {
    try {
      await insertMessageHistory(messageHistory);
      await fetchChatHistory(userId);
    } catch (error) {
      console.error('Error handling new session:', error);
    }
  };

  const handleHistoryChange = (index) => {
    const selectedSession = JSON.parse(chatHistory[index].messages);
    setMessageHistory(selectedSession);
  };

  return (
    <div className={show ? 'sidebar show' : 'sidebar'}>
      {!userId ? (
        <div>
          <form onSubmit={onLoginFormSubmit} className="login-section">
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="login-button">Login</button>
          </form>
          <p>
            Don't have an account?{' '}
            <button className="register-sidebar-button" onClick={onRegisterClick}>
              Register here
            </button>
          </p>
        </div>
      ) : (
        <>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </>
      )}

      <hr />
      {userId && (
        <div className="chat-history">
          <button
            onClick={handleStartNewSession}
            className="new-chat-button">Start New Session</button>
          <h3>Chat History</h3>
          {chatHistory && (
            <>
              {chatHistory.map((session, index) => {
                const messagesArray = JSON.parse(session.messages);
                if (messagesArray.length >= 5) {
                  const fourthMessageContent = messagesArray[4].content;
                  const words = fourthMessageContent.split(' ');
                  const firstFewWords = words.slice(0, 4).join(' ');

                  return (
                    <div className="history-item" onClick={() => handleHistoryChange(index)} key={`session-${index}`}>
                      {firstFewWords}
                    </div>
                  );
                }
                return null;
              })}
            </>
          )}
        </div>)}
    </div>
  );
}

export default SideBar;
