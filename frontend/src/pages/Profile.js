import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <p className="muted">Não autenticado.</p>;

  return (
    <div>
      <h1 className="page-title">Perfil</h1>
      <div className="card" style={{ maxWidth: 420 }}>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Papel:</strong> <span className="badge">{user.role}</span></p>
      </div>
    </div>
  );
}
