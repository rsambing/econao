import React, { useState } from 'react';
import { resetPassword } from '../api/auth';

export default function ResetPassword({ token, go }) {
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
      <div>
        <h1 className="page-title">Link inválido</h1>
        <p className="page-subtitle">Este link de recuperação não é válido. Pede um novo.</p>
        <button className="btn" onClick={() => go('forgotPassword')}>Pedir novo link</button>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <h1 className="page-title">Senha redefinida</h1>
        <p className="page-subtitle">A tua senha foi alterada com sucesso. Já podes entrar.</p>
        <button className="btn primary" onClick={() => go('login')}>Entrar</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Definir nova senha</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nova senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <div className="form-group">
          <label>Confirmar nova senha</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'A redefinir...' : 'Redefinir senha'}
        </button>
      </form>
    </div>
  );
}
