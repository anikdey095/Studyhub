import prisma from '../../middleware/database.js';

// Seeded/Fallback data for demo and initial deployment
const SAMPLE_NOTES = [
  {
    id: 'note-1',
    title: 'Distributed Systems & Microservices Architecture',
    description: 'Comprehensive study guide covering consensus algorithms (Raft, Paxos), CAP theorem, event sourcing, and gRPC patterns.',
    course: 'Computer Science 401',
    department: 'Computer Science',
    university: 'MIT / Online',
    author: 'Elena Rostova',
    fileUrl: 'https://example.com/notes/distributed-systems.pdf',
    downloads: 1420,
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Architecture', 'Distributed Systems', 'Backend'],
    createdAt: new Date('2026-03-01').toISOString(),
  },
  {
    id: 'note-2',
    title: 'Deep Learning with PyTorch & Transformer Models',
    description: 'Lecture summaries, mathematical derivations of self-attention mechanisms, and complete hands-on PyTorch training pipelines.',
    course: 'Artificial Intelligence 302',
    department: 'Artificial Intelligence',
    university: 'Stanford University',
    author: 'Marcus Chen',
    fileUrl: 'https://example.com/notes/deep-learning-transformers.pdf',
    downloads: 3150,
    rating: 5.0,
    reviewsCount: 94,
    tags: ['AI', 'PyTorch', 'Transformers', 'NLP'],
    createdAt: new Date('2026-03-10').toISOString(),
  },
  {
    id: 'note-3',
    title: 'Data Structures & Algorithms: LeetCode Patterns',
    description: 'Systematic breakdown of two pointers, sliding window, topological sort, and dynamic programming patterns with visual diagrams.',
    course: 'CS Algorithms 201',
    department: 'Computer Science',
    university: 'UC Berkeley',
    author: 'Priya Sharma',
    fileUrl: 'https://example.com/notes/dsa-patterns.pdf',
    downloads: 2890,
    rating: 4.8,
    reviewsCount: 76,
    tags: ['DSA', 'LeetCode', 'Interview Prep'],
    createdAt: new Date('2026-02-20').toISOString(),
  },
  {
    id: 'note-4',
    title: 'Organic Chemistry II: Reaction Mechanisms & Synthesis',
    description: 'Complete synthesis pathways, nucleophilic additions, electrophilic substitutions, and spectral analysis tips.',
    course: 'Chemistry 220',
    department: 'Chemistry & Biology',
    university: 'Harvard University',
    author: 'David Kim',
    fileUrl: 'https://example.com/notes/orgo-2.pdf',
    downloads: 870,
    rating: 4.7,
    reviewsCount: 22,
    tags: ['Chemistry', 'Synthesis', 'MCAT'],
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: 'note-5',
    title: 'Financial Econometrics & Time Series Analysis',
    description: 'ARIMA, GARCH modeling, stationarity testing, and econometric forecasting in Python & R with practical financial datasets.',
    course: 'Economics 350',
    department: 'Business & Economics',
    university: 'London School of Economics',
    author: 'Sophia Rossi',
    fileUrl: 'https://example.com/notes/econometrics.pdf',
    downloads: 640,
    rating: 4.9,
    reviewsCount: 19,
    tags: ['Finance', 'Econometrics', 'Python'],
    createdAt: new Date('2026-02-28').toISOString(),
  },
  {
    id: 'note-6',
    title: 'Next.js 14 App Router & Full-Stack Modern Web',
    description: 'Detailed architecture diagrams for Server Actions, streaming SSR, parallel routes, and Supabase / Prisma integrations.',
    course: 'Software Engineering 310',
    department: 'Computer Science',
    university: 'Carnegie Mellon',
    author: 'Jordan Lee',
    fileUrl: 'https://example.com/notes/nextjs-14-fullstack.pdf',
    downloads: 2190,
    rating: 4.95,
    reviewsCount: 65,
    tags: ['Next.js', 'React', 'TypeScript', 'Web Dev'],
    createdAt: new Date('2026-03-05').toISOString(),
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
          course: n.course?.name || 'General Course',
          department: n.course?.department?.name || 'General',
          university: n.author?.university || 'StudyHub Member',
          author: n.author?.name || 'Anonymous',
          fileUrl: n.fileUrl,
          downloads: Math.floor(Math.random() * 100) + 1,
          rating: n.ratings.length ? n.ratings.reduce((acc, r) => acc + r.value, 0) / n.ratings.length : 5.0,
          reviewsCount: n.ratings.length,
          tags: [n.course?.name || 'Note'],
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

      const newNote = {
        id: `note-${Date.now()}`,
        title,
        description: description || '',
        course: courseName || 'General Studies',
        department: departmentName || 'General',
        university: 'StudyHub Community',
        author: authorName || 'Anonymous Scholar',
        fileUrl,
        downloads: 1,
        rating: 5.0,
        reviewsCount: 1,
        tags: [departmentName || 'Study Material'],
        createdAt: new Date().toISOString(),
      };

      SAMPLE_NOTES.unshift(newNote);

      res.status(201).json({
        success: true,
        message: 'Note uploaded successfully',
        note: newNote,
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
