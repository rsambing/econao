import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

/**
 * Comentário/resposta com edição inline.
 * `onSave(id, body)` e `onDelete(id)` são fornecidos pela página.
 */
export default function CommentItem({ item, onSave, onDelete }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(item.body);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const canManage = user && (user.id === item.author?.id || user.role === 'ADMIN');

  const handleSave = async () => {
    if (!body.trim()) return;
    setBusy(true);
    setError('');
    try {
      await onSave(item.id, body);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Eliminar este comentário?')) return;
    setBusy(true);
    setError('');
    try {
      await onDelete(item.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="comment" style={{ display: 'flex', gap: 10 }}>
      <Avatar name={item.author?.name} url={item.author?.avatarUrl} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {item.author?.id
            ? <Link to={`/user/${item.author.id}`} className="author-link"><strong>{item.author.name}</strong></Link>
            : <strong>{item.author?.name}</strong>}
          {canManage && !editing && (
            <span style={{ display: 'flex', gap: 4 }}>
              <button className="icon-btn" title="Editar" onClick={() => { setBody(item.body); setEditing(true); }}>
                <Pencil size={14} strokeWidth={2.2} />
              </button>
              <button className="icon-btn danger" title="Eliminar" onClick={handleDelete} disabled={busy}>
                <Trash2 size={14} strokeWidth={2.2} />
              </button>
            </span>
          )}
        </div>

        {!editing ? (
          <p style={{ margin: '4px 0 0' }}>{item.body}</p>
        ) : (
          <div style={{ marginTop: 6 }}>
            <textarea
              rows={2}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 8, padding: 8, fontFamily: 'inherit', fontSize: 14 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button className="btn primary" onClick={handleSave} disabled={busy || !body.trim()} style={{ padding: '6px 14px', fontSize: 13 }}>
                {busy ? 'A guardar...' : 'Guardar'}
              </button>
              <button className="btn" onClick={() => setEditing(false)} disabled={busy} style={{ padding: '6px 14px', fontSize: 13 }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        {error && <p className="error-text" style={{ marginTop: 4 }}>{error}</p>}
      </div>
    </div>
  );
}
