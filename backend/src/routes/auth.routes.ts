import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register - Cadastro de usuário
router.post('/register', (req, res) => authController.register(req, res));

// POST /api/auth/login - Login
router.post('/login', (req, res) => authController.login(req, res));

// PUT /api/auth/reset-password - Recuperação de senha
router.put('/reset-password', (req, res) => authController.resetPassword(req, res));

export default router;
