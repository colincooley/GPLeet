import React from 'react';

function Message({ role, content }) {
  return <div className={`message ${role}`}>{content}</div>;
}

export default Message;
