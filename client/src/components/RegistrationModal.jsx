import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

function RegistrationModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%*?]/.test(password),
    });
  }, [password]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      const user = data.user;
      if (error) throw error;

      const { data: userData, error: userInsertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email,
          },
        ]);

      if (userInsertError) throw userInsertError;

      setEmail('');
      setPassword('');
      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error.message);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>Check your email to confirm your registration!</h3>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Register</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        {password && (
          <ul className="password-requirements-list">
            <li style={{ color: passwordRequirements.minLength ? 'green' : 'red' }}>
              Minimum 8 characters
            </li>
            <li style={{ color: passwordRequirements.hasNumber ? 'green' : 'red' }}>
              Contains a number
            </li>
            <li style={{ color: passwordRequirements.hasUppercase ? 'green' : 'red' }}>
              Contains an uppercase letter
            </li>
            <li style={{ color: passwordRequirements.hasLowercase ? 'green' : 'red' }}>
              Contains a lowercase letter
            </li>
            <li style={{ color: passwordRequirements.hasSpecialChar ? 'green' : 'red' }}>
              Contains a special character (!@#$%*?)
            </li>
          </ul>
        )}
        <div className="register-buttons">
          <button onClick={handleSubmit} disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationModal;
