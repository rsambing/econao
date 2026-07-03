import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppShell from './components/AppShell';
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

function App() {
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<AppShell />}>
          <Route path="/" element={<Explore />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quiz/:id" element={<QuizPlay />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumTopic />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminContent />} />
          <Route path="/admin/quiz" element={<AdminQuiz />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
