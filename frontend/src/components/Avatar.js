import React from 'react';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Avatar({ name, url, size = 36 }) {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Math.max(11, size * 0.4),
    fontWeight: 700,
    objectFit: 'cover',
  };

  if (url) {
    return <img src={url} alt={name || 'Avatar'} style={style} />;
  }

  return (
    <span
      style={{
        ...style,
        background: 'var(--bordeaux)',
        color: '#fff',
        userSelect: 'none',
      }}
    >
      {getInitials(name)}
    </span>
  );
}
