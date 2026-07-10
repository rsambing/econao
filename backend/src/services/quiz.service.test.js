import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do cliente Prisma partilhado — os testes de QuizService não devem
// tocar na base de dados real, só verificar a lógica de negócio à volta
// dos dados que o Prisma devolveria.
vi.mock('../lib/prisma.js', () => ({
  default: {
    quiz: { findUnique: vi.fn() },
    quizAttempt: { create: vi.fn(), count: vi.fn(), findMany: vi.fn() }
  }
}));

import prisma from '../lib/prisma.js';
import { QuizService } from './quiz.service.js';

const quizService = new QuizService();

describe('QuizService.submitAttempt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calcula a pontuação comparando as respostas com as opções corretas', async () => {
    prisma.quiz.findUnique.mockResolvedValue({
      id: 1,
      questions: [
        { id: 10, options: [{ id: 100, isCorrect: true }, { id: 101, isCorrect: false }] },
        { id: 11, options: [{ id: 110, isCorrect: false }, { id: 111, isCorrect: true }] }
      ]
    });
    prisma.quizAttempt.create.mockResolvedValue({ id: 1, score: 1 });
    prisma.quizAttempt.count.mockResolvedValue(1);

    const resultado = await quizService.submitAttempt(1, 1, [
      { questionId: 10, optionId: 100 }, // correta
      { questionId: 11, optionId: 110 } // errada
    ]);

    expect(resultado.score).toBe(1);
    expect(resultado.total).toBe(2);
    expect(resultado.feedback).toEqual([
      { questionId: 10, correctOptionId: 100, chosenOptionId: 100, isCorrect: true },
      { questionId: 11, correctOptionId: 111, chosenOptionId: 110, isCorrect: false }
    ]);
  });

  it('lança erro quando o quiz não existe', async () => {
    prisma.quiz.findUnique.mockResolvedValue(null);

    await expect(quizService.submitAttempt(999, 1, [])).rejects.toThrow('Quiz não encontrado');
  });

  it('nunca confia no cliente: a resposta correta nunca é assumida do pedido', async () => {
    prisma.quiz.findUnique.mockResolvedValue({
      id: 1,
      questions: [{ id: 10, options: [{ id: 100, isCorrect: true }, { id: 101, isCorrect: false }] }]
    });
    prisma.quizAttempt.create.mockResolvedValue({ id: 1, score: 0 });
    prisma.quizAttempt.count.mockResolvedValue(1);

    // Tenta submeter a opção errada marcada como se fosse a "escolhida correta".
    const resultado = await quizService.submitAttempt(1, 1, [{ questionId: 10, optionId: 101 }]);

    expect(resultado.score).toBe(0);
    expect(resultado.feedback[0].isCorrect).toBe(false);
  });
});

describe('QuizService.getRanking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não duplica utilizadores que jogaram mais do que uma vez', async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      { score: 1, user: { id: 2, name: 'Reinaldo', avatarUrl: null } },
      { score: 1, user: { id: 2, name: 'Reinaldo', avatarUrl: null } }
    ]);

    const ranking = await quizService.getRanking(1);

    expect(ranking).toHaveLength(1);
    expect(ranking[0].attempts).toBe(2);
  });

  it('penaliza 1 ponto por cada repetição, premiando quem acerta tudo à primeira', async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      // Carlos: acertou tudo (2) à primeira tentativa.
      { score: 2, user: { id: 1, name: 'Carlos', avatarUrl: null } },
      // Reinaldo: só acertou 1, mas jogou duas vezes (penalização de 1 ponto).
      { score: 1, user: { id: 2, name: 'Reinaldo', avatarUrl: null } },
      { score: 1, user: { id: 2, name: 'Reinaldo', avatarUrl: null } }
    ]);

    const ranking = await quizService.getRanking(1);
    const carlos = ranking.find((r) => r.userId === 1);
    const reinaldo = ranking.find((r) => r.userId === 2);

    expect(carlos.points).toBe(2);
    expect(reinaldo.bestScore).toBe(1);
    expect(reinaldo.attempts).toBe(2);
    expect(reinaldo.points).toBe(0); // 1 - (2 - 1) = 0
    expect(ranking[0].userId).toBe(1); // Carlos fica à frente
  });

  it('nunca deixa a pontuação final ficar abaixo de 0', async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      { score: 0, user: { id: 1, name: 'Ana', avatarUrl: null } },
      { score: 0, user: { id: 1, name: 'Ana', avatarUrl: null } },
      { score: 0, user: { id: 1, name: 'Ana', avatarUrl: null } }
    ]);

    const ranking = await quizService.getRanking(1);

    expect(ranking[0].points).toBe(0);
  });

  it('guarda a melhor pontuação entre várias tentativas do mesmo utilizador', async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      { score: 0, user: { id: 1, name: 'Ana', avatarUrl: null } },
      { score: 2, user: { id: 1, name: 'Ana', avatarUrl: null } },
      { score: 1, user: { id: 1, name: 'Ana', avatarUrl: null } }
    ]);

    const ranking = await quizService.getRanking(1);

    expect(ranking[0].bestScore).toBe(2);
  });

  it('devolve no máximo os 10 melhores', async () => {
    const attempts = Array.from({ length: 15 }, (_, i) => ({
      score: i,
      user: { id: i, name: `Utilizador ${i}`, avatarUrl: null }
    }));
    prisma.quizAttempt.findMany.mockResolvedValue(attempts);

    const ranking = await quizService.getRanking(1);

    expect(ranking).toHaveLength(10);
  });
});
