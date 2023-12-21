import React from 'react';
import Message from './Message';

function Messages({ messages }) {
  return (
    <div className="messages-container">
      {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
        <Message key={index} text={msg} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
}

export default Messages;
