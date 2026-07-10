import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { optionalAuthenticate } from '../middlewares/optional-authenticate.middleware.js';
import { createQuizSchema, updateQuizSchema, submitQuizAttemptSchema } from '../schemas/validation.schemas.js';

const quizRouter = Router();
const quizController = new QuizController();

/**
 * @openapi
 * /quizzes:
 *   get:
 *     summary: Listar quizzes
 *     tags: [Quiz]
 *     responses:
 *       200: { description: Lista de quizzes }
 */
quizRouter.get('/quizzes', quizController.getAllQuizzes);

/**
 * @openapi
 * /quizzes/{id}:
 *   get:
 *     summary: Obter quiz com perguntas e opções (sem revelar a resposta certa)
 *     tags: [Quiz]
 *     responses:
 *       200: { description: Quiz encontrado }
 */
quizRouter.get('/quizzes/:id', optionalAuthenticate, quizController.getQuizById);

/**
 * @openapi
 * /quizzes:
 *   post:
 *     summary: Criar quiz com perguntas e opções (ADMIN)
 *     tags: [Quiz]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Quiz criado }
 */
quizRouter.post(
  '/quizzes',
  authenticate,
  authorize('ADMIN'),
  validateRequest(createQuizSchema),
  quizController.createQuiz
);

/**
 * @openapi
 * /quizzes/{id}:
 *   put:
 *     summary: Editar quiz por completo — título, capa e perguntas (ADMIN)
 *     tags: [Quiz]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Quiz atualizado }
 */
quizRouter.put(
  '/quizzes/:id',
  authenticate,
  authorize('ADMIN'),
  validateRequest(updateQuizSchema),
  quizController.updateQuiz
);

/**
 * @openapi
 * /quizzes/{id}:
 *   delete:
 *     summary: Eliminar quiz (ADMIN)
 *     tags: [Quiz]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Quiz eliminado }
 */
quizRouter.delete('/quizzes/:id', authenticate, authorize('ADMIN'), quizController.deleteQuiz);

/**
 * @openapi
 * /quizzes/{id}/attempts:
 *   post:
 *     summary: Submeter respostas de um quiz (autenticado)
 *     tags: [Quiz]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Resultado da tentativa }
 */
quizRouter.post(
  '/quizzes/:id/attempts',
  authenticate,
  validateRequest(submitQuizAttemptSchema),
  quizController.submitAttempt
);

/**
 * @openapi
 * /quizzes/{id}/ranking:
 *   get:
 *     summary: Obter ranking de um quiz (top 10)
 *     tags: [Quiz]
 *     responses:
 *       200: { description: Ranking }
 */
quizRouter.get('/quizzes/:id/ranking', quizController.getRanking);

export default quizRouter;
