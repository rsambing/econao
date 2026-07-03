import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Botão de voltar padrão.
 * - Por omissão volta para a tela anterior (navigate(-1)).
 * - Se não houver histórico (ex.: link direto / refresh), usa `fallback`.
 * - `to` força sempre um destino fixo (usado nos ecrãs de acesso restrito).
 */
export default function BackButton({ to, fallback = '/', label = 'Voltar', className = '', style }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button type="button" className={`btn-back ${className}`.trim()} onClick={handleClick} style={style}>
      <ArrowLeft size={17} strokeWidth={2.2} />
      {label}
    </button>
  );
}
