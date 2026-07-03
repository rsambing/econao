import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listTopics, createTopic } from '../api/forum';
import { uploadMedia } from '../api/upload';
import { useAuth } from '../context/AuthContext';
import { ListSkeleton } from '../components/Skeleton';
import Avatar from '../components/Avatar';

export default function Forum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => listTopics().then(setTopics).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let imageUrl;
      if (file) {
        imageUrl = await uploadMedia(file);
      }
      await createTopic({ title, description, imageUrl });
      setTitle('');
      setDescription('');
      setFile(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Fórum de Discussão</h1>
      <p className="page-subtitle">Debate temas de economia e história com a comunidade.</p>

      {user && (
        <button className="btn primary" style={{ marginBottom: 16 }} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancelar' : 'Criar novo tópico'}
        </button>
      )}

      {showForm && (
        <form className="form" onSubmit={handleCreate} style={{ marginBottom: 24 }}>
          <div className="form-group">
            <label>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 10, padding: 10, fontFamily: 'inherit' }}
            />
          </div>
          <div className="form-group">
            <label>Imagem (opcional)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'A publicar...' : 'Publicar Tópico'}
          </button>
        </form>
      )}

      {loading ? (
        <ListSkeleton count={3} />
      ) : (
        <div className="list">
          {topics.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}
              onClick={() => navigate(`/forum/${t.id}`)}
            >
              {t.imageUrl && (
                <img src={t.imageUrl} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div>
                <h3 style={{ margin: 0 }}>{t.title}</h3>
                <p className="muted" style={{ margin: '6px 0 0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar name={t.author?.name} url={t.author?.avatarUrl} size={20} />
                  {t.author?.name} · {t._count?.replies ?? 0} respostas
                </p>
              </div>
            </div>
          ))}
          {topics.length === 0 && <p className="muted">Ainda não há tópicos.</p>}
        </div>
      )}
    </div>
  );
}
