import React, { useEffect, useState } from 'react';
import { ExternalLink, Flame } from 'lucide-react';
import { listContent, createContent, updateContent, deleteContent } from '../../api/content';
import { uploadMedia } from '../../api/upload';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import MediaGallery from '../../components/MediaGallery';

const EMPTY_FORM = { type: 'TEXT', title: '', body: '', mediaUrl: '', imageUrl: '', theme: '', region: '', isExclusive: false };
const GALLERY_LIMIT = 3;

const mediaTypeOf = (f) =>
  f.type.startsWith('video') ? 'VIDEO' : f.type.startsWith('audio') ? 'AUDIO' : 'IMAGE';

export default function AdminContent() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [file, setFile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [newGalleryItems, setNewGalleryItems] = useState([]); // [{ file, url, type }]
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => listContent().then(setItems);

  useEffect(() => { load(); }, []);

  if (user?.role !== 'ADMIN') {
    return (
      <div>
        <p className="error-text">Acesso restrito a administradores.</p>
        <BackButton to="/" />
      </div>
    );
  }

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setForm((f) => ({ ...f, type }));
    // Media e galeria só fazem sentido para VIDEO/PODCAST — limpa ao trocar
    // para um tipo onde esses campos ficam escondidos, para não submeter
    // dados escondidos por engano.
    if (type === 'TEXT') {
      setFile(null);
      setForm((f) => ({ ...f, mediaUrl: '' }));
    }
    if (type !== 'VIDEO') {
      setGallery([]);
      newGalleryItems.forEach((g) => URL.revokeObjectURL(g.url));
      setNewGalleryItems([]);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setCoverFile(null);
    setFile(null);
    setGallery([]);
    newGalleryItems.forEach((g) => URL.revokeObjectURL(g.url));
    setNewGalleryItems([]);
    setError('');
  };

  const handleGalleryFilesSelected = (e) => {
    const files = [...(e.target.files || [])];
    const remaining = GALLERY_LIMIT - gallery.length - newGalleryItems.length;
    if (remaining <= 0) {
      setError(`Limite de ${GALLERY_LIMIT} fotos/vídeos na galeria.`);
      e.target.value = '';
      return;
    }
    const accepted = files.slice(0, remaining);
    if (files.length > accepted.length) {
      setError(`Só é possível adicionar mais ${remaining} ficheiro${remaining > 1 ? 's' : ''} (limite de ${GALLERY_LIMIT}).`);
    } else {
      setError('');
    }
    const withPreview = accepted.map((f) => ({ file: f, url: URL.createObjectURL(f), type: mediaTypeOf(f) }));
    setNewGalleryItems((prev) => [...prev, ...withPreview]);
    e.target.value = '';
  };

  const removeNewGalleryItem = (index) => {
    setNewGalleryItems((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let mediaUrl = form.mediaUrl;
      let imageUrl = form.imageUrl;

      if (coverFile || file || newGalleryItems.length) setUploading(true);
      if (coverFile) imageUrl = await uploadMedia(coverFile);
      if (file) mediaUrl = await uploadMedia(file);

      const media = [...gallery.map((m) => ({ url: m.url, type: m.type }))];
      for (const g of newGalleryItems) {
        const url = await uploadMedia(g.file);
        media.push({ url, type: g.type });
      }
      setUploading(false);

      // Em edição, string vazia remove o ficheiro; em criação, omite-se.
      const payload = {
        ...form,
        mediaUrl: editingId ? mediaUrl : (mediaUrl || undefined),
        imageUrl: editingId ? imageUrl : (imageUrl || undefined),
        region: form.region || undefined,
        media
      };
      if (editingId) {
        await updateContent(editingId, payload);
      } else {
        await createContent(payload);
      }
      resetForm();
      load();
    } catch (err) {
      setUploading(false);
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setCoverFile(null);
    setFile(null);
    setGallery((item.media || []).map((m) => ({ id: m.id, url: m.url, type: m.type })));
    newGalleryItems.forEach((g) => URL.revokeObjectURL(g.url));
    setNewGalleryItems([]);
    setError('');
    setForm({
      type: item.type,
      title: item.title,
      body: item.body,
      mediaUrl: item.mediaUrl || '',
      imageUrl: item.imageUrl || '',
      theme: item.theme,
      region: item.region || '',
      isExclusive: !!item.isExclusive
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este conteúdo?')) return;
    await deleteContent(id);
    load();
  };

  const galleryCount = gallery.length + newGalleryItems.length;

  return (
    <div>
      <h1 className="page-title">Gestão de Conteúdos</h1>
      <p className="page-subtitle">Painel de administração (backoffice).</p>

      <form className="form" onSubmit={handleSubmit} style={{ maxWidth: 520, marginBottom: 32 }}>
        <div className="form-group">
          <label>Tipo</label>
          <select value={form.type} onChange={handleTypeChange}>
            <option value="TEXT">Texto</option>
            <option value="VIDEO">Vídeo</option>
            <option value="PODCAST">Podcast</option>
          </select>
        </div>
        <div className="form-group">
          <label>Título</label>
          <input value={form.title} onChange={handleChange('title')} required />
        </div>
        <div className="form-group">
          <label>Conteúdo</label>
          <textarea
            rows={4}
            value={form.body}
            onChange={handleChange('body')}
            required
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 10, padding: 10, fontFamily: 'inherit' }}
          />
        </div>
        <div className="form-group">
          <label>Imagem de capa (mostrada em Explorar) — opcional</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
          {form.imageUrl && !coverFile && (
            <p className="muted" style={{ fontSize: 13, marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              Capa atual:{' '}
              <a href={form.imageUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                ver <ExternalLink size={13} strokeWidth={2.2} />
              </a>
              <button type="button" className="btn danger" style={{ padding: '4px 12px', fontSize: 12 }}
                onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}>
                Remover
              </button>
            </p>
          )}
        </div>

        {form.type !== 'TEXT' && (
          <div className="form-group">
            <label>{form.type === 'VIDEO' ? 'Vídeo' : 'Áudio'} do conteúdo — opcional</label>
            <input
              type="file"
              accept={form.type === 'VIDEO' ? 'video/*' : 'audio/*'}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {form.mediaUrl && !file && (
              <p className="muted" style={{ fontSize: 13, marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                Media atual:{' '}
                <a href={form.mediaUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  ver <ExternalLink size={13} strokeWidth={2.2} />
                </a>
                <button type="button" className="btn danger" style={{ padding: '4px 12px', fontSize: 12 }}
                  onClick={() => setForm((f) => ({ ...f, mediaUrl: '' }))}>
                  Remover
                </button>
              </p>
            )}
          </div>
        )}

        {form.type === 'VIDEO' && (
          <div className="form-group">
            <label>Galeria (fotos/vídeos extra — máximo {GALLERY_LIMIT}, remove com o X)</label>
            <MediaGallery
              items={gallery}
              height={90}
              onRemove={(i) => setGallery((g) => g.filter((_, j) => j !== i))}
            />
            <MediaGallery
              items={newGalleryItems}
              height={90}
              onRemove={removeNewGalleryItem}
            />
            {galleryCount < GALLERY_LIMIT && (
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                onChange={handleGalleryFilesSelected}
              />
            )}
            <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              {galleryCount}/{GALLERY_LIMIT} ficheiros na galeria
            </p>
          </div>
        )}

        <div className="form-group">
          <label>Tema</label>
          <input value={form.theme} onChange={handleChange('theme')} required />
        </div>
        <div className="form-group">
          <label>Região (opcional)</label>
          <input value={form.region} onChange={handleChange('region')} />
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isExclusive}
              onChange={(e) => setForm((f) => ({ ...f, isExclusive: e.target.checked }))}
            />
            <Flame size={15} strokeWidth={2.4} /> Conteúdo Jindungo (exclusivo para utilizadores com conta)
          </label>
        </div>
        {error && <div className="error-text">{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn primary" disabled={uploading}>
            {uploading ? 'A enviar ficheiro...' : editingId ? 'Guardar alterações' : 'Criar conteúdo'}
          </button>
          {editingId && <button type="button" className="btn" onClick={resetForm} disabled={uploading}>Cancelar</button>}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr><th>Título</th><th>Tipo</th><th>Tema</th><th>Jindungo</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td>{item.theme}</td>
              <td>{item.isExclusive && <Flame size={16} strokeWidth={2.4} color="var(--bordeaux)" />}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => handleEdit(item)}>Editar</button>
                <button className="btn danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
