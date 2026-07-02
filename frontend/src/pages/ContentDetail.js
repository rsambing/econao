import React, { useEffect, useState } from 'react';
import { getContent, createComment } from '../api/content';
import { useAuth } from '../context/AuthContext';

const TYPE_LABEL = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };

export default function ContentDetail({ id, go }) {
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [commentBody, setCommentBody] = useState('');
  const [error, setError] = useState('');

  const load = () => getContent(id).then(setContent).catch((err) => setError(err.message));

  useEffect(() => { load(); }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      await createComment(id, commentBody);
      setCommentBody('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!content) return <p className="muted">A carregar...</p>;

  return (
    <div>
      <button className="btn" onClick={() => go('explore')} style={{ marginBottom: 16 }}>← Voltar</button>
      <span className="badge">{TYPE_LABEL[content.type] || content.type}</span>
      <h1 className="page-title" style={{ marginTop: 10 }}>{content.title}</h1>
      <p className="muted">{content.theme}{content.region ? ` · ${content.region}` : ''}</p>

      {content.mediaUrl && (
        <p><a href={content.mediaUrl} target="_blank" rel="noreferrer">Abrir media ↗</a></p>
      )}

      <p style={{ lineHeight: 1.6 }}>{content.body}</p>

      <h2 style={{ marginTop: 32, fontSize: 18 }}>Comentários</h2>
      <div className="list">
        {content.comments?.map((c) => (
          <div key={c.id} className="comment">
            <strong>{c.author?.name}</strong>
            <p style={{ margin: '4px 0 0' }}>{c.body}</p>
          </div>
        ))}
        {(!content.comments || content.comments.length === 0) && <p className="muted">Sê o primeiro a comentar.</p>}
      </div>

      {user ? (
        <form className="form" onSubmit={handleComment} style={{ marginTop: 16 }}>
          <textarea
            className="input"
            rows={3}
            placeholder="Escreve um comentário..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 10, fontFamily: 'inherit' }}
          />
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="btn primary">Publicar Comentário</button>
        </form>
      ) : (
        <p className="muted" style={{ marginTop: 16 }}>
          <button className="btn" onClick={() => go('login')}>Entra</button> para comentar.
        </p>
      )}
    </div>
  );
}
