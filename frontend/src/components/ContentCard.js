import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, Headphones, MapPin } from 'lucide-react';

const TYPE_LABEL = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };
const TYPE_ICON = { VIDEO: Play, TEXT: FileText, PODCAST: Headphones };

export default function ContentCard({ item }) {
  const navigate = useNavigate();
  const TypeIcon = TYPE_ICON[item.type] || FileText;

  const background = item.imageUrl
    ? `url(${item.imageUrl})`
    : 'linear-gradient(135deg, var(--bordeaux), var(--bordeaux-dark))';

  return (
    <div className="content-card" onClick={() => navigate(`/content/${item.id}`)}>
      <div className="content-card-media" style={{ backgroundImage: background }}>
        <div className="content-card-overlay">
          <div className="content-card-badges">
            <span className="content-card-chip">
              <TypeIcon size={13} strokeWidth={2.4} /> {TYPE_LABEL[item.type] || item.type}
            </span>
            {item.region && (
              <span className="content-card-chip">
                <MapPin size={13} strokeWidth={2.4} /> {item.region}
              </span>
            )}
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
