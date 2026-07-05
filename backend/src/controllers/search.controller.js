import { SearchService } from '../services/search.service.js';

const searchService = new SearchService();

export class SearchController {
  async search(req, res) {
    try {
      const results = await searchService.searchAll(req.query.q, !!req.user);
      res.status(200).json(results);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
