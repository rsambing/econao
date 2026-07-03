import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopic, createReply } from '../api/forum';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';
import Avatar from '../components/Avatar';
import BackButton from '../components/BackButton';

export default function ForumTopic() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <BackButton to="/forum" />
      {topic.imageUrl && (
        <img src={topic.imageUrl} alt="" style={{ width: '100%', maxWidth: 640, borderRadius: 12, marginBottom: 16 }} />
      )}
      <h1 className="page-title">{topic.title}</h1>
      <p className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Avatar name={topic.author?.name} url={topic.author?.avatarUrl} size={20} />
        por {topic.author?.name}
      </p>
      <p style={{ lineHeight: 1.6 }}>{topic.description}</p>

      <h2 style={{ marginTop: 32, fontSize: 18 }}>Respostas</h2>
      <div className="list">
        {topic.replies?.map((r) => (
          <div key={r.id} className="comment" style={{ display: 'flex', gap: 10 }}>
            <Avatar name={r.author?.name} url={r.author?.avatarUrl} size={32} />
            <div>
              <strong>{r.author?.name}</strong>
              <p style={{ margin: '4px 0 0' }}>{r.body}</p>
            </div>
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
          <button className="btn" onClick={() => navigate('/login')}>Entra</button> para responder.
        </p>
      )}
    </div>
  );
}
