import prisma from '../lib/prisma.js';

const AUTHOR_SELECT = { author: { select: { id: true, name: true, avatarUrl: true } } };

export class ContentService {
  async createContent(data, authorId) {
    return prisma.content.create({
      data: { ...data, authorId },
      include: AUTHOR_SELECT
    });
  }

  async getAllContent({ type, theme } = {}) {
    return prisma.content.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(theme ? { theme } : {})
      },
      include: AUTHOR_SELECT,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getContentById(id) {
    return prisma.content.findUnique({
      where: { id },
      include: {
        ...AUTHOR_SELECT,
        comments: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async updateContent(id, data) {
    // String vazia significa "remover o ficheiro" — guarda NULL na base de dados.
    const normalized = { ...data };
    if (normalized.imageUrl === '') normalized.imageUrl = null;
    if (normalized.mediaUrl === '') normalized.mediaUrl = null;
    return prisma.content.update({ where: { id }, data: normalized, include: AUTHOR_SELECT });
  }

  async deleteContent(id) {
    return prisma.content.delete({ where: { id } });
  }
}
