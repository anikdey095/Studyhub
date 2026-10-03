import express from 'express';
import adminController from './admin.controller.js';
import { requireAdmin } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/overview', adminController.getOverview);

// Careers: Jobs, Tuition, Internships
router.get('/careers', adminController.getCareers);
router.post('/careers', adminController.createCareer);
router.delete('/careers/:id', adminController.deleteCareer);

// Research Papers
router.get('/research', adminController.getResearch);
router.post('/research', adminController.createResearch);
router.delete('/research/:id', requireAdmin, adminController.deleteResearch);

export default router;
