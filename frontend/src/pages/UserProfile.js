import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Trophy, Calendar } from 'lucide-react';
import { getPublicProfile } from '../api/users';
import Avatar from '../components/Avatar';
import BackButton from '../components/BackButton';
import { DetailSkeleton } from '../components/Skeleton';

const ROLE_LABEL = { ADMIN: 'Administrador', USER: 'Membro' };

function formatJoin(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setProfile(null);
    setError('');
    getPublicProfile(id).then(setProfile).catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div>
        <BackButton />
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!profile) return <DetailSkeleton />;

  const { user, forumTopics, bestScores } = profile;

  return (
    <div>
      <BackButton />

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Avatar name={user.name} url={user.avatarUrl} size={72} />
        <div>
          <h1 className="page-title" style={{ marginBottom: 6 }}>{user.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="badge">{ROLE_LABEL[user.role] || user.role}</span>
            <span className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
              <Calendar size={14} strokeWidth={2.2} /> Membro desde {formatJoin(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: 28 }}>
        <h2 className="search-section-title">
          <MessageSquare size={15} strokeWidth={2.4} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Tópicos no fórum
        </h2>
        {forumTopics.length === 0 ? (
          <p className="muted">Ainda não criou tópicos.</p>
        ) : (
          <div className="list">
            {forumTopics.map((t) => (
              <button key={t.id} className="search-result-row" onClick={() => navigate(`/forum/${t.id}`)}>
                <span className="search-result-icon"><MessageSquare size={18} strokeWidth={2.2} /></span>
                <span>
                  <strong>{t.title}</strong>
                  <span className="muted" style={{ display: 'block', fontSize: 13 }}>
                    {t._count?.replies ?? 0} resposta{(t._count?.replies ?? 0) === 1 ? '' : 's'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="search-section-title">
          <Trophy size={15} strokeWidth={2.4} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Melhores pontuações
        </h2>
        {bestScores.length === 0 ? (
          <p className="muted">Ainda não completou quizzes.</p>
        ) : (
          <div className="list">
            {bestScores.map((s) => (
              <button key={s.quizId} className="search-result-row" onClick={() => navigate(`/quiz/${s.quizId}`)}>
                <span className="search-result-icon"><Trophy size={18} strokeWidth={2.2} /></span>
                <span>
                  <strong>{s.title}</strong>
                  <span className="muted" style={{ display: 'block', fontSize: 13 }}>
                    Melhor pontuação: {s.score}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
