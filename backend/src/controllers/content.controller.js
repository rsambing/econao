import { ContentService } from '../services/content.service.js';

const contentService = new ContentService();

export class ContentController {
  async createContent(req, res) {
    try {
      const content = await contentService.createContent(req.body, req.user.id);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllContent(req, res) {
    try {
      const { type, theme } = req.query;
      const content = await contentService.getAllContent({ type, theme }, !!req.user);
      res.status(200).json(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getContentById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const content = await contentService.getContentById(id, !!req.user);
      if (!content) return res.status(404).json({ error: 'Conteúdo não encontrado' });

      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateContent(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const content = await contentService.updateContent(id, req.body);
      res.status(200).json(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteContent(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      await contentService.deleteContent(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
