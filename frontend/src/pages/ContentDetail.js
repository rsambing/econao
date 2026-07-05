import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getContent, createComment, updateComment, deleteComment } from '../api/content';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';
import CommentItem from '../components/CommentItem';
import BackButton from '../components/BackButton';

const TYPE_LABEL = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];
const VIDEO_EXT = ['mp4', 'webm', 'mov', 'm4v'];
const AUDIO_EXT = ['mp3', 'wav', 'ogg', 'm4a'];

function extensionOf(url) {
  // Ignora a query string (URLs como as do Unsplash não têm extensão literal).
  const path = url.split('?')[0];
  const match = /\.([a-z0-9]+)$/i.exec(path);
  return match ? match[1].toLowerCase() : '';
}

function MediaPlayer({ type, url, coverUrl }) {
  // Mesmo ficheiro que já aparece no hero — evita mostrar um link redundante.
  if (url === coverUrl) return null;

  const ext = extensionOf(url);
  const isVideo = type === 'VIDEO' || VIDEO_EXT.includes(ext);
  const isAudio = type === 'PODCAST' || AUDIO_EXT.includes(ext);
  const isImage = type === 'TEXT' || IMAGE_EXT.includes(ext);

  if (isVideo) return <video src={url} controls style={{ width: '100%', maxWidth: 640, borderRadius: 12, margin: '16px 0' }} />;
  if (isAudio) return <audio src={url} controls style={{ width: '100%', maxWidth: 640, margin: '16px 0' }} />;
  if (isImage) return <img src={url} alt="" style={{ width: '100%', maxWidth: 640, borderRadius: 12, margin: '16px 0' }} />;
  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Abrir media <ExternalLink size={15} strokeWidth={2.2} />
      </a>
    </p>
  );
}

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (!content) return <DetailSkeleton />;

  return (
    <div>
      <BackButton fallback="/" />

      {content.imageUrl && (
        <div
          className="content-hero"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
        >
          <span className="badge" style={{ background: 'rgba(255,255,255,0.9)' }}>
            {TYPE_LABEL[content.type] || content.type}
          </span>
        </div>
      )}

      {!content.imageUrl && <span className="badge">{TYPE_LABEL[content.type] || content.type}</span>}

      <h1 className="page-title" style={{ marginTop: 14 }}>{content.title}</h1>
      <p className="muted">{content.theme}{content.region ? ` · ${content.region}` : ''}</p>

      {content.mediaUrl && <MediaPlayer type={content.type} url={content.mediaUrl} coverUrl={content.imageUrl} />}

      <p style={{ lineHeight: 1.6 }}>{content.body}</p>

      <h2 style={{ marginTop: 32, fontSize: 18 }}>Comentários</h2>
      <div className="list">
        {content.comments?.map((c) => (
          <CommentItem
            key={c.id}
            item={c}
            onSave={async (id, body) => { await updateComment(id, body); load(); }}
            onDelete={async (id) => { await deleteComment(id); load(); }}
          />
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
          <button className="btn" onClick={() => navigate('/login')}>Entra</button> para comentar.
        </p>
      )}
    </div>
  );
}
