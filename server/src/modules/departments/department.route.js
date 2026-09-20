import express from 'express';
import departmentController from './department.controller.js';
import { requireAdmin } from '../../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/departments - list all departments and their courses (Public)
router.get('/', (req, res) => departmentController.getDepartments(req, res));

// POST /api/departments - ONLY ADMIN can add a new department
router.post('/', requireAdmin, (req, res) => departmentController.createDepartment(req, res));

// DELETE /api/departments/:id - ONLY ADMIN can delete a department
router.delete('/:id', requireAdmin, (req, res) => departmentController.deleteDepartment(req, res));

// POST /api/departments/courses - Any registered user or note contributor can create a new course under any department
router.post('/courses', (req, res) => departmentController.createCourse(req, res));

export default router;

