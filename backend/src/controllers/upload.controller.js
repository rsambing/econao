import { UploadService } from '../services/upload.service.js';

const uploadService = new UploadService();

export class UploadController {
  async presign(req, res) {
    try {
      const { filename, contentType } = req.body;
      const result = await uploadService.createPresignedUpload(filename, contentType);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
