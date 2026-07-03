import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, MessageSquare } from 'lucide-react';
import { search } from '../api/search';
import ContentCard from '../components/ContentCard';
import { CardGridSkeleton } from '../components/Skeleton';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [term, setTerm] = useState(q);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTerm(q);
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError('');
    search(q)
      .then(setResults)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = term.trim();
    if (value) setSearchParams({ q: value });
  };

  const total = results
    ? results.content.length + results.quizzes.length + results.topics.length
    : 0;

  return (
    <div>
      <h1 className="page-title">Pesquisar</h1>
      <p className="page-subtitle">Encontra conteúdos, quizzes e debates do fórum.</p>

      <form className="search-page-box" onSubmit={handleSubmit}>
        <Search size={20} strokeWidth={2.2} />
        <input
          autoFocus
          type="search"
          placeholder="O que procuras?"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Termo de pesquisa"
        />
        <button type="submit" className="btn primary">Pesquisar</button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading && <CardGridSkeleton count={3} />}

      {!loading && results && (
        <>
          <p className="muted" style={{ margin: '4px 0 24px' }}>
            {total === 0
              ? `Sem resultados para "${results.query}".`
              : `${total} resultado${total > 1 ? 's' : ''} para "${results.query}".`}
          </p>

          {results.content.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 className="search-section-title">Conteúdos</h2>
              <div className="grid">
                {results.content.map((item) => <ContentCard key={item.id} item={item} />)}
              </div>
            </section>
          )}

          {results.quizzes.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 className="search-section-title">Quizzes</h2>
              <div className="list">
                {results.quizzes.map((quiz) => (
                  <button key={quiz.id} className="search-result-row" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                    <span className="search-result-icon"><HelpCircle size={18} strokeWidth={2.2} /></span>
                    <span>
                      <strong>{quiz.title}</strong>
                      <span className="muted" style={{ display: 'block', fontSize: 13 }}>
                        {quiz._count?.questions ?? 0} pergunta{(quiz._count?.questions ?? 0) === 1 ? '' : 's'}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {results.topics.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 className="search-section-title">Fórum</h2>
              <div className="list">
                {results.topics.map((topic) => (
                  <button key={topic.id} className="search-result-row" onClick={() => navigate(`/forum/${topic.id}`)}>
                    <span className="search-result-icon"><MessageSquare size={18} strokeWidth={2.2} /></span>
                    <span>
                      <strong>{topic.title}</strong>
                      <span className="muted" style={{ display: 'block', fontSize: 13 }}>
                        {topic._count?.replies ?? 0} resposta{(topic._count?.replies ?? 0) === 1 ? '' : 's'} · por {topic.author?.name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {!loading && !results && (
        <p className="muted">Escreve algo acima para começar a pesquisar.</p>
      )}
    </div>
  );
}
