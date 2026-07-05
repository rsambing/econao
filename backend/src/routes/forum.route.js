import { Router } from 'express';
import { ForumController } from '../controllers/forum.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { createForumTopicSchema, updateForumTopicSchema, createForumReplySchema } from '../schemas/validation.schemas.js';

const forumRouter = Router();
const forumController = new ForumController();

/**
 * @openapi
 * /forum/topics:
 *   get:
 *     summary: Listar tópicos do fórum
 *     tags: [Fórum]
 *     responses:
 *       200: { description: Lista de tópicos }
 */
forumRouter.get('/forum/topics', forumController.getAllTopics);

/**
 * @openapi
 * /forum/topics/{id}:
 *   get:
 *     summary: Obter tópico com respostas
 *     tags: [Fórum]
 *     responses:
 *       200: { description: Tópico encontrado }
 */
forumRouter.get('/forum/topics/:id', forumController.getTopicById);

/**
 * @openapi
 * /forum/topics:
 *   post:
 *     summary: Criar tópico (autenticado)
 *     tags: [Fórum]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Tópico criado }
 */
forumRouter.post(
  '/forum/topics',
  authenticate,
  validateRequest(createForumTopicSchema),
  forumController.createTopic
);

/**
 * @openapi
 * /forum/topics/{id}/replies:
 *   post:
 *     summary: Responder a um tópico (autenticado)
 *     tags: [Fórum]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Resposta criada }
 */
forumRouter.post(
  '/forum/topics/:id/replies',
  authenticate,
  validateRequest(createForumReplySchema),
  forumController.createReply
);

/**
 * @openapi
 * /forum/topics/{id}:
 *   put:
 *     summary: Editar tópico por completo (autor ou ADMIN)
 *     tags: [Fórum]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Tópico atualizado }
 */
forumRouter.put(
  '/forum/topics/:id',
  authenticate,
  validateRequest(updateForumTopicSchema),
  forumController.updateTopic
);

/**
 * @openapi
 * /forum/topics/{id}:
 *   delete:
 *     summary: Eliminar tópico (autor ou ADMIN)
 *     tags: [Fórum]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Tópico eliminado }
 */
forumRouter.delete('/forum/topics/:id', authenticate, forumController.deleteTopic);

/**
 * @openapi
 * /forum/replies/{replyId}:
 *   put:
 *     summary: Editar resposta (autor ou ADMIN)
 *     tags: [Fórum]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Resposta atualizada }
 */
forumRouter.put(
  '/forum/replies/:replyId',
  authenticate,
  validateRequest(createForumReplySchema),
  forumController.updateReply
);

/**
 * @openapi
 * /forum/replies/{replyId}:
 *   delete:
 *     summary: Eliminar resposta (autor ou ADMIN)
 *     tags: [Fórum]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Resposta eliminada }
 */
forumRouter.delete('/forum/replies/:replyId', authenticate, forumController.deleteReply);

export default forumRouter;
