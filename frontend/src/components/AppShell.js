import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Compass, HelpCircle, MessageSquare, ChevronDown, LogOut, User, LayoutGrid, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const NAV_ITEMS = [
  { to: '/', label: 'Explorar', icon: Compass, end: true },
  { to: '/quizzes', label: 'Quiz', icon: HelpCircle },
  { to: '/forum', label: 'Fórum', icon: MessageSquare },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="fb-app">
      <header className="fb-topbar">
        <div className="fb-topbar-left">
          <NavLink to="/" className="fb-brand">
            <img src="/assets/logo-icon.png" alt="EconAO" className="fb-brand-mark" />
            <span className="fb-brand-word">EconAO</span>
          </NavLink>
        </div>

        <nav className="fb-topbar-center">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `fb-nav-icon${isActive ? ' active' : ''}`}
            >
              <Icon size={20} strokeWidth={2.2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="fb-topbar-right">
          {user ? (
            <div className="fb-user-menu" ref={menuRef}>
              <button className="fb-user-trigger" onClick={() => setMenuOpen((o) => !o)}>
                <Avatar name={user.name} url={user.avatarUrl} size={32} />
                <ChevronDown size={16} />
              </button>
              {menuOpen && (
                <div className="fb-dropdown">
                  <div className="fb-dropdown-header">
                    <Avatar name={user.name} url={user.avatarUrl} size={36} />
                    <div>
                      <strong>{user.name}</strong>
                      <span className="fb-dropdown-role">{user.role === 'ADMIN' ? 'Administrador' : 'Utilizador'}</span>
                    </div>
                  </div>
                  <NavLink to="/profile" className="fb-dropdown-item" onClick={() => setMenuOpen(false)}>
                    <User size={17} /> O meu perfil
                  </NavLink>
                  {user.role === 'ADMIN' && (
                    <>
                      <NavLink to="/admin" className="fb-dropdown-item" onClick={() => setMenuOpen(false)}>
                        <FileText size={17} /> Gestão de Conteúdos
                      </NavLink>
                      <NavLink to="/admin/quiz" className="fb-dropdown-item" onClick={() => setMenuOpen(false)}>
                        <LayoutGrid size={17} /> Gestão de Quizzes
                      </NavLink>
                    </>
                  )}
                  <button className="fb-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={17} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="fb-guest-actions">
              <NavLink to="/login" className="btn">Entrar</NavLink>
              <NavLink to="/register" className="btn primary">Registar</NavLink>
            </div>
          )}
        </div>
      </header>

      <main className="fb-main">
        <Outlet />
      </main>
    </div>
  );
}
