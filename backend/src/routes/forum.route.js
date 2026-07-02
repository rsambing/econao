import { Router } from 'express';
import { ForumController } from '../controllers/forum.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { createForumTopicSchema, createForumReplySchema } from '../schemas/validation.schemas.js';

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

export default forumRouter;
