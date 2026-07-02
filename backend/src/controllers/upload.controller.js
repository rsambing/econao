import { UploadService } from '../services/upload.service.js';

const uploadService = new UploadService();

export class UploadController {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum ficheiro enviado' });
      }

      const { publicUrl } = await uploadService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.status(200).json({ publicUrl, url: publicUrl });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
