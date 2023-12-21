import React from 'react';

function MessagePopup({ message, onClose }) {
  return (
    <div className="message-popup">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default MessagePopup;