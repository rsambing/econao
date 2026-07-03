import React from 'react';
import BackButton from './BackButton';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <BackButton to="/" className="auth-back" />
      <div className="auth-card">
        <img src="/assets/logo-wordmark.png" alt="EconAO" className="auth-card-logo" />
        <div className="auth-card-body">{children}</div>
      </div>
    </div>
  );
}
