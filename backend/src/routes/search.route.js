import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { optionalAuthenticate } from '../middlewares/optional-authenticate.middleware.js';

const searchRouter = Router();
const searchController = new SearchController();

/**
 * @openapi
 * /search:
 *   get:
 *     summary: Pesquisa global (conteúdos, quizzes e fórum)
 *     tags: [Pesquisa]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Resultados agrupados por tipo
 */
searchRouter.get('/search', optionalAuthenticate, searchController.search);

export default searchRouter;
