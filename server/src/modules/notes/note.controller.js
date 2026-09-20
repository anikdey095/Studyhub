import prisma from '../../middleware/database.js';
import departmentController from '../departments/department.controller.js';

// Seeded/Fallback data covering the official University Departments
const SAMPLE_NOTES = [
  {
    id: 'note-1',
    title: 'Distributed Systems & Microservices Architecture',
    description: 'Comprehensive study guide covering consensus algorithms (Raft, Paxos), CAP theorem, event sourcing, and gRPC patterns.',
    course: 'CSE 420: Distributed Systems & Architecture',
    department: 'Computer Science & Engineering',
    university: 'University Campus',
    author: 'Elena Rostova',
    fileUrl: 'https://example.com/notes/distributed-systems.pdf',
    downloads: 1420,
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Distributed Systems', 'Architecture', 'CSE'],
    createdAt: new Date('2026-03-01').toISOString(),
  },
  {
    id: 'note-2',
    title: 'Enterprise Software Architecture & Design Patterns',
    description: 'Clean Architecture, Domain-Driven Design (DDD), SOLID principles, and microkernel patterns with practical Java/TypeScript examples.',
    course: 'SWE 311: Software Architecture & Design Patterns',
    department: 'Software Engineering',
    university: 'University Campus',
    author: 'Marcus Chen',
    fileUrl: 'https://example.com/notes/software-architecture.pdf',
    downloads: 2780,
    rating: 5.0,
    reviewsCount: 64,
    tags: ['Software Architecture', 'Design Patterns', 'SWE'],
    createdAt: new Date('2026-03-08').toISOString(),
  },
  {
    id: 'note-3',
    title: 'Academic Rhetoric, Critical Discourse & Expository Writing',
    description: 'Mastery handbook for university-level essay synthesis, argument structure, MLA/APA documentation, and stylistic analysis.',
    course: 'ENG 102: English Composition & Expository Writing',
    department: 'English',
    university: 'University Campus',
    author: 'Prof. Julian Brooks',
    fileUrl: 'https://example.com/notes/academic-rhetoric.pdf',
    downloads: 1120,
    rating: 4.85,
    reviewsCount: 29,
    tags: ['English Composition', 'Rhetoric', 'Writing'],
    createdAt: new Date('2026-02-18').toISOString(),
  },
  {
    id: 'note-4',
    title: 'Analog Circuit Design & Operational Amplifiers',
    description: 'BJT and MOSFET small-signal models, frequency response, feedback topologies, and operational amplifier circuit design.',
    course: 'EEE 201: Electronic Devices & Analog Circuits',
    department: 'Electrical Engineering',
    university: 'University Campus',
    author: 'Tariq Al-Mansoor',
    fileUrl: 'https://example.com/notes/analog-electronics.pdf',
    downloads: 1650,
    rating: 4.9,
    reviewsCount: 42,
    tags: ['Analog Circuits', 'Electronics', 'EEE'],
    createdAt: new Date('2026-02-25').toISOString(),
  },
  {
    id: 'note-5',
    title: 'Financial Econometrics & Applied Time-Series Forecasting',
    description: 'ARIMA, GARCH modeling, stationarity testing, cointegration, and macroeconomic forecasting in Python & R with practical datasets.',
    course: 'ECO 301: Econometrics & Quantitative Methods',
    department: 'Economics',
    university: 'University Campus',
    author: 'Sophia Rossi',
    fileUrl: 'https://example.com/notes/econometrics.pdf',
    downloads: 1940,
    rating: 4.95,
    reviewsCount: 51,
    tags: ['Econometrics', 'Time Series', 'Economics'],
    createdAt: new Date('2026-03-02').toISOString(),
  },
  {
    id: 'note-6',
    title: 'Deep Learning Architectures & Transformer Foundations',
    description: 'Mathematical foundations of self-attention mechanisms, multi-head attention, backpropagation calculus, and PyTorch training pipelines.',
    course: 'DS 401: Deep Learning & Neural Architectures',
    department: 'Data Science',
    university: 'University Campus',
    author: 'Kavita Sengupta',
    fileUrl: 'https://example.com/notes/deep-learning-transformers.pdf',
    downloads: 3150,
    rating: 5.0,
    reviewsCount: 94,
    tags: ['Deep Learning', 'PyTorch', 'Data Science', 'AI'],
    createdAt: new Date('2026-03-10').toISOString(),
  },
];

class NoteController {
  async getNotes(req, res) {
    try {
      const { search = '', department = '', sort = 'popular' } = req.query;

      let dbNotes = [];
      try {
        dbNotes = await prisma.note.findMany({
          include: {
            author: { select: { id: true, name: true, university: true } },
            course: { include: { department: true } },
            ratings: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });
      } catch (dbError) {
        // Fall back gracefully to sample notes if DB is not seeded yet
        console.warn('Using in-memory notes store:', dbError.message);
      }

      let combinedNotes = [...SAMPLE_NOTES];

      if (dbNotes && dbNotes.length > 0) {
        const formattedDbNotes = dbNotes.map((n) => ({
          id: n.id,
          title: n.title,
          description: n.description || '',
          course: n.courseName || n.course?.name || 'General Course',
          department: n.departmentName || n.course?.department?.name || 'General',
          university: n.universityName || n.author?.university || 'StudyHub Member',
          author: n.authorName || n.author?.name || 'Anonymous',
          fileUrl: n.fileUrl,
          downloads: n.downloadCount || 0,
          rating: n.ratings.length ? n.ratings.reduce((acc, r) => acc + r.value, 0) / n.ratings.length : 5.0,
          reviewsCount: n.ratings.length,
          tags: [n.departmentName || n.course?.name || 'Note'],
          createdAt: n.createdAt.toISOString(),
        }));
        combinedNotes = [...formattedDbNotes, ...SAMPLE_NOTES];
      }

      // Filter
      let filtered = combinedNotes;
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (n) =>
            n.title.toLowerCase().includes(query) ||
            n.description.toLowerCase().includes(query) ||
            n.course.toLowerCase().includes(query) ||
            n.tags.some((t) => t.toLowerCase().includes(query))
        );
      }

      if (department && department !== 'All') {
        filtered = filtered.filter((n) => n.department.toLowerCase() === department.toLowerCase());
      }

      // Sort
      if (sort === 'popular') {
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'recent') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      res.json({
        success: true,
        count: filtered.length,
        notes: filtered,
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes', message: error.message });
    }
  }

  async createNote(req, res) {
    try {
      const { title, description, fileUrl, courseName, departmentName, authorName } = req.body;

      if (!title || !fileUrl) {
        return res.status(400).json({ error: 'Title and file URL are required' });
      }

      const finalDept = departmentName || 'Computer Science & Engineering';
      const finalCourse = courseName || 'General Studies';

      // Automatically register this course under the department so other users can see and pick it
      try {
        departmentController.registerCourseIfAbsent(finalDept, finalCourse);
      } catch (err) {
        console.warn('Notice registering course with department:', err.message);
      }

      let savedNote = null;

      // Try saving to PostgreSQL database first
      try {
        const dbNote = await prisma.note.create({
          data: {
            title,
            description: description || '',
            fileUrl,
            courseName: finalCourse,
            departmentName: finalDept,
            universityName: 'StudyHub Community',
            authorName: authorName || 'Anonymous Scholar',
            downloadCount: 0,
          },
        });

        savedNote = {
          id: dbNote.id,
          title: dbNote.title,
          description: dbNote.description || '',
          course: dbNote.courseName || finalCourse,
          department: dbNote.departmentName || finalDept,
          university: dbNote.universityName || 'StudyHub Community',
          author: dbNote.authorName || 'Anonymous Scholar',
          fileUrl: dbNote.fileUrl,
          downloads: 0,
          rating: 5.0,
          reviewsCount: 0,
          tags: [dbNote.departmentName || finalDept],
          createdAt: dbNote.createdAt.toISOString(),
        };

        console.log('✅ Note saved to database:', dbNote.id);
      } catch (dbError) {
        console.warn('⚠️ DB save failed, using in-memory store:', dbError.message);

        // Fallback: save to in-memory SAMPLE_NOTES array
        savedNote = {
          id: `note-${Date.now()}`,
          title,
          description: description || '',
          course: finalCourse,
          department: finalDept,
          university: 'StudyHub Community',
          author: authorName || 'Anonymous Scholar',
          fileUrl,
          downloads: 0,
          rating: 5.0,
          reviewsCount: 0,
          tags: [finalDept],
          createdAt: new Date().toISOString(),
        };

        SAMPLE_NOTES.unshift(savedNote);
      }

      res.status(201).json({
        success: true,
        message: 'Note uploaded successfully',
        note: savedNote,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to upload note', message: error.message });
    }
  }

  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(2);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          mimeType: req.file.mimetype,
          size: `${fileSizeMb} MB`,
          fileUrl,
        },
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ success: false, error: 'File upload failed', message: error.message });
    }
  }
}

export default new NoteController();
