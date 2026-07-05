import prisma from '../lib/prisma.js';

const AUTHOR_SELECT = { author: { select: { id: true, name: true, avatarUrl: true } } };
const MEDIA_INCLUDE = { media: { orderBy: { order: 'asc' } } };

/** Converte a lista de media do pedido em registos ordenados. */
function toMediaCreate(media) {
  return media.map((m, i) => ({ url: m.url, type: m.type || 'IMAGE', order: i }));
}

export class ContentService {
  async createContent(data, authorId) {
    const { media, ...rest } = data;
    return prisma.content.create({
      data: {
        ...rest,
        authorId,
        ...(media?.length ? { media: { create: toMediaCreate(media) } } : {})
      },
      include: { ...AUTHOR_SELECT, ...MEDIA_INCLUDE }
    });
  }

  async getAllContent({ type, theme } = {}) {
    return prisma.content.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(theme ? { theme } : {})
      },
      include: { ...AUTHOR_SELECT, ...MEDIA_INCLUDE },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getContentById(id) {
    return prisma.content.findUnique({
      where: { id },
      include: {
        ...AUTHOR_SELECT,
        ...MEDIA_INCLUDE,
        comments: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async updateContent(id, data) {
    // String vazia significa "remover o ficheiro" — guarda NULL na base de dados.
    const { media, ...rest } = data;
    const normalized = { ...rest };
    if (normalized.imageUrl === '') normalized.imageUrl = null;
    if (normalized.mediaUrl === '') normalized.mediaUrl = null;

    return prisma.content.update({
      where: { id },
      data: {
        ...normalized,
        // Quando o pedido traz `media`, a lista enviada substitui a galeria inteira.
        ...(media !== undefined
          ? { media: { deleteMany: {}, create: toMediaCreate(media) } }
          : {})
      },
      include: { ...AUTHOR_SELECT, ...MEDIA_INCLUDE }
    });
  }

  async deleteContent(id) {
    return prisma.content.delete({ where: { id } });
  }
}
