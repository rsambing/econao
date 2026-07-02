import React, { useState } from 'react';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword({ go }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div>
        <h1 className="page-title">Verifica o teu email</h1>
        <p className="page-subtitle">
          Se existir uma conta com o email <strong>{email}</strong>, enviámos um link para redefinires a senha.
        </p>
        <button className="btn" onClick={() => go('login')}>Voltar ao login</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Esqueci-me da senha</h1>
      <p className="page-subtitle">Indica o teu email e enviamos-te um link para definires uma nova senha.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'A enviar...' : 'Enviar link de recuperação'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => go('login')}>Voltar ao login</button>
      </p>
    </div>
  );
}
