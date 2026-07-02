import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <div>
      <h1 className="page-title">Entrar</h1>
      <p className="page-subtitle">Acede à tua conta EconAO.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Palavra-passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Ainda não tens conta?{' '}
        <button className="btn" onClick={() => go('register')}>Registar</button>
      </p>
    </div>
  );
}
