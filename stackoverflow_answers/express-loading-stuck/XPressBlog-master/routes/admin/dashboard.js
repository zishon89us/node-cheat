import { Router } from 'express';
import { displayDashboard } from '../../controllers/admin/dashboard.js';

const router = Router();

router.get('/', displayDashboard);

export default router;
