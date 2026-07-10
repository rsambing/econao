import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { listQuizzes, getRanking } from '../api/quiz';
import { useAuth } from '../context/AuthContext';
import { ListSkeleton } from '../components/Skeleton';

export default function Quizzes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRankingId, setOpenRankingId] = useState(null);
  const [rankings, setRankings] = useState({});
  const [rankingLoading, setRankingLoading] = useState(null);

  useEffect(() => {
    listQuizzes().then(setQuizzes).finally(() => setLoading(false));
  }, []);

  const toggleRanking = async (quizId) => {
    if (openRankingId === quizId) {
      setOpenRankingId(null);
      return;
    }
    setOpenRankingId(quizId);
    if (!rankings[quizId]) {
      setRankingLoading(quizId);
      try {
        const rank = await getRanking(quizId);
        setRankings((prev) => ({ ...prev, [quizId]: rank }));
      } finally {
        setRankingLoading(null);
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Quiz Interactivo</h1>
      <p className="page-subtitle">Testa os teus conhecimentos sobre economia e história angolana.</p>

      {loading && <ListSkeleton count={3} />}

      <div className="list">
        {quizzes.map((q) => (
          <div key={q.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {q.imageUrl && (
                  <img src={q.imageUrl} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div>
                  <h3 style={{ margin: 0 }}>{q.title}</h3>
                  <p className="muted" style={{ margin: '4px 0 0', fontSize: 14 }}>{q._count?.questions ?? 0} perguntas</p>
                </div>
              </div>
              <span style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => toggleRanking(q.id)}>
                  <Trophy size={15} strokeWidth={2.2} /> {openRankingId === q.id ? 'Fechar ranking' : 'Ver ranking'}
                </button>
                <button className="btn primary" onClick={() => navigate(`/quiz/${q.id}`)}>Iniciar Quiz</button>
              </span>
            </div>

            {openRankingId === q.id && (
              <div style={{ marginTop: 16 }}>
                {rankingLoading === q.id ? (
                  <p className="muted">A carregar ranking...</p>
                ) : rankings[q.id]?.length ? (
                  <table className="table">
                    <thead>
                      <tr><th>#</th><th>Nome</th><th>Pontos</th><th>Jogos</th></tr>
                    </thead>
                    <tbody>
                      {rankings[q.id].map((r, i) => (
                        <tr key={r.userId} className={user && r.userId === user.id ? 'quiz-me' : ''}>
                          <td>{i + 1}</td>
                          <td>{r.name}</td>
                          <td>{r.points}</td>
                          <td>{r.attempts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="muted">Ainda ninguém jogou este quiz.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && quizzes.length === 0 && <p className="muted">Ainda não há quizzes disponíveis.</p>}
    </div>
  );
}
