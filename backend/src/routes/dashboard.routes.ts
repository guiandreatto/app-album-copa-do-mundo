import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

// GET /api/dashboard - Estatísticas do álbum
router.get('/', authMiddleware, (req, res) => dashboardController.getStats(req, res));

export default router;
