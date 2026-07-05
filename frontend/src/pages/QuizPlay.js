import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { getQuiz, submitAttempt, getRanking } from '../api/quiz';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';
import BackButton from '../components/BackButton';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuiz(id).then(setQuiz).catch((err) => setError(err.message));
  }, [id]);

  if (error && !quiz) {
    return (
      <div>
        <BackButton fallback="/quizzes" />
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!quiz) return <DetailSkeleton />;

  const questions = quiz.questions || [];
  const totalQ = questions.length;
  const q = questions[current];
  const answeredCount = Object.keys(answers).length;

  const selectOption = (optionId) => {
    if (result || !user) return;
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: Number(questionId),
        optionId: Number(optionId)
      }));
      const res = await submitAttempt(id, payload);
      setResult(res);
      const rank = await getRanking(id);
      setRanking(rank);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setResult(null);
    setRanking([]);
    setCurrent(0);
    setError('');
  };

  // ---------- Ecrã de resultado ----------
  if (result) {
    return (
      <div>
        <BackButton fallback="/quizzes" />
        <h1 className="page-title">{quiz.title}</h1>

        <div className="card quiz-result-card">
          <div className="quiz-score">{result.score}<span>/{result.total}</span></div>
          <p className="muted">
            Acertaste {result.score} de {result.total} · {result.attempts}ª vez que jogas este quiz
          </p>
        </div>

        <h2 className="search-section-title" style={{ marginTop: 24 }}>Revisão</h2>
        <div className="list">
          {questions.map((question, i) => {
            const fb = result.feedback?.find((f) => f.questionId === question.id);
            const chosen = question.options.find((o) => o.id === fb?.chosenOptionId);
            const correct = question.options.find((o) => o.id === fb?.correctOptionId);
            return (
              <div key={question.id} className="card">
                <strong>{i + 1}. {question.text}</strong>
                <p className={fb?.isCorrect ? 'quiz-ok' : 'quiz-bad'} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '10px 0 0' }}>
                  {fb?.isCorrect ? <Check size={15} strokeWidth={2.6} /> : <X size={15} strokeWidth={2.6} />}
                  A tua resposta: {chosen?.text || '— (sem resposta)'}
                </p>
                {!fb?.isCorrect && (
                  <p className="quiz-ok" style={{ margin: '4px 0 0' }}>Resposta correta: {correct?.text}</p>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="search-section-title" style={{ marginTop: 24 }}>Ranking</h2>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Nome</th><th>Pontos</th><th>Jogos</th></tr>
          </thead>
          <tbody>
            {ranking.map((r, i) => (
              <tr key={r.userId} className={user && r.userId === user.id ? 'quiz-me' : ''}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.points}</td>
                <td>{r.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn primary" onClick={restart}>Jogar de novo</button>
          <button className="btn" onClick={() => navigate('/quizzes')}>Voltar aos quizzes</button>
        </div>
      </div>
    );
  }

  // ---------- Ecrã de jogo (uma pergunta por vez) ----------
  const progressPct = totalQ ? Math.round(((current + 1) / totalQ) * 100) : 0;
  const currentAnswered = answers[q.id] != null;
  const isLast = current === totalQ - 1;

  return (
    <div>
      <BackButton fallback="/quizzes" />
      <h1 className="page-title">{quiz.title}</h1>

      {!user && (
        <p className="error-text">
          Precisas de <button className="btn" onClick={() => navigate('/login')}>entrar</button> para responder.
        </p>
      )}

      <div className="quiz-progress-head">
        <span>Pergunta {current + 1} de {totalQ}</span>
        <span>{answeredCount}/{totalQ} respondidas</span>
      </div>
      <div className="quiz-progress">
        <div className="quiz-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="quiz-question-card">
        <h2 className="quiz-question-text">{q.text}</h2>
        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={opt.id}
              className={`quiz-option-mc${answers[q.id] === opt.id ? ' selected' : ''}`}
              onClick={() => selectOption(opt.id)}
              disabled={!user}
            >
              <span className="quiz-letter">{LETTERS[i]}</span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

      <div className="quiz-nav">
        <button className="btn" onClick={() => setCurrent((c) => c - 1)} disabled={current === 0}>
          Anterior
        </button>
        {isLast ? (
          <button className="btn primary" onClick={handleSubmit} disabled={submitting || answeredCount < totalQ}>
            {submitting ? 'A submeter...' : 'Confirmar respostas'}
          </button>
        ) : (
          <button className="btn primary" onClick={() => setCurrent((c) => c + 1)} disabled={!currentAnswered}>
            Próxima
          </button>
        )}
      </div>
    </div>
  );
}
