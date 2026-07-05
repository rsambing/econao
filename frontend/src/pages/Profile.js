import React, { useState } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadMedia } from '../api/upload';
import Avatar from '../components/Avatar';

const ROLE_LABEL = { ADMIN: 'Administrador', USER: 'Utilizador' };

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!user) return <p className="muted">Não autenticado.</p>;

  const startEditing = () => {
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setCurrentPassword('');
    setError('');
    setSaved(false);
    setEditing(true);
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const changes = {};
      if (name !== user.name) changes.name = name;
      if (email !== user.email) changes.email = email;
      if (password) changes.password = password;

      const needsPassword = changes.email !== undefined || changes.password !== undefined;
      if (needsPassword) {
        if (!currentPassword) {
          setError('Indica a senha atual para alterar email ou senha.');
          setSaving(false);
          return;
        }
        changes.currentPassword = currentPassword;
      }

      if (Object.keys(changes).length === 0) {
        setEditing(false);
        setSaving(false);
        return;
      }

      await updateProfile(changes);
      setEditing(false);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
          {saved && <p className="quiz-ok" style={{ marginTop: 12 }}>Perfil atualizado com sucesso.</p>}
          {error && !editing && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}
        </div>

        {!editing ? (
          <>
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
            <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
              <button className="btn" onClick={startEditing} style={{ width: '100%' }}>
                <Pencil size={15} strokeWidth={2.2} /> Editar perfil
              </button>
            </div>
          </>
        ) : (
          <form className="form" onSubmit={handleSave} style={{ padding: '0 24px 24px', maxWidth: 'none' }}>
            <div className="form-group">
              <label>Nome</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Nova senha (deixa vazio para manter)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                placeholder="••••••"
              />
            </div>
            {(email !== user.email || password) && (
              <div className="form-group">
                <label>Senha atual (obrigatória para alterar email ou senha)</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••"
                />
              </div>
            )}
            {error && <div className="error-text">{error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar alterações'}
              </button>
              <button type="button" className="btn" onClick={() => setEditing(false)} disabled={saving}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
