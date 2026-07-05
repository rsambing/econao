import prisma from '../lib/prisma.js';

const AUTHOR_SELECT = { author: { select: { id: true, name: true, avatarUrl: true } } };

export class ForumService {
  async createTopic(data, authorId) {
    return prisma.forumTopic.create({
      data: { ...data, authorId },
      include: AUTHOR_SELECT
    });
  }

  async getAllTopics() {
    return prisma.forumTopic.findMany({
      include: { ...AUTHOR_SELECT, _count: { select: { replies: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTopicById(id) {
    return prisma.forumTopic.findUnique({
      where: { id },
      include: {
        ...AUTHOR_SELECT,
        replies: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async createReply(topicId, authorId, body) {
    return prisma.forumReply.create({
      data: { body, topicId, authorId },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } }
    });
  }

  /** Atualiza um tópico por completo. Apenas o autor ou um ADMIN. */
  async updateTopic(id, user, data) {
    const topic = await prisma.forumTopic.findUnique({ where: { id } });
    if (!topic) throw new Error('Tópico não encontrado');
    if (topic.authorId !== user.id && user.role !== 'ADMIN') {
      const err = new Error('Sem permissão para editar este tópico');
      err.status = 403;
      throw err;
    }
    return prisma.forumTopic.update({
      where: { id },
      data,
      include: AUTHOR_SELECT
    });
  }

  /** Elimina um tópico (e respostas em cascata). Apenas o autor ou um ADMIN. */
  async deleteTopic(id, user) {
    const topic = await prisma.forumTopic.findUnique({ where: { id } });
    if (!topic) throw new Error('Tópico não encontrado');
    if (topic.authorId !== user.id && user.role !== 'ADMIN') {
      const err = new Error('Sem permissão para eliminar este tópico');
      err.status = 403;
      throw err;
    }
    return prisma.forumTopic.delete({ where: { id } });
  }

  /** Atualiza uma resposta. Apenas o autor ou um ADMIN. */
  async updateReply(id, user, body) {
    const reply = await prisma.forumReply.findUnique({ where: { id } });
    if (!reply) throw new Error('Resposta não encontrada');
    if (reply.authorId !== user.id && user.role !== 'ADMIN') {
      const err = new Error('Sem permissão para editar esta resposta');
      err.status = 403;
      throw err;
    }
    return prisma.forumReply.update({
      where: { id },
      data: { body },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } }
    });
  }

  /** Elimina uma resposta. Apenas o autor ou um ADMIN. */
  async deleteReply(id, user) {
    const reply = await prisma.forumReply.findUnique({ where: { id } });
    if (!reply) throw new Error('Resposta não encontrada');
    if (reply.authorId !== user.id && user.role !== 'ADMIN') {
      const err = new Error('Sem permissão para eliminar esta resposta');
      err.status = 403;
      throw err;
    }
    return prisma.forumReply.delete({ where: { id } });
  }
}
