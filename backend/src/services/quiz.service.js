import prisma from '../lib/prisma.js';

const PUBLIC_QUESTIONS_INCLUDE = {
  questions: {
    orderBy: { order: 'asc' },
    include: { options: { select: { id: true, text: true } } }
  }
};

export class QuizService {
  async createQuiz(data) {
    return prisma.quiz.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl || null,
        questions: {
          create: data.questions.map((q) => ({
            text: q.text,
            order: q.order ?? 0,
            options: { create: q.options.map((o) => ({ text: o.text, isCorrect: !!o.isCorrect })) }
          }))
        }
      },
      include: {
        questions: { include: { options: true } }
      }
    });
  }

  async getAllQuizzes() {
    return prisma.quiz.findMany({
      select: { id: true, title: true, imageUrl: true, createdAt: true, _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getQuizById(id, includeAnswers = false) {
    return prisma.quiz.findUnique({
      where: { id },
      include: includeAnswers
        ? { questions: { orderBy: { order: 'asc' }, include: { options: true } } }
        : PUBLIC_QUESTIONS_INCLUDE
    });
  }

  /**
   * Substitui por completo as perguntas/opções do quiz (mais simples e
   * seguro do que tentar reconciliar diffs). O QuizAttempt só referencia
   * quizId, não questionId/optionId, por isso isto não parte tentativas
   * já submetidas.
   */
  async updateQuiz(id, data) {
    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) {
      const err = new Error('Quiz não encontrado');
      err.status = 404;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      if (data.questions) {
        await tx.question.deleteMany({ where: { quizId: id } });
      }

      return tx.quiz.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
          ...(data.questions && {
            questions: {
              create: data.questions.map((q) => ({
                text: q.text,
                order: q.order ?? 0,
                options: { create: q.options.map((o) => ({ text: o.text, isCorrect: !!o.isCorrect })) }
              }))
            }
          })
        },
        include: { questions: { include: { options: true } } }
      });
      // Timeout alargado: a NeonDB pode estar suspensa (cold start) e demorar
      // mais do que os 5s por omissão do Prisma para a transacção terminar.
    }, { timeout: 15_000, maxWait: 10_000 });
  }

  async deleteQuiz(id) {
    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) {
      const err = new Error('Quiz não encontrado');
      err.status = 404;
      throw err;
    }
    return prisma.quiz.delete({ where: { id } });
  }

  async submitAttempt(quizId, userId, answers) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } }
    });

    if (!quiz) {
      throw new Error('Quiz não encontrado');
    }

    let score = 0;
    const feedback = quiz.questions.map((question) => {
      const answer = answers.find((a) => a.questionId === question.id);
      const correctOption = question.options.find((o) => o.isCorrect);
      const isCorrect = !!answer && answer.optionId === correctOption?.id;
      if (isCorrect) score += 1;

      return {
        questionId: question.id,
        correctOptionId: correctOption?.id ?? null,
        chosenOptionId: answer?.optionId ?? null,
        isCorrect
      };
    });

    const attempt = await prisma.quizAttempt.create({
      data: { userId, quizId, score }
    });

    const attempts = await prisma.quizAttempt.count({ where: { userId, quizId } });

    return { attempt, score, total: quiz.questions.length, feedback, attempts };
  }

  async getRanking(quizId) {
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' }
    });

    // Agrupa por utilizador: cada pessoa aparece uma única vez no ranking.
    const byUser = new Map();
    for (const a of attempts) {
      if (!a.user) continue;
      let entry = byUser.get(a.user.id);
      if (!entry) {
        entry = {
          userId: a.user.id,
          name: a.user.name,
          avatarUrl: a.user.avatarUrl,
          bestScore: a.score,
          attempts: 0
        };
        byUser.set(a.user.id, entry);
      }
      entry.attempts += 1;
      if (a.score > entry.bestScore) entry.bestScore = a.score;
    }

    // Pontuação final: melhor pontuação menos 1 ponto por cada repetição
    // (quem acerta tudo à primeira fica em vantagem). Nunca abaixo de 0.
    const rows = [...byUser.values()].map((e) => ({
      ...e,
      points: Math.max(e.bestScore - (e.attempts - 1), 0)
    }));

    rows.sort((a, b) => b.points - a.points || b.bestScore - a.bestScore || a.attempts - b.attempts);

    return rows.slice(0, 10);
  }
}
