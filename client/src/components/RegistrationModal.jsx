import React, { useState } from 'react';

function RegistrationModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(email, password);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Register</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default RegistrationModal;
