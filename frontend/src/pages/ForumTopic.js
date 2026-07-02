import React, { useEffect, useState } from 'react';
import { getTopic, createReply } from '../api/forum';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';

export default function ForumTopic({ id, go }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const load = () => getTopic(id).then(setTopic);

  useEffect(() => { load(); }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      await createReply(id, body);
      setBody('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!topic) return <DetailSkeleton />;

  return (
    <div>
      <button className="btn" onClick={() => go('forum')} style={{ marginBottom: 16 }}>← Voltar</button>
      <h1 className="page-title">{topic.title}</h1>
      <p className="muted">por {topic.author?.name}</p>
      <p style={{ lineHeight: 1.6 }}>{topic.description}</p>

      <h2 style={{ marginTop: 32, fontSize: 18 }}>Respostas</h2>
      <div className="list">
        {topic.replies?.map((r) => (
          <div key={r.id} className="comment">
            <strong>{r.author?.name}</strong>
            <p style={{ margin: '4px 0 0' }}>{r.body}</p>
          </div>
        ))}
        {(!topic.replies || topic.replies.length === 0) && <p className="muted">Sê o primeiro a responder.</p>}
      </div>

      {user ? (
        <form className="form" onSubmit={handleReply} style={{ marginTop: 16 }}>
          <textarea
            rows={3}
            placeholder="Escreve a tua contribuição..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 10, fontFamily: 'inherit' }}
          />
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="btn primary">Enviar Resposta</button>
        </form>
      ) : (
        <p className="muted" style={{ marginTop: 16 }}>
          <button className="btn" onClick={() => go('login')}>Entra</button> para responder.
        </p>
      )}
    </div>
  );
}
