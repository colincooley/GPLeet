import React, { useState } from 'react';
import axios from 'axios';

function MessageBox({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage !== '') {
      onSendMessage(`You: ${trimmedMessage}`);
      setNewMessage('');

      try {
        console.log(JSON.stringify({ messages: [{ role: 'user', content: trimmedMessage }] }, null, 2));
        const response = await axios.post('http://localhost:3000/api/chat/message', { message: trimmedMessage });
        const aiResponse = response.data.aiMessage;
        onSendMessage(`AI: ${aiResponse}`);
      } catch (error) {
        console.error('Error communicating with the server:', error);
        onSendMessage('AI: Sorry, there was an error processing your message.');
      }
    }
  };

  return (
    <div className="message-box">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default MessageBox;

