import React, { useState } from 'react';

function MessageBox({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage !== '') {
      onSendMessage(trimmedMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="input-button-container">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <button
        onClick={handleSendMessage} className="send-button">
        Send
      </button>
    </div>
  );
}

export default MessageBox;
