import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const profileController = new ProfileController();

// GET /api/profile - Dados do perfil
router.get('/', authMiddleware, (req, res) => profileController.getProfile(req, res));

// PUT /api/profile - Atualizar nome
router.put('/', authMiddleware, (req, res) => profileController.updateName(req, res));

// PUT /api/profile/password - Alterar senha
router.put('/password', authMiddleware, (req, res) => profileController.changePassword(req, res));

export default router;
