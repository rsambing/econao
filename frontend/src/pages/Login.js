import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login({ go }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      go('explore');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-form-title">Entrar no EconAO</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}
        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
      <button type="button" className="auth-link-center" onClick={() => go('forgotPassword')}>
        Esqueceu a senha?
      </button>
      <hr className="auth-divider" />
      <button type="button" className="auth-btn-outline" onClick={() => go('register')}>
        Criar nova conta
      </button>
    </AuthLayout>
  );
}
