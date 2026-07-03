import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ to, label = 'Voltar', className = '', style }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={`btn-back ${className}`.trim()}
      onClick={() => (to ? navigate(to) : navigate(-1))}
      style={style}
    >
      <ArrowLeft size={17} strokeWidth={2.2} />
      {label}
    </button>
  );
}
