import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <img src="/assets/logo-wordmark.png" alt="EconAO" className="auth-card-logo" />
        <div className="auth-card-body">{children}</div>
      </div>
    </div>
  );
}
