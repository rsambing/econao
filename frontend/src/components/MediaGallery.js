import React from 'react';
import { X } from 'lucide-react';

/**
 * Galeria de media em scroll horizontal.
 * `items`: [{ id?, url, type }] — type IMAGE | VIDEO | AUDIO.
 * `onRemove(index)`: quando presente, mostra o botão X em cada item (modo edição).
 */
export default function MediaGallery({ items, onRemove, height = 200 }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="media-gallery">
      {items.map((m, i) => (
        <div key={m.id ?? `${m.url}-${i}`} className="media-gallery-item" style={{ height }}>
          {m.type === 'VIDEO' ? (
            <video src={m.url} controls style={{ height: '100%', borderRadius: 12, display: 'block' }} />
          ) : m.type === 'AUDIO' ? (
            <div className="media-gallery-audio">
              <audio src={m.url} controls style={{ width: 260 }} />
            </div>
          ) : (
            <img src={m.url} alt="" style={{ height: '100%', borderRadius: 12, display: 'block' }} />
          )}
          {onRemove && (
            <button type="button" className="media-remove" title="Remover" onClick={() => onRemove(i)}>
              <X size={14} strokeWidth={2.6} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
