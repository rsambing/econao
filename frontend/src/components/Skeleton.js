import React from 'react';

export function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, display: 'block', ...style }}
    />
  );
}

// Grelha de cards (Explorar Conteúdos)
export function CardGridSkeleton({ count = 4 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <Skeleton width={70} height={20} radius={999} />
          <Skeleton height={20} style={{ marginTop: 12 }} />
          <Skeleton width="55%" height={14} style={{ marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

// Lista de linhas (Quiz, Fórum)
export function ListSkeleton({ count = 3 }) {
  return (
    <div className="list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <Skeleton width="45%" height={20} />
          <Skeleton width="30%" height={14} style={{ marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

// Página de detalhe (conteúdo, tópico de fórum, quiz)
export function DetailSkeleton() {
  return (
    <div>
      <Skeleton width={80} height={20} radius={999} />
      <Skeleton width="70%" height={28} style={{ marginTop: 14 }} />
      <Skeleton width="40%" height={14} style={{ marginTop: 10 }} />
      <Skeleton height={14} style={{ marginTop: 24 }} />
      <Skeleton height={14} style={{ marginTop: 8 }} />
      <Skeleton width="85%" height={14} style={{ marginTop: 8 }} />
      <Skeleton width="60%" height={14} style={{ marginTop: 8 }} />
    </div>
  );
}
