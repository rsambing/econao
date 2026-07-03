import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import AuthLayout from '../components/AuthLayout';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || searchParams.get('reset_token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <h2 className="auth-form-title">Link inválido</h2>
        <p className="muted" style={{ marginBottom: 20 }}>Este link de recuperação não é válido. Pede um novo.</p>
        <Link to="/forgot-password" className="auth-btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Pedir novo link
        </Link>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout>
        <h2 className="auth-form-title">Senha redefinida</h2>
        <p className="muted" style={{ marginBottom: 20 }}>A tua senha foi alterada com sucesso. Já podes entrar.</p>
        <button className="auth-btn-primary" onClick={() => navigate('/login')}>Entrar</button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="auth-form-title">Definir nova senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}
        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? 'A redefinir...' : 'Redefinir senha'}
        </button>
      </form>
    </AuthLayout>
  );
}
