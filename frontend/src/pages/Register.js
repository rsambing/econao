import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ go }) {
  const { register } = useAuth();
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
      go('explore');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Criar conta</h1>
      <p className="page-subtitle">Junta-te à comunidade EconAO.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Palavra-passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'A criar...' : 'Criar conta'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Já tens conta?{' '}
        <button className="btn" onClick={() => go('login')}>Entrar</button>
      </p>
    </div>
  );
}
