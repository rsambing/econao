import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/validation.schemas.js';

const authRouter = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registar novo utilizador (role USER)
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilizador registado com sucesso
 */
authRouter.post('/auth/register', validateRequest(registerSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar utilizador e obter token JWT
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 */
authRouter.post('/auth/login', validateRequest(loginSchema), authController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Obter utilizador autenticado
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilizador autenticado
 */
authRouter.get('/auth/me', authenticate, authController.me);

export default authRouter;
