import React from 'react';
import Message from './Message';

function Messages({ messages }) {
  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <Message key={index} text={msg} />
      ))}
    </div>
  );
}

export default Messages;
