import express from 'express';
import noteController from './note.controller.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', noteController.getNotes);
router.post('/', noteController.createNote);
router.post('/upload', upload.single('file'), noteController.uploadFile);

export default router;
