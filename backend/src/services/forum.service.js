import prisma from '../lib/prisma.js';

const AUTHOR_SELECT = { author: { select: { id: true, name: true } } };

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
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async createReply(topicId, authorId, body) {
    return prisma.forumReply.create({
      data: { body, topicId, authorId },
      include: { author: { select: { id: true, name: true } } }
    });
  }
}
