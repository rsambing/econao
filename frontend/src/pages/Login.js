import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      navigate('/');
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
      <Link to="/forgot-password" className="auth-link-center">
        Esqueceu a senha?
      </Link>
      <hr className="auth-divider" />
      <Link to="/register" className="auth-btn-outline" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
        Criar nova conta
      </Link>
    </AuthLayout>
  );
}
