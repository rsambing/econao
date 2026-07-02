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

  async getQuizById(id) {
    return prisma.quiz.findUnique({
      where: { id },
      include: PUBLIC_QUESTIONS_INCLUDE
    });
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

    return { attempt, score, total: quiz.questions.length, feedback };
  }

  async getRanking(quizId) {
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
      take: 10
    });

    return attempts.map((a) => ({
      userId: a.user.id,
      name: a.user.name,
      score: a.score,
      createdAt: a.createdAt
    }));
  }
}
