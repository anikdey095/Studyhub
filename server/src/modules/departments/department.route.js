import express from 'express';
import departmentController from './department.controller.js';

const router = express.Router();

// GET /api/departments - list all departments and their courses
router.get('/', (req, res) => departmentController.getDepartments(req, res));

// POST /api/departments - admin adds new department
router.post('/', (req, res) => departmentController.createDepartment(req, res));

// DELETE /api/departments/:id - admin deletes department
router.delete('/:id', (req, res) => departmentController.deleteDepartment(req, res));

// POST /api/departments/courses - any user or note uploader creates a new course
router.post('/courses', (req, res) => departmentController.createCourse(req, res));

export default router;
