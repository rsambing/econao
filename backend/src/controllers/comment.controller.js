import { CommentService } from '../services/comment.service.js';

const commentService = new CommentService();

export class CommentController {
  async createComment(req, res) {
    try {
      const contentId = Number(req.params.id);
      if (isNaN(contentId)) return res.status(400).json({ error: 'ID inválido' });

      const comment = await commentService.createComment(contentId, req.user.id, req.body.body);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getComments(req, res) {
    try {
      const contentId = Number(req.params.id);
      if (isNaN(contentId)) return res.status(400).json({ error: 'ID inválido' });

      const comments = await commentService.getCommentsByContent(contentId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateComment(req, res) {
    try {
      const id = Number(req.params.commentId);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const comment = await commentService.updateComment(id, req.user, req.body.body);
      res.status(200).json(comment);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      const id = Number(req.params.commentId);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      await commentService.deleteComment(id, req.user);
      res.status(204).send();
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }
}
