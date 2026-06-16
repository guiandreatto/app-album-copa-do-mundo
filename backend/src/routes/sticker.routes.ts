import { Router } from 'express';
import { StickerController } from '../controllers/sticker.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const stickerController = new StickerController();

// GET /api/stickers - Listar todas as figurinhas
router.get('/', authMiddleware, (req, res) => stickerController.getAll(req, res));

// GET /api/stickers/search - Buscar figurinhas
router.get('/search', authMiddleware, (req, res) => stickerController.search(req, res));

// GET /api/stickers/countries - Listar países
router.get('/countries', authMiddleware, (req, res) => stickerController.getCountries(req, res));

export default router;
