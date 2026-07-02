import React, { useEffect, useState } from 'react';
import { listQuizzes } from '../api/quiz';
import { ListSkeleton } from '../components/Skeleton';

export default function Quizzes({ go }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listQuizzes().then(setQuizzes).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Quiz Interactivo</h1>
      <p className="page-subtitle">Testa os teus conhecimentos sobre economia e história angolana.</p>

      {loading && <ListSkeleton count={3} />}

      <div className="list">
        {quizzes.map((q) => (
          <div key={q.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {q.imageUrl && (
                <img src={q.imageUrl} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div>
                <h3 style={{ margin: 0 }}>{q.title}</h3>
                <p className="muted" style={{ margin: '4px 0 0', fontSize: 14 }}>{q._count?.questions ?? 0} perguntas</p>
              </div>
            </div>
            <button className="btn primary" onClick={() => go('quiz', { id: q.id })}>Iniciar Quiz</button>
          </div>
        ))}
      </div>

      {!loading && quizzes.length === 0 && <p className="muted">Ainda não há quizzes disponíveis.</p>}
    </div>
  );
}
