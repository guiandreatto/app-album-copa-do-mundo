import { Router } from 'express';
import { UserStickerController } from '../controllers/user-sticker.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userStickerController = new UserStickerController();

// GET /api/user-stickers - Listar figurinhas do usuário
router.get('/', authMiddleware, (req, res) => userStickerController.getUserStickers(req, res));

// GET /api/user-stickers/repeated - Listar figurinhas repetidas
router.get('/repeated', authMiddleware, (req, res) => userStickerController.getRepeated(req, res));

// PUT /api/user-stickers/:stickerId - Atualizar quantidade
router.put('/:stickerId', authMiddleware, (req, res) => userStickerController.updateQuantity(req, res));

export default router;
