import { Router } from 'express';
import { ContentController } from '../controllers/content.controller.js';
import { CommentController } from '../controllers/comment.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { createContentSchema, updateContentSchema, createCommentSchema } from '../schemas/validation.schemas.js';

const contentRouter = Router();
const contentController = new ContentController();
const commentController = new CommentController();

/**
 * @openapi
 * /content:
 *   get:
 *     summary: Listar conteúdos (vídeo, texto, podcast)
 *     tags: [Conteúdos]
 *     responses:
 *       200:
 *         description: Lista de conteúdos
 */
contentRouter.get('/content', contentController.getAllContent);

/**
 * @openapi
 * /content/{id}:
 *   get:
 *     summary: Obter conteúdo por ID (com comentários)
 *     tags: [Conteúdos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Conteúdo encontrado }
 */
contentRouter.get('/content/:id', contentController.getContentById);

/**
 * @openapi
 * /content:
 *   post:
 *     summary: Criar conteúdo (ADMIN)
 *     tags: [Conteúdos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Conteúdo criado }
 */
contentRouter.post(
  '/content',
  authenticate,
  authorize('ADMIN'),
  validateRequest(createContentSchema),
  contentController.createContent
);

/**
 * @openapi
 * /content/{id}:
 *   put:
 *     summary: Atualizar conteúdo (ADMIN)
 *     tags: [Conteúdos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Conteúdo atualizado }
 */
contentRouter.put(
  '/content/:id',
  authenticate,
  authorize('ADMIN'),
  validateRequest(updateContentSchema),
  contentController.updateContent
);

/**
 * @openapi
 * /content/{id}:
 *   delete:
 *     summary: Eliminar conteúdo (ADMIN)
 *     tags: [Conteúdos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Conteúdo eliminado }
 */
contentRouter.delete('/content/:id', authenticate, authorize('ADMIN'), contentController.deleteContent);

/**
 * @openapi
 * /content/{id}/comments:
 *   get:
 *     summary: Listar comentários de um conteúdo
 *     tags: [Comentários]
 *     responses:
 *       200: { description: Lista de comentários }
 */
contentRouter.get('/content/:id/comments', commentController.getComments);

/**
 * @openapi
 * /content/{id}/comments:
 *   post:
 *     summary: Comentar um conteúdo (autenticado)
 *     tags: [Comentários]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Comentário criado }
 */
contentRouter.post(
  '/content/:id/comments',
  authenticate,
  validateRequest(createCommentSchema),
  commentController.createComment
);

export default contentRouter;
