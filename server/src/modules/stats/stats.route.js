import express from 'express';
import statsController from './stats.controller.js';

const router = express.Router();

router.get('/', statsController.getDashboardStats);

export default router;
