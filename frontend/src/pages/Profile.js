import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadMedia } from '../api/upload';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return <p className="muted">Não autenticado.</p>;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const avatarUrl = await uploadMedia(file);
      await updateProfile({ avatarUrl });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Perfil</h1>
      <div className="card" style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <Avatar name={user.name} url={user.avatarUrl} size={64} />
          <div>
            <label className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
              {uploading ? 'A enviar...' : 'Alterar foto'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Papel:</strong> <span className="badge">{user.role}</span></p>
      </div>
    </div>
  );
}
