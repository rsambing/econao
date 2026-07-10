import React, { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { listQuizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz } from '../../api/quiz';
import { uploadMedia } from '../../api/upload';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';

const EMPTY_QUESTION = () => ({ text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] });

export default function AdminQuiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
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
        <BackButton to="/" />
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
    setEditingId(null);
    setTitle('');
    setExistingImageUrl('');
    setFile(null);
    setQuestions([EMPTY_QUESTION()]);
    setError('');
  };

  const handleEdit = async (quizSummary) => {
    setError('');
    const quiz = await getQuiz(quizSummary.id);
    setEditingId(quiz.id);
    setTitle(quiz.title);
    setExistingImageUrl(quiz.imageUrl || '');
    setFile(null);
    setQuestions(
      quiz.questions.map((q) => ({
        text: q.text,
        options: q.options.map((o) => ({ text: o.text, isCorrect: !!o.isCorrect }))
      }))
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este quiz e todas as tentativas associadas?')) return;
    await deleteQuiz(id);
    if (editingId === id) resetForm();
    load();
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
      let imageUrl = existingImageUrl;
      if (file) {
        imageUrl = await uploadMedia(file);
      }
      const payload = {
        title,
        imageUrl,
        questions: questions.map((q, i) => ({
          text: q.text,
          order: i + 1,
          options: q.options.filter((o) => o.text.trim())
        }))
      };
      if (editingId) {
        await updateQuiz(editingId, payload);
      } else {
        await createQuiz(payload);
      }
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
      <p className="page-subtitle">Cria e edita quizzes com perguntas, opções e imagem de capa.</p>

      <form className="form" onSubmit={handleSubmit} style={{ maxWidth: 640, marginBottom: 32 }}>
        <div className="form-group">
          <label>Título do quiz</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Imagem de capa (opcional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {existingImageUrl && !file && (
            <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              Capa atual: <a href={existingImageUrl} target="_blank" rel="noreferrer">ver</a>
            </p>
          )}
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
                  <button type="button" className="btn danger" onClick={() => removeOption(qIndex, oIndex)} aria-label="Remover opção">
                    <X size={15} strokeWidth={2.4} />
                  </button>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button type="button" className="btn" onClick={() => addOption(qIndex)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Plus size={15} strokeWidth={2.4} /> Opção
              </button>
              {questions.length > 1 && (
                <button type="button" className="btn danger" onClick={() => removeQuestion(qIndex)}>Remover pergunta</button>
              )}
            </div>
          </div>
        ))}

        <button type="button" className="btn" onClick={addQuestion} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Plus size={15} strokeWidth={2.4} /> Adicionar pergunta
        </button>

        {error && <div className="error-text">{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'A guardar...' : editingId ? 'Guardar alterações' : 'Criar quiz'}
          </button>
          {editingId && <button type="button" className="btn" onClick={resetForm} disabled={submitting}>Cancelar</button>}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr><th>Título</th><th>Perguntas</th><th></th></tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q._count?.questions ?? 0}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => handleEdit(q)}>Editar</button>
                <button className="btn danger" onClick={() => handleDelete(q.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
