import { Router } from 'express';
import { submitSurvey, getSubmissions } from '../controllers/surveyController';

const router = Router();

router.post('/submit', submitSurvey);
router.get('/list', getSubmissions);

export default router;
