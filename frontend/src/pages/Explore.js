import React, { useEffect, useState } from 'react';
import { listContent } from '../api/content';

const TYPE_LABEL = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };

export default function Explore({ go }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listContent()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Explorar Conteúdos</h1>
      <p className="page-subtitle">Vídeos, textos e podcasts sobre economia e história de Angola.</p>

      {loading && <p className="muted">A carregar...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="grid">
        {items.map((item) => (
          <div key={item.id} className="card" style={{ cursor: 'pointer' }} onClick={() => go('content', { id: item.id })}>
            <span className="badge">{TYPE_LABEL[item.type] || item.type}</span>
            <h3 style={{ margin: '10px 0 6px' }}>{item.title}</h3>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>{item.theme}</p>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && <p className="muted">Ainda não há conteúdos publicados.</p>}
    </div>
  );
}
