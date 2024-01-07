import React, { useState } from 'react';
import { supabase } from './SupabaseClient';

function RegistrationModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) console.error('Error registering:', error.message);
    else console.log('User registered:', user);

    setEmail('');
    setPassword('');
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Register</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={handleSubmit} disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default RegistrationModal;
