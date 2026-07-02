import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

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
}
