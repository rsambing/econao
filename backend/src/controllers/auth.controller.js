import { AuthService } from '../services/auth.service.js';
import { UserService } from '../services/user.service.js';

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async me(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateMe(req, res) {
    try {
      const user = await userService.updateUser(req.user.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      await authService.forgotPassword(req.body.email);
      // Resposta genérica — não revela se o email existe.
      res.status(200).json({ message: 'Se o email existir, foi enviado um link de recuperação.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
