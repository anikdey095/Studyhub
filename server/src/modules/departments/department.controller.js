import prisma from '../../middleware/database.js';

// Default initial university departments and course catalog
const INITIAL_DEPARTMENTS = [
  {
    id: 'dept-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Core computing, algorithms, systems engineering, networks, and intelligent software.',
    courses: [
      { id: 'c-cse-1', name: 'CSE 110: Programming Language I (C/C++)' },
      { id: 'c-cse-2', name: 'CSE 220: Data Structures & Algorithms' },
      { id: 'c-cse-3', name: 'CSE 321: Operating Systems & Systems Programming' },
      { id: 'c-cse-4', name: 'CSE 330: Numerical Methods & Analysis' },
      { id: 'c-cse-5', name: 'CSE 420: Compiler Design' },
      { id: 'c-cse-6', name: 'CSE 422: Artificial Intelligence & Machine Learning' },
    ],
  },
  {
    id: 'dept-swe',
    name: 'Software Engineering',
    code: 'SWE',
    description: 'Enterprise software architecture, lifecycle design, agile development, and automated testing.',
    courses: [
      { id: 'c-swe-1', name: 'SWE 121: Object Oriented Concepts & Java' },
      { id: 'c-swe-2', name: 'SWE 221: Software Engineering Methodologies' },
      { id: 'c-swe-3', name: 'SWE 311: Software Architecture & Design Patterns' },
      { id: 'c-swe-4', name: 'SWE 322: Software Quality Assurance & Testing' },
      { id: 'c-swe-5', name: 'SWE 411: Web & Mobile Application Engineering' },
      { id: 'c-swe-6', name: 'SWE 421: DevOps, CI/CD & Cloud Infrastructure' },
    ],
  },
  {
    id: 'dept-eng',
    name: 'English',
    code: 'ENG',
    description: 'Language proficiency, critical rhetoric, world literature, and professional communication.',
    courses: [
      { id: 'c-eng-1', name: 'ENG 101: Basic Academic English & Reading' },
      { id: 'c-eng-2', name: 'ENG 102: English Composition & Expository Writing' },
      { id: 'c-eng-3', name: 'ENG 201: Professional Communication & Public Speaking' },
      { id: 'c-eng-4', name: 'ENG 301: Critical Thinking & Literary Theory' },
      { id: 'c-eng-5', name: 'ENG 315: History of English Literature' },
      { id: 'c-eng-6', name: 'ENG 401: Advanced Linguistics & Stylistics' },
    ],
  },
  {
    id: 'dept-eee',
    name: 'Electrical Engineering',
    code: 'EEE',
    description: 'Analog and digital electronics, electromagnetic systems, power engineering, and robotics.',
    courses: [
      { id: 'c-eee-1', name: 'EEE 101: Electrical Circuit Analysis I' },
      { id: 'c-eee-2', name: 'EEE 102: Electrical Circuit Analysis II' },
      { id: 'c-eee-3', name: 'EEE 201: Electronic Devices & Analog Circuits' },
      { id: 'c-eee-4', name: 'EEE 205: Digital Logic Design' },
      { id: 'c-eee-5', name: 'EEE 301: Signals, Systems & Transforms' },
      { id: 'c-eee-6', name: 'EEE 311: Microprocessors & Embedded Systems' },
      { id: 'c-eee-7', name: 'EEE 401: Power System Engineering & Energy Systems' },
    ],
  },
  {
    id: 'dept-eco',
    name: 'Economics',
    code: 'ECO',
    description: 'Microeconomic foundations, macro policymaking, econometrics, trade, and financial modeling.',
    courses: [
      { id: 'c-eco-1', name: 'ECO 101: Principles of Microeconomics' },
      { id: 'c-eco-2', name: 'ECO 102: Principles of Macroeconomics' },
      { id: 'c-eco-3', name: 'ECO 201: Intermediate Microeconomic Theory' },
      { id: 'c-eco-4', name: 'ECO 202: Intermediate Macroeconomic Theory' },
      { id: 'c-eco-5', name: 'ECO 301: Econometrics & Quantitative Methods' },
      { id: 'c-eco-6', name: 'ECO 401: International Trade & Global Finance' },
      { id: 'c-eco-7', name: 'ECO 420: Development Economics & Public Policy' },
    ],
  },
  {
    id: 'dept-ds',
    name: 'Data Science',
    code: 'DS',
    description: 'Statistical computing, big data processing, neural networks, predictive analytics, and AI.',
    courses: [
      { id: 'c-ds-1', name: 'DS 101: Introduction to Data Science with Python' },
      { id: 'c-ds-2', name: 'DS 201: Applied Probability & Inferential Statistics' },
      { id: 'c-ds-3', name: 'DS 301: Machine Learning & Predictive Modeling' },
      { id: 'c-ds-4', name: 'DS 311: Big Data Technologies & Data Engineering' },
      { id: 'c-ds-5', name: 'DS 401: Deep Learning & Neural Architectures' },
      { id: 'c-ds-6', name: 'DS 415: Natural Language Processing & LLMs' },
    ],
  },
];

let inMemoryDepartments = JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS));

class DepartmentController {
  // GET /api/departments
  async getDepartments(req, res) {
    try {
      let dbDepartments = [];
      try {
        dbDepartments = await prisma.department.findMany({
          include: { courses: true },
          orderBy: { name: 'asc' },
        });
      } catch (dbErr) {
        // Fall back to in-memory store
      }

      if (dbDepartments && dbDepartments.length > 0) {
        // Merge DB departments with any extra in-memory ones
        const dbNames = new Set(dbDepartments.map((d) => d.name.toLowerCase()));
        const formattedDb = dbDepartments.map((d) => ({
          id: d.id,
          name: d.name,
          courses: d.courses || [],
        }));

        // Include any memory departments not yet present in DB
        const missingFromDb = inMemoryDepartments.filter(
          (m) => !dbNames.has(m.name.toLowerCase())
        );

        return res.json({
          success: true,
          departments: [...formattedDb, ...missingFromDb],
        });
      }

      // Return in-memory store
      return res.json({
        success: true,
        departments: inMemoryDepartments,
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({ error: 'Failed to fetch departments', message: error.message });
    }
  }

  // POST /api/departments (Admin can add new department)
  async createDepartment(req, res) {
    try {
      const { name, code, description } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Department name is required' });
      }

      const trimmedName = name.trim();

      // Check if already exists in memory
      const existing = inMemoryDepartments.find(
        (d) => d.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({ error: 'Department already exists' });
      }

      let newDept = null;
      try {
        const dbDept = await prisma.department.create({
          data: {
            name: trimmedName,
          },
          include: { courses: true },
        });

        newDept = {
          id: dbDept.id,
          name: dbDept.name,
          code: code ? code.trim().toUpperCase() : trimmedName.substring(0, 4).toUpperCase(),
          description: description || 'Academic discipline department.',
          courses: [],
        };
      } catch (dbErr) {
        // In-memory fallback
        newDept = {
          id: `dept-${Date.now()}`,
          name: trimmedName,
          code: code ? code.trim().toUpperCase() : trimmedName.substring(0, 4).toUpperCase(),
          description: description || 'Academic discipline department.',
          courses: [],
        };
      }

      inMemoryDepartments.push(newDept);

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        department: newDept,
      });
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({ error: 'Failed to create department', message: error.message });
    }
  }

  // DELETE /api/departments/:id (Admin can delete department)
  async deleteDepartment(req, res) {
    try {
      const { id } = req.params;

      try {
        await prisma.department.delete({ where: { id } }).catch(() => {});
      } catch (dbErr) {}

      inMemoryDepartments = inMemoryDepartments.filter((d) => d.id !== id);

      res.json({
        success: true,
        message: 'Department deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ error: 'Failed to delete department', message: error.message });
    }
  }

  // POST /api/departments/courses (Any user or note uploader can create a new course)
  async createCourse(req, res) {
    try {
      const { name, departmentName, departmentId } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Course name is required' });
      }

      const trimmedName = name.trim();
      const targetDeptName = (departmentName || 'Computer Science & Engineering').trim();

      // Find department in memory
      let targetDept = inMemoryDepartments.find(
        (d) =>
          (departmentId && d.id === departmentId) ||
          d.name.toLowerCase() === targetDeptName.toLowerCase() ||
          (d.code && d.code.toLowerCase() === targetDeptName.toLowerCase())
      );

      // If department doesn't exist, create it or fallback to first
      if (!targetDept) {
        targetDept = {
          id: `dept-${Date.now()}`,
          name: targetDeptName,
          code: targetDeptName.substring(0, 4).toUpperCase(),
          description: 'Department',
          courses: [],
        };
        inMemoryDepartments.push(targetDept);
      }

      // Check if course already exists under this department
      const existingCourse = targetDept.courses?.find(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existingCourse) {
        return res.status(200).json({
          success: true,
          message: 'Course already exists in department',
          course: existingCourse,
          department: targetDept,
        });
      }

      let newCourse = null;
      try {
        // Try creating in DB if targetDept exists in DB
        let dbDept = await prisma.department.findFirst({
          where: {
            OR: [
              { name: { equals: targetDept.name, mode: 'insensitive' } },
              { id: targetDept.id },
            ],
          },
        });

        if (!dbDept) {
          dbDept = await prisma.department.create({
            data: { name: targetDept.name },
          });
        }

        const createdDbCourse = await prisma.course.create({
          data: {
            name: trimmedName,
            departmentId: dbDept.id,
          },
        });

        newCourse = {
          id: createdDbCourse.id,
          name: createdDbCourse.name,
          departmentId: dbDept.id,
        };
      } catch (dbErr) {
        newCourse = {
          id: `c-${Date.now()}`,
          name: trimmedName,
          departmentId: targetDept.id,
        };
      }

      if (!targetDept.courses) {
        targetDept.courses = [];
      }
      targetDept.courses.push(newCourse);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course: newCourse,
        department: targetDept,
      });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Failed to create course', message: error.message });
    }
  }

  // Helper method for other modules to register/ensure a course exists
  registerCourseIfAbsent(deptName, courseName) {
    if (!courseName || !deptName) return;
    const cleanCourse = courseName.trim();
    const cleanDept = deptName.trim();

    let dept = inMemoryDepartments.find(
      (d) =>
        d.name.toLowerCase() === cleanDept.toLowerCase() ||
        (d.code && d.code.toLowerCase() === cleanDept.toLowerCase())
    );

    if (!dept) {
      dept = {
        id: `dept-${Date.now()}`,
        name: cleanDept,
        code: cleanDept.substring(0, 4).toUpperCase(),
        courses: [],
      };
      inMemoryDepartments.push(dept);
    }

    if (!dept.courses) {
      dept.courses = [];
    }

    const exists = dept.courses.some(
      (c) => c.name.toLowerCase() === cleanCourse.toLowerCase()
    );

    if (!exists) {
      dept.courses.push({
        id: `c-${Date.now()}`,
        name: cleanCourse,
        departmentId: dept.id,
      });
    }
  }

  getDepartmentList() {
    return inMemoryDepartments;
  }
}

const departmentController = new DepartmentController();
export default departmentController;
