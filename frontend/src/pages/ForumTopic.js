import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { getTopic, createReply, updateReply, deleteReply, updateTopic, deleteTopic } from '../api/forum';
import { uploadMedia } from '../api/upload';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';
import Avatar from '../components/Avatar';
import CommentItem from '../components/CommentItem';
import MediaGallery from '../components/MediaGallery';
import BackButton from '../components/BackButton';

const mediaTypeOf = (file) =>
  file.type.startsWith('video') ? 'VIDEO' : file.type.startsWith('audio') ? 'AUDIO' : 'IMAGE';

export default function ForumTopic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  // edição do tópico
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [editMedia, setEditMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => getTopic(id).then(setTopic);

  useEffect(() => { load(); }, [id]);

  const canManage = user && topic && (user.id === topic.author?.id || user.role === 'ADMIN');

  const startEditing = () => {
    setEditTitle(topic.title);
    setEditDescription(topic.description);
    setEditTheme(topic.theme || '');
    // Junta a galeria e a imagem antiga (imageUrl) numa lista única editável.
    const gallery = topic.media?.length
      ? topic.media.map((m) => ({ id: m.id, url: m.url, type: m.type }))
      : (topic.imageUrl ? [{ url: topic.imageUrl, type: 'IMAGE' }] : []);
    setEditMedia(gallery);
    setNewFiles([]);
    setError('');
    setEditing(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const media = [...editMedia.map((m) => ({ url: m.url, type: m.type }))];
      for (const file of newFiles) {
        const url = await uploadMedia(file);
        media.push({ url, type: mediaTypeOf(file) });
      }
      const firstImage = media.find((m) => m.type === 'IMAGE');
      await updateTopic(topic.id, {
        title: editTitle,
        description: editDescription,
        theme: editTheme || null,
        imageUrl: firstImage?.url || null,
        media
      });
      setEditing(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (!window.confirm('Eliminar este tópico e todas as respostas?')) return;
    try {
      await deleteTopic(topic.id);
      navigate('/forum');
    } catch (err) {
      setError(err.message);
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <BackButton fallback="/forum" />
        {canManage && !editing && (
          <span style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={startEditing}>
              <Pencil size={15} strokeWidth={2.2} /> Editar
            </button>
            <button className="btn danger" onClick={handleDeleteTopic}>
              <Trash2 size={15} strokeWidth={2.2} /> Eliminar
            </button>
          </span>
        )}
      </div>

      {editing ? (
        <form className="form" onSubmit={handleSaveTopic} style={{ maxWidth: 560, marginBottom: 24 }}>
          <div className="form-group">
            <label>Título</label>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required minLength={2} />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 8, padding: 10, fontFamily: 'inherit' }}
            />
          </div>
          <div className="form-group">
            <label>Tema / categoria (opcional)</label>
            <input value={editTheme} onChange={(e) => setEditTheme(e.target.value)} placeholder="Ex.: Economia, História..." />
          </div>
          <div className="form-group">
            <label>Fotos e vídeos (remove com o X ou adiciona mais)</label>
            <MediaGallery
              items={editMedia}
              height={110}
              onRemove={(i) => setEditMedia((m) => m.filter((_, j) => j !== i))}
            />
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              multiple
              onChange={(e) => setNewFiles([...(e.target.files || [])])}
            />
            {newFiles.length > 0 && (
              <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                {newFiles.length} novo{newFiles.length > 1 ? 's' : ''} ficheiro{newFiles.length > 1 ? 's' : ''} a adicionar
              </p>
            )}
          </div>
          {error && <div className="error-text">{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar alterações'}
            </button>
            <button type="button" className="btn" onClick={() => setEditing(false)} disabled={saving}>Cancelar</button>
          </div>
        </form>
      ) : (
        <>
          {topic.media?.length > 0 ? (
            <MediaGallery items={topic.media} height={240} />
          ) : topic.imageUrl ? (
            <img src={topic.imageUrl} alt="" style={{ width: '100%', maxWidth: 640, borderRadius: 12, marginBottom: 16 }} />
          ) : null}
          <h1 className="page-title">{topic.title}</h1>
          <p className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Avatar name={topic.author?.name} url={topic.author?.avatarUrl} size={20} />
            por{' '}
            {topic.author?.id
              ? <Link to={`/user/${topic.author.id}`} className="author-link">{topic.author.name}</Link>
              : topic.author?.name}
            {topic.theme && <span className="badge">{topic.theme}</span>}
          </p>
          <p style={{ lineHeight: 1.6 }}>{topic.description}</p>
        </>
      )}

      <h2 style={{ marginTop: 32, fontSize: 18 }}>Respostas</h2>
      <div className="list">
        {topic.replies?.map((r) => (
          <CommentItem
            key={r.id}
            item={r}
            onSave={async (replyId, text) => { await updateReply(replyId, text); load(); }}
            onDelete={async (replyId) => { await deleteReply(replyId); load(); }}
          />
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
          {error && !editing && <div className="error-text">{error}</div>}
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
