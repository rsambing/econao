import { ForumService } from '../services/forum.service.js';

const forumService = new ForumService();

export class ForumController {
  async createTopic(req, res) {
    try {
      const topic = await forumService.createTopic(req.body, req.user.id);
      res.status(201).json(topic);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllTopics(req, res) {
    try {
      const topics = await forumService.getAllTopics();
      res.status(200).json(topics);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTopicById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const topic = await forumService.getTopicById(id);
      if (!topic) return res.status(404).json({ error: 'Tópico não encontrado' });

      res.status(200).json(topic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createReply(req, res) {
    try {
      const topicId = Number(req.params.id);
      if (isNaN(topicId)) return res.status(400).json({ error: 'ID inválido' });

      const reply = await forumService.createReply(topicId, req.user.id, req.body.body);
      res.status(201).json(reply);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTopic(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const topic = await forumService.updateTopic(id, req.user, req.body);
      res.status(200).json(topic);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  async deleteTopic(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      await forumService.deleteTopic(id, req.user);
      res.status(204).send();
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  async updateReply(req, res) {
    try {
      const id = Number(req.params.replyId);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const reply = await forumService.updateReply(id, req.user, req.body.body);
      res.status(200).json(reply);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  async deleteReply(req, res) {
    try {
      const id = Number(req.params.replyId);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      await forumService.deleteReply(id, req.user);
      res.status(204).send();
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }
}
