import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <img src="/assets/logo-wordmark.png" alt="EconAO" className="auth-brand-logo" />
        <h1 className="auth-headline">
          Aprende a história e a <span className="accent">economia</span> de Angola.
        </h1>
        <p className="auth-subheadline">
          Conteúdos, quizzes e debates sobre a economia angolana — feitos para quem quer perceber o país através da sua história.
        </p>
        <div className="auth-feature-stack">
          <div className="auth-feature-card">
            <span className="auth-feature-icon">📖</span>
            <div className="auth-feature-text">
              <strong>Explorar Conteúdos</strong>
              <span>Vídeos, textos e podcasts</span>
            </div>
          </div>
          <div className="auth-feature-card">
            <span className="auth-feature-icon">✓</span>
            <div className="auth-feature-text">
              <strong>Quiz Interactivo</strong>
              <span>Testa o que aprendeste</span>
            </div>
          </div>
          <div className="auth-feature-card">
            <span className="auth-feature-icon">💬</span>
            <div className="auth-feature-text">
              <strong>Fórum de Discussão</strong>
              <span>Debate com a comunidade</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-box">{children}</div>
      </div>
    </div>
  );
}
