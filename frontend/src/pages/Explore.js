import React, { useEffect, useState } from 'react';
import { listContent } from '../api/content';
import { CardGridSkeleton } from '../components/Skeleton';
import ContentCard from '../components/ContentCard';

export default function Explore() {
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

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <CardGridSkeleton count={4} />
      ) : (
        <div className="grid">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && <p className="muted">Ainda não há conteúdos publicados.</p>}
    </div>
  );
}
