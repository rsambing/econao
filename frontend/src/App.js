import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Explore from './pages/Explore';
import ContentDetail from './pages/ContentDetail';
import Quizzes from './pages/Quizzes';
import QuizPlay from './pages/QuizPlay';
import Forum from './pages/Forum';
import ForumTopic from './pages/ForumTopic';
import Profile from './pages/Profile';
import AdminContent from './pages/admin/AdminContent';
import AdminQuiz from './pages/admin/AdminQuiz';
import Avatar from './components/Avatar';

// Se o link de recuperação de senha (enviado por email) trouxer ?reset_token=,
// arranca directamente no ecrã de redefinição, com o URL limpo a seguir.
function getInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get('reset_token');
  if (resetToken) {
    window.history.replaceState({}, '', window.location.pathname);
    return { name: 'resetPassword', params: { token: resetToken } };
  }
  return { name: 'explore', params: {} };
}

function App() {
  const { user, loading, logout } = useAuth();
  const [route, setRoute] = useState(getInitialRoute);

  const go = (name, params = {}) => setRoute({ name, params });

  if (loading) {
    return null;
  }

  const renderView = () => {
    switch (route.name) {
      case 'login':
        return <Login go={go} />;
      case 'register':
        return <Register go={go} />;
      case 'forgotPassword':
        return <ForgotPassword go={go} />;
      case 'resetPassword':
        return <ResetPassword token={route.params.token} go={go} />;
      case 'content':
        return <ContentDetail id={route.params.id} go={go} />;
      case 'quizzes':
        return <Quizzes go={go} />;
      case 'quiz':
        return <QuizPlay id={route.params.id} go={go} />;
      case 'forum':
        return <Forum go={go} />;
      case 'forumTopic':
        return <ForumTopic id={route.params.id} go={go} />;
      case 'profile':
        return <Profile go={go} />;
      case 'admin':
        return <AdminContent go={go} />;
      case 'adminQuiz':
        return <AdminQuiz go={go} />;
      case 'explore':
      default:
        return <Explore go={go} />;
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => go('explore')}>
          <img src="/assets/logo-wordmark.png" alt="EconAO" className="brand-logo" />
        </div>
        <nav className="nav">
          <button className={`nav-btn ${route.name === 'explore' ? 'active' : ''}`} onClick={() => go('explore')}>
            Explorar
          </button>
          <button className={`nav-btn ${route.name === 'quizzes' || route.name === 'quiz' ? 'active' : ''}`} onClick={() => go('quizzes')}>
            Quiz
          </button>
          <button className={`nav-btn ${route.name === 'forum' || route.name === 'forumTopic' ? 'active' : ''}`} onClick={() => go('forum')}>
            Fórum
          </button>
          {user?.role === 'ADMIN' && (
            <>
              <button className={`nav-btn ${route.name === 'admin' ? 'active' : ''}`} onClick={() => go('admin')}>
                Gestão
              </button>
              <button className={`nav-btn ${route.name === 'adminQuiz' ? 'active' : ''}`} onClick={() => go('adminQuiz')}>
                Gestão Quiz
              </button>
            </>
          )}
          {user ? (
            <>
              <button
                className={`nav-btn ${route.name === 'profile' ? 'active' : ''}`}
                onClick={() => go('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Avatar name={user.name} url={user.avatarUrl} size={22} />
                {user.name}
              </button>
              <button className="nav-btn" onClick={() => { logout(); go('explore'); }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button className={`nav-btn ${route.name === 'login' ? 'active' : ''}`} onClick={() => go('login')}>
                Entrar
              </button>
              <button className={`nav-btn ${route.name === 'register' ? 'active' : ''}`} onClick={() => go('register')}>
                Registar
              </button>
            </>
          )}
        </nav>
      </header>
      <main className="page">{renderView()}</main>
    </div>
  );
}

export default App;
