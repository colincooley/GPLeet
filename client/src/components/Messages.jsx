import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Message from './Message';

function Messages({ messages }) {
  return (
    <TransitionGroup className="messages-container">
    {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
      <CSSTransition
        key={index}
        timeout={500}
        classNames="message"
      >
        <Message text={msg} role={msg.role} content={msg.content} />
      </CSSTransition>
    ))}
  </TransitionGroup>
  );
}

export default Messages;
