import React, { useEffect, useState } from 'react';
import { listTopics, createTopic } from '../api/forum';
import { useAuth } from '../context/AuthContext';
import { ListSkeleton } from '../components/Skeleton';

export default function Forum({ go }) {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const load = () => listTopics().then(setTopics).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTopic({ title, description });
      setTitle('');
      setDescription('');
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
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
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="btn primary">Publicar Tópico</button>
        </form>
      )}

      {loading ? (
        <ListSkeleton count={3} />
      ) : (
        <div className="list">
          {topics.map((t) => (
            <div key={t.id} className="card" style={{ cursor: 'pointer' }} onClick={() => go('forumTopic', { id: t.id })}>
              <h3 style={{ margin: 0 }}>{t.title}</h3>
              <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>
                por {t.author?.name} · {t._count?.replies ?? 0} respostas
              </p>
            </div>
          ))}
          {topics.length === 0 && <p className="muted">Ainda não há tópicos.</p>}
        </div>
      )}
    </div>
  );
}
