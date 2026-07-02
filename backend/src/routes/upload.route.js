import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import upload from '../middlewares/upload-multer.js';

const uploadRouter = Router();
const uploadController = new UploadController();

/**
 * @openapi
 * /uploads:
 *   post:
 *     summary: Enviar um ficheiro (imagem/vídeo/áudio) — o servidor envia-o ao R2
 *     tags: [Uploads]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: URL público do ficheiro guardado no R2
 */
uploadRouter.post('/uploads', authenticate, upload.single('file'), uploadController.upload);

export default uploadRouter;
