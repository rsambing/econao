import React from 'react';
import { useNavigate } from 'react-router-dom';

const TYPE_LABEL = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };
const TYPE_ICON = { VIDEO: '▶', TEXT: '📄', PODCAST: '🎧' };

export default function ContentCard({ item }) {
  const navigate = useNavigate();

  const background = item.imageUrl
    ? `url(${item.imageUrl})`
    : 'linear-gradient(135deg, var(--bordeaux), var(--bordeaux-dark))';

  return (
    <div className="content-card" onClick={() => navigate(`/content/${item.id}`)}>
      <div className="content-card-media" style={{ backgroundImage: background }}>
        <div className="content-card-overlay">
          <div className="content-card-badges">
            <span className="content-card-chip">{TYPE_ICON[item.type]} {TYPE_LABEL[item.type] || item.type}</span>
            {item.region && <span className="content-card-chip">📍 {item.region}</span>}
          </div>
          <h3 className="content-card-title">{item.title}</h3>
          <p className="content-card-desc">{item.theme}</p>
        </div>
      </div>
      <div className="content-card-footer">
        <button className="content-card-btn" onClick={() => navigate(`/content/${item.id}`)}>
          Explorar conteúdo
        </button>
      </div>
    </div>
  );
}
