import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPassword() {
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
      <AuthLayout>
        <h2 className="auth-form-title">Verifica o teu email</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Se existir uma conta com o email <strong>{email}</strong>, enviámos um link para redefinires a senha.
        </p>
        <Link to="/login" className="auth-btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Voltar ao login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="auth-form-title">Esqueceu a senha?</h2>
      <p className="muted" style={{ marginBottom: 20 }}>
        Indica o teu email e enviamos-te um link para definires uma nova senha.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}
        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? 'A enviar...' : 'Enviar link de recuperação'}
        </button>
      </form>
      <Link to="/login" className="auth-link-center">
        Voltar ao login
      </Link>
    </AuthLayout>
  );
}
