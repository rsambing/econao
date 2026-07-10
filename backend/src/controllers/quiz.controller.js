import { QuizService } from '../services/quiz.service.js';

const quizService = new QuizService();

export class QuizController {
  async createQuiz(req, res) {
    try {
      const quiz = await quizService.createQuiz(req.body);
      res.status(201).json(quiz);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllQuizzes(req, res) {
    try {
      const quizzes = await quizService.getAllQuizzes();
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getQuizById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const includeAnswers = req.user?.role === 'ADMIN';
      const quiz = await quizService.getQuizById(id, includeAnswers);
      if (!quiz) return res.status(404).json({ error: 'Quiz não encontrado' });

      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateQuiz(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      const quiz = await quizService.updateQuiz(id, req.body);
      res.status(200).json(quiz);
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  async deleteQuiz(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

      await quizService.deleteQuiz(id);
      res.status(204).send();
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  async submitAttempt(req, res) {
    try {
      const quizId = Number(req.params.id);
      if (isNaN(quizId)) return res.status(400).json({ error: 'ID inválido' });

      const result = await quizService.submitAttempt(quizId, req.user.id, req.body.answers);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getRanking(req, res) {
    try {
      const quizId = Number(req.params.id);
      if (isNaN(quizId)) return res.status(400).json({ error: 'ID inválido' });

      const ranking = await quizService.getRanking(quizId);
      res.status(200).json(ranking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
