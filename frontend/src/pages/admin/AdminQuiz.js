import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listQuizzes, createQuiz } from '../../api/quiz';
import { uploadMedia } from '../../api/upload';
import { useAuth } from '../../context/AuthContext';

const EMPTY_QUESTION = () => ({ text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] });

export default function AdminQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([EMPTY_QUESTION()]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => listQuizzes().then(setQuizzes);

  useEffect(() => { load(); }, []);

  if (user?.role !== 'ADMIN') {
    return (
      <div>
        <p className="error-text">Acesso restrito a administradores.</p>
        <button className="btn" onClick={() => navigate('/')}>Voltar</button>
      </div>
    );
  }

  const updateQuestionText = (qIndex, text) => {
    setQuestions((qs) => qs.map((q, i) => (i === qIndex ? { ...q, text } : q)));
  };

  const updateOptionText = (qIndex, oIndex, text) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i !== qIndex ? q : { ...q, options: q.options.map((o, j) => (j === oIndex ? { ...o, text } : o)) }))
    );
  };

  const setCorrectOption = (qIndex, oIndex) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i !== qIndex ? q : { ...q, options: q.options.map((o, j) => ({ ...o, isCorrect: j === oIndex })) }
      )
    );
  };

  const addOption = (qIndex) => {
    setQuestions((qs) => qs.map((q, i) => (i !== qIndex ? q : { ...q, options: [...q.options, { text: '', isCorrect: false }] })));
  };

  const removeOption = (qIndex, oIndex) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i !== qIndex ? q : { ...q, options: q.options.filter((_, j) => j !== oIndex) }))
    );
  };

  const addQuestion = () => setQuestions((qs) => [...qs, EMPTY_QUESTION()]);
  const removeQuestion = (qIndex) => setQuestions((qs) => qs.filter((_, i) => i !== qIndex));

  const resetForm = () => {
    setTitle('');
    setFile(null);
    setQuestions([EMPTY_QUESTION()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    for (const q of questions) {
      if (q.options.filter((o) => o.text.trim()).length < 2) {
        setError('Cada pergunta precisa de pelo menos 2 opções preenchidas.');
        return;
      }
      if (!q.options.some((o) => o.isCorrect)) {
        setError('Cada pergunta precisa de uma opção correcta.');
        return;
      }
    }

    setSubmitting(true);
    try {
      let imageUrl;
      if (file) {
        imageUrl = await uploadMedia(file);
      }
      await createQuiz({
        title,
        imageUrl,
        questions: questions.map((q, i) => ({
          text: q.text,
          order: i + 1,
          options: q.options.filter((o) => o.text.trim())
        }))
      });
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Gestão de Quizzes</h1>
      <p className="page-subtitle">Cria quizzes com perguntas, opções e imagem de capa.</p>

      <form className="form" onSubmit={handleSubmit} style={{ maxWidth: 640, marginBottom: 32 }}>
        <div className="form-group">
          <label>Título do quiz</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Imagem de capa (opcional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="card" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>Pergunta {qIndex + 1}</label>
              <input value={q.text} onChange={(e) => updateQuestionText(qIndex, e.target.value)} required />
            </div>

            {q.options.map((o, oIndex) => (
              <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={o.isCorrect}
                  onChange={() => setCorrectOption(qIndex, oIndex)}
                  title="Marcar como resposta correcta"
                />
                <input
                  value={o.text}
                  onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                  placeholder={`Opção ${oIndex + 1}`}
                  style={{ flex: 1 }}
                />
                {q.options.length > 2 && (
                  <button type="button" className="btn danger" onClick={() => removeOption(qIndex, oIndex)}>×</button>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button type="button" className="btn" onClick={() => addOption(qIndex)}>+ Opção</button>
              {questions.length > 1 && (
                <button type="button" className="btn danger" onClick={() => removeQuestion(qIndex)}>Remover pergunta</button>
              )}
            </div>
          </div>
        ))}

        <button type="button" className="btn" onClick={addQuestion} style={{ marginBottom: 16 }}>+ Adicionar pergunta</button>

        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? 'A criar...' : 'Criar quiz'}
        </button>
      </form>

      <table className="table">
        <thead>
          <tr><th>Título</th><th>Perguntas</th></tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q._count?.questions ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
