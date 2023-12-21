import React from 'react';

function SideBar({ show, onRegisterClick }) {
  return (
    <div className={show ? 'sidebar show' : 'sidebar'}>
      <div className="login-section">
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="Password" />
        <button className="login-button">Login</button>
        <button onClick={onRegisterClick} className="register-button">Register</button>
      </div>

      <hr />

      <div className="chat-history">
        <button className="new-chat-button">Start New Session</button>
        {/* Chat history list will go here */}
      </div>
    </div>
  );
}

export default SideBar;
