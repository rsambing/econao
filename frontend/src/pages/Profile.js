import React, { useState } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadMedia } from '../api/upload';
import Avatar from '../components/Avatar';

const ROLE_LABEL = { ADMIN: 'Administrador', USER: 'Utilizador' };

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
      <p className="page-subtitle">Gere os teus dados e a tua foto de perfil.</p>

      <div className="card" style={{ maxWidth: 420, margin: '0 auto', padding: 0, overflow: 'hidden' }}>
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <Avatar name={user.name} url={user.avatarUrl} size={96} />
            <label className="profile-avatar-edit" title="Alterar foto">
              {uploading ? <Loader2 size={14} className="spin" /> : <Pencil size={13} strokeWidth={2.4} />}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <h2 className="profile-name">{user.name}</h2>
          <span className="badge profile-role">{ROLE_LABEL[user.role] || user.role}</span>
          {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}
        </div>

        <div className="profile-info">
          <div className="profile-info-row">
            <span className="profile-info-label">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Papel</span>
            <span>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
