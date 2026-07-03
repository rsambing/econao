import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitAttempt, getRanking } from '../api/quiz';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuiz(id).then(setQuiz).catch((err) => setError(err.message));
  }, [id]);

  const selectOption = (questionId, optionId) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    setError('');
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
    }
  };

  if (!quiz) return <DetailSkeleton />;

  const feedbackFor = (questionId) => result?.feedback?.find((f) => f.questionId === questionId);

  return (
    <div>
      <button className="btn" onClick={() => navigate('/quizzes')} style={{ marginBottom: 16 }}> Voltar</button>
      {quiz.imageUrl && (
        <img src={quiz.imageUrl} alt="" style={{ width: '100%', maxWidth: 640, borderRadius: 12, marginBottom: 16 }} />
      )}
      <h1 className="page-title">{quiz.title}</h1>

      {!user && <p className="error-text">Precisas de <button className="btn" onClick={() => navigate('/login')}>entrar</button> para responder.</p>}

      {quiz.questions.map((q) => {
        const fb = feedbackFor(q.id);
        return (
          <div key={q.id} className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>{q.text}</h3>
            {q.options.map((opt) => {
              let cls = 'quiz-option';
              if (answers[q.id] === opt.id) cls += ' selected';
              if (result) {
                if (fb?.correctOptionId === opt.id) cls += ' correct';
                else if (fb?.chosenOptionId === opt.id && !fb?.isCorrect) cls += ' incorrect';
              }
              return (
                <div key={opt.id} className={cls} onClick={() => selectOption(q.id, opt.id)}>
                  {opt.text}
                </div>
              );
            })}
          </div>
        );
      })}

      {error && <p className="error-text">{error}</p>}

      {!result ? (
        <button className="btn primary" disabled={!user} onClick={handleSubmit}>Confirmar respostas</button>
      ) : (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Resultado: {result.score} de {result.total}</h3>
          <h4>Ranking</h4>
          <table className="table">
            <thead><tr><th>#</th><th>Nome</th><th>Pontos</th></tr></thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={i}><td>{i + 1}</td><td>{r.name}</td><td>{r.score}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
