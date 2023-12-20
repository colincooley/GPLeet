import React, { useState } from 'react';
import Messages from './components/Messages';
import MessageBox from './components/MessageBox';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = (newMessage) => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className="App">
      <Messages messages={messages} />
      <MessageBox onSendMessage={sendMessage} />
    </div>
  );
}

export default App;
