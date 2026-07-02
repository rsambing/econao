import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { presignUploadSchema } from '../schemas/validation.schemas.js';

const uploadRouter = Router();
const uploadController = new UploadController();

/**
 * @openapi
 * /uploads/presign:
 *   post:
 *     summary: Gerar URL presigned para upload direto ao R2 (ADMIN)
 *     tags: [Uploads]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               contentType:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL de upload e URL público final
 */
uploadRouter.post(
  '/uploads/presign',
  authenticate,
  authorize('ADMIN'),
  validateRequest(presignUploadSchema),
  uploadController.presign
);

export default uploadRouter;
