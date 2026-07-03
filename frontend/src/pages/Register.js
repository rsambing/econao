import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-form-title">Criar conta EconAO</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          minLength={6}
        />
        {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}
        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? 'A criar...' : 'Criar conta'}
        </button>
      </form>
      <hr className="auth-divider" />
      <Link to="/login" className="auth-btn-outline" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
        Já tenho conta
      </Link>
    </AuthLayout>
  );
}
