import prisma from '../lib/prisma.js';

export class CommentService {
  async createComment(contentId, authorId, body) {
    return prisma.comment.create({
      data: { body, contentId, authorId },
      include: { author: { select: { id: true, name: true } } }
    });
  }

  async getCommentsByContent(contentId) {
    return prisma.comment.findMany({
      where: { contentId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' }
    });
  }
}
