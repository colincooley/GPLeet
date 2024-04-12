import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

function SideBar({ show, onRegisterClick, messageHistory, setMessageHistory, insertMessageHistory, userId, updateUserId, handleLogin, handleLogout, defaultMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chatHistory, setChatHistory] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchChatHistory(userId);
    } else {
      setChatHistory(null);
      setMessageHistory(defaultMessage);
    }
  }, [userId, setChatHistory, setMessageHistory, defaultMessage]);

  const onLoginFormSubmit = async (event) => {
    event.preventDefault();
    await handleLogin(email, password);
  };

  // useEffect(() => {
  //   console.log('currentChatId:', currentChatId);
  //   if (currentChatId && messageHistory) {
  //     updateMessageHistory(messageHistory);
  //   } else {
  //     handleNewChat();
  //   }
  // }, [messageHistory]);

  async function fetchChatHistory(userId) {
    const { data: chatHistory, error: chatHistoryError } = await supabase
      .from('history')
      .select('id, messages')
      .eq('user', userId);

    if (chatHistoryError) {
      console.error('Error fetching chat history:', chatHistoryError);
    } else {
      setChatHistory(chatHistory);
    }
  }

  const handleNewChat = async () => {
    try {
      const newChatId = await insertMessageHistory(messageHistory);
      setCurrentChatId(newChatId);
      fetchChatHistory(userId);
    } catch (error) {
      console.error('Error starting new session:', error);
    };
  };

  const handleStartNewSession = async () => {
    if (!userId) {
      console.error('User is not logged in.');
      return;
    }

    if (currentChatId) {
      try {
        await updateMessageHistory(messageHistory);
        setCurrentChatId(null);
        setMessageHistory(defaultMessage);
      } catch (error) {
        console.error('Error updating existing session:', error);
      }
    } else {
      try {
        const newChatId = await insertMessageHistory(messageHistory);
        setCurrentChatId(newChatId);
        fetchChatHistory(userId);
      } catch (error) {
        console.error('Error starting new session:', error);
      }
    }
  };

  const handleHistoryChange = (index) => {
    const selectedSession = chatHistory[index];
    const selectedMessages = JSON.parse(selectedSession.messages);
    setMessageHistory(selectedMessages);
    setCurrentChatId(selectedSession.id);
  };

  const updateMessageHistory = async (newMessageHistory) => {
    if (!currentChatId) {
      console.error('No session selected for update.');
      return;
    }

    const { error } = await supabase
      .from('history')
      .update({ messages: JSON.stringify(newMessageHistory) })
      .match({ id: currentChatId });

    if (error) {
      console.error('Error updating chat history:', error);
    } else {
      console.log('Chat history updated successfully.');
      fetchChatHistory(userId);
    }
  };

  const toggleDropdown = (index) => {
    if (activeMenuIndex === index) {
      setActiveMenuIndex(null);
    } else {
      setActiveMenuIndex(index);
    }
  };

  const deleteHistoryItem = async () => {
    if (activeMenuIndex === null) {
      console.error('No session selected for deletion.');
      return;
    }

    const selectedSession = chatHistory[activeMenuIndex];
    const { error } = await supabase
      .from('history')
      .delete()
      .match({ id: selectedSession.id });

    if (error) {
      console.error('Error deleting chat history:', error);
    } else {
      console.log('Chat history deleted successfully.');
      setActiveMenuIndex(null);
      fetchChatHistory(userId);
    }
  }

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
                      <div className="history-container">
                        <div className="history-item" onClick={() => handleHistoryChange(index)} key={`session-${index}`}>
                          {firstFewWords}
                        </div>
                        <div className="history-item-menu">
                          <div className="menu-icon" onClick={ () => toggleDropdown(index)}>
                          &#8942;
                          </div>
                          {activeMenuIndex === index && (
                            <div className="history-dropdown" onMouseLeave={toggleDropdown} >
                              <button onClick={deleteHistoryItem} >Delete</button>
                            </div>
                          )}
                        </div>
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
