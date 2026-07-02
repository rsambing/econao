import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { createUserSchema, updateUserSchema } from '../schemas/validation.schemas.js';

const userRouter = Router();
const userController = new UserController();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Criar novo utilizador
 *     tags:
 *       - Utilizadores
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
 *         description: Utilizador criado com sucesso
 */
userRouter.post(
  '/users',
  authenticate,
  authorize('ADMIN'),
  validateRequest(createUserSchema),
  userController.createUser
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obter utilizador por ID
 *     tags:
 *       - Utilizadores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilizador encontrado
 */
userRouter.get('/users/:id', authenticate, authorize('ADMIN'), userController.getUserById);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar todos os utilizadores
 *     tags:
 *       - Utilizadores
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 */
userRouter.get('/users', authenticate, authorize('ADMIN'), userController.getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualizar utilizador
 *     tags:
 *       - Utilizadores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Utilizador atualizado
 */
userRouter.put(
  '/users/:id',
  authenticate,
  authorize('ADMIN'),
  validateRequest(updateUserSchema),
  userController.updateUser
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Eliminar utilizador
 *     tags:
 *       - Utilizadores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Utilizador eliminado
 */
userRouter.delete('/users/:id', authenticate, authorize('ADMIN'), userController.deleteUser);

export default userRouter;