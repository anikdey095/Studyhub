import express from 'express';
import authController from './auth.controller.js';

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router;