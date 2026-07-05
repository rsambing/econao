import prisma from '../lib/prisma.js';

const AUTHOR_INCLUDE = { author: { select: { id: true, name: true, avatarUrl: true } } };

export class CommentService {
  async createComment(contentId, authorId, body) {
    return prisma.comment.create({
      data: { body, contentId, authorId },
      include: AUTHOR_INCLUDE
    });
  }

  async getCommentsByContent(contentId) {
    return prisma.comment.findMany({
      where: { contentId },
      include: AUTHOR_INCLUDE,
      orderBy: { createdAt: 'asc' }
    });
  }

  /** Atualiza um comentário. Apenas o autor ou um ADMIN podem editar. */
  async updateComment(id, user, body) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new Error('Comentário não encontrado');
    if (comment.authorId !== user.id && user.role !== 'ADMIN') {
      const err = new Error('Sem permissão para editar este comentário');
      err.status = 403;
      throw err;
    }
    return prisma.comment.update({
      where: { id },
      data: { body },
      include: AUTHOR_INCLUDE
    });
  }

  /** Elimina um comentário. Apenas o autor ou um ADMIN podem eliminar. */
  async deleteComment(id, user) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new Error('Comentário não encontrado');
    if (comment.authorId !== user.id && user.role !== 'ADMIN') {
      const err = new Error('Sem permissão para eliminar este comentário');
      err.status = 403;
      throw err;
    }
    return prisma.comment.delete({ where: { id } });
  }
}
