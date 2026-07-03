import prisma from '../lib/prisma.js';

const AUTHOR_SELECT = { author: { select: { id: true, name: true, avatarUrl: true } } };

export class SearchService {
  /**
   * Pesquisa global em conteúdos, quizzes e tópicos do fórum.
   * A pesquisa é case-insensitive e cobre os campos textuais mais relevantes.
   */
  async searchAll(term) {
    const q = (term || '').trim();
    if (!q) {
      return { query: '', content: [], quizzes: [], topics: [] };
    }

    const contains = { contains: q, mode: 'insensitive' };

    const [content, quizzes, topics] = await Promise.all([
      prisma.content.findMany({
        where: {
          OR: [
            { title: contains },
            { body: contains },
            { theme: contains },
            { region: contains }
          ]
        },
        include: AUTHOR_SELECT,
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.quiz.findMany({
        where: { title: contains },
        select: { id: true, title: true, imageUrl: true, _count: { select: { questions: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.forumTopic.findMany({
        where: {
          OR: [
            { title: contains },
            { description: contains },
            { theme: contains }
          ]
        },
        include: { ...AUTHOR_SELECT, _count: { select: { replies: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    return { query: q, content, quizzes, topics };
  }
}
