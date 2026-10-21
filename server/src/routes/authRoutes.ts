import { Router } from 'express';
import { verifyGoogleAuth, getAuthConfig } from '../controllers/authController';

const router = Router();

router.get('/config', getAuthConfig);
router.post('/google', verifyGoogleAuth);

export default router;
