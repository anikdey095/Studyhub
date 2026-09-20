// Admin Controller for dynamic management of notes, research, careers, tuition, and internships
import departmentController from '../departments/department.controller.js';

let dynamicCareers = [
  {
    id: 'car-1',
    title: 'Machine Learning Research Intern (Summer 2026)',
    company: 'Anthropic / DeepMind AI',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Internship',
    salary: '$65 - $80 / hr',
    tags: ['PyTorch', 'LLMs', 'Reinforcement Learning'],
    description: 'Work alongside frontier AI researchers investigating alignment mechanisms and pretraining architectures.',
    deadline: 'April 15, 2026',
    category: 'Internship',
  },
  {
    id: 'car-2',
    title: 'Private Math & Calculus Tutor (College Level)',
    company: 'StudyHub Tutors Network',
    location: 'Online / Zoom',
    type: 'Tuition',
    salary: '$35 - $50 / hr',
    tags: ['Calculus I & II', 'Linear Algebra', 'Exam Prep'],
    description: 'Provide 1-on-1 tutoring sessions for undergraduate engineering students preparing for midterms and finals.',
    deadline: 'Immediate Start',
    category: 'Tuition',
  },
  {
    id: 'car-3',
    title: 'Software Engineer Intern - Distributed Systems',
    company: 'Cloudflare',
    location: 'Austin, TX / Remote',
    type: 'Internship',
    salary: '$55 - $70 / hr',
    tags: ['Go', 'Rust', 'Kubernetes', 'Edge Computing'],
    description: 'Develop low-latency routing algorithms powering millions of web requests per second worldwide.',
    deadline: 'May 1, 2026',
    category: 'Internship',
  },
  {
    id: 'car-4',
    title: 'Undergraduate Teaching Assistant: Algorithms',
    company: 'University CS Department',
    location: 'On Campus',
    type: 'Job',
    salary: '$25 - $32 / hr',
    tags: ['Teaching', 'Algorithms', 'Grading'],
    description: 'Lead weekly recitations and hold office hours debugging student code.',
    deadline: 'Rolling',
    category: 'Job',
  },
  {
    id: 'car-5',
    title: 'High School Physics & SAT Prep Tutor',
    company: 'Elite Academy Tutors',
    location: 'Hybrid / Boston, MA',
    type: 'Tuition',
    salary: '$40 - $60 / hr',
    tags: ['AP Physics', 'SAT Math', 'High School'],
    description: 'Mentoring 11th and 12th graders for AP Physics C Mechanics and college admissions.',
    deadline: 'Immediate',
    category: 'Tuition',
  },
  {
    id: 'car-loc-1',
    title: 'Class 10 Higher Math & Physics Home Tutor',
    company: 'Guardian Direct (Dhanmondi)',
    location: 'Dhanmondi, Dhaka (Home)',
    type: 'Tuition',
    salary: '8,500 BDT / month (3 days/wk)',
    tags: ['English Version', 'SSC 2027', 'Higher Math', 'Physics'],
    description: 'Looking for a BUET / DU / Medical student to tutor a Class 10 English version student in Higher Math and Physics. 3 days a week, 1.5 hours/day.',
    deadline: 'Urgent Hire',
    category: 'Tuition',
  },
  {
    id: 'car-loc-2',
    title: 'HSC 1st Year Chemistry & ICT Tutor',
    company: 'Guardian Direct (Uttara)',
    location: 'Uttara Sector 7, Dhaka (Home)',
    type: 'Tuition',
    salary: '10,000 BDT / month (4 days/wk)',
    tags: ['Bangla Medium', 'HSC 2026', 'Chemistry', 'ICT'],
    description: 'Seeking a dedicated university tutor for HSC 1st year Science student. Focus on board syllabus and foundational concepts.',
    deadline: 'Starts this week',
    category: 'Tuition',
  },
  {
    id: 'car-loc-3',
    title: 'Cambridge O-Level Physics & Chemistry Tutor',
    company: 'British Curriculum Parents Network',
    location: 'Gulshan 2, Dhaka',
    type: 'Tuition',
    salary: '15,000 BDT / month (3 days/wk)',
    tags: ['Cambridge O-Level', 'Physics', 'Chemistry', 'Edexcel'],
    description: 'Experienced tutor required for O-Level candidate. Past paper solving and conceptual clarity required.',
    deadline: 'Open until filled',
    category: 'Tuition',
  },
  {
    id: 'car-loc-4',
    title: 'Class 8 General Science & Math Tutor',
    company: 'Guardian Direct (Mirpur)',
    location: 'Mirpur 10, Dhaka (Home)',
    type: 'Tuition',
    salary: '6,500 BDT / month (3 days/wk)',
    tags: ['Bangla Medium', 'Class 8', 'Math', 'General Science'],
    description: 'Female/Male university student preferred. Routine tests and homework monitoring required.',
    deadline: 'Immediate',
    category: 'Tuition',
  },
  {
    id: 'car-loc-5',
    title: 'University CSE Programming & Data Structures Mentor',
    company: 'StudyHub Peer Tutors',
    location: 'Online / Google Meet',
    type: 'Tuition',
    salary: '8,000 BDT / month (2 days/wk)',
    tags: ['C++', 'Data Structures', 'Algorithms', 'University Level'],
    description: 'Provide 1-on-1 coding mentorship for 1st-year university students tackling C++ pointers, recursion, and linked lists.',
    deadline: 'Ongoing',
    category: 'Tuition',
  },
];

let dynamicResearch = [
  {
    id: 'p-1',
    title: 'Scalable Latent Diffusion Models for High-Fidelity Video Synthesis',
    abstract: 'We present an architectural improvement to temporal transformer blocks that achieves a 3.4x reduction in inference latency while preserving photorealistic spatial coherence across extended video horizons.',
    field: 'AI & Robotics',
    authors: ['Sarah Vance (PhD)', 'Prof. Michael Hastings'],
    institution: 'Stanford AI Research Lab',
    year: 2026,
    citations: 184,
    doi: '10.1145/3610548.3618192',
    pdfUrl: 'https://arxiv.org',
  },
  {
    id: 'p-2',
    title: 'Fault-Tolerant Surface Code Decoders Using Graph Neural Networks',
    abstract: 'Demonstrating sub-threshold logical error rates in topological quantum memory through real-time syndrome extraction with hardware-accelerated GNN decoders.',
    field: 'Quantum Computing',
    authors: ['Liam O’Connor', 'Dr. Aris Thorne'],
    institution: 'MIT Quantum Information Center',
    year: 2026,
    citations: 92,
    doi: '10.1038/s41586-025-07891-2',
    pdfUrl: 'https://arxiv.org',
  },
  {
    id: 'p-3',
    title: 'Targeted Epigenetic Reprogramming via CRISPR-Associated Deaminases',
    abstract: 'High-precision in vivo locus editing of methylation signatures without double-stranded DNA breaks, demonstrating therapeutic reversal of pro-inflammatory cellular states.',
    field: 'Biotechnology',
    authors: ['Claire Dumont', 'Ethan Zhou'],
    institution: 'Broad Institute of Harvard & MIT',
    year: 2025,
    citations: 240,
    doi: '10.1126/science.abm4219',
    pdfUrl: 'https://nature.com',
  },
];

class AdminController {
  // Overview
  async getOverview(req, res) {
    const depts = departmentController.getDepartmentList();
    const totalCourses = depts.reduce((acc, d) => acc + (d.courses?.length || 0), 0);
    res.json({
      success: true,
      stats: {
        totalCareers: dynamicCareers.length,
        totalResearch: dynamicResearch.length,
        totalDepartments: depts.length,
        totalCourses,
        activeTuitions: dynamicCareers.filter((c) => c.category === 'Tuition').length,
        activeInternships: dynamicCareers.filter((c) => c.category === 'Internship').length,
        activeJobs: dynamicCareers.filter((c) => c.category === 'Job').length,
      },
    });
  }

  // Careers (Jobs, Tuition, Internships)
  async getCareers(req, res) {
    const { category, search } = req.query;
    let list = [...dynamicCareers];

    if (category && category !== 'All') {
      list = list.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: list.length, careers: list });
  }

  async createCareer(req, res) {
    const { title, company, location, type, salary, tags, description, deadline, category } = req.body;
    if (!title || !company) {
      return res.status(400).json({ error: 'Title and company/provider are required' });
    }

    const newCareer = {
      id: `car-${Date.now()}`,
      title,
      company,
      location: location || 'Remote / Hybrid',
      type: type || category || 'Job',
      salary: salary || 'Competitive',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t) => t.trim()),
      description: description || 'No description provided.',
      deadline: deadline || 'Rolling',
      category: category || 'Job',
    };

    dynamicCareers.unshift(newCareer);
    res.status(201).json({ success: true, message: 'Career listing created successfully', item: newCareer });
  }

  async deleteCareer(req, res) {
    const { id } = req.params;
    dynamicCareers = dynamicCareers.filter((c) => c.id !== id);
    res.json({ success: true, message: 'Career listing deleted' });
  }

  // Research
  async getResearch(req, res) {
    res.json({ success: true, count: dynamicResearch.length, papers: dynamicResearch });
  }

  async createResearch(req, res) {
    const { title, abstract, field, authors, institution, year, doi, pdfUrl } = req.body;
    if (!title || !abstract) {
      return res.status(400).json({ error: 'Title and abstract are required' });
    }

    const newPaper = {
      id: `p-${Date.now()}`,
      title,
      abstract,
      field: field || 'General Academic',
      authors: Array.isArray(authors) ? authors : (authors || 'Researcher').split(',').map((a) => a.trim()),
      institution: institution || 'StudyHub Academic Lab',
      year: year || 2026,
      citations: 1,
      doi: doi || `10.1145/studyhub.${Date.now().toString().slice(-6)}`,
      pdfUrl: pdfUrl || 'https://arxiv.org',
    };

    dynamicResearch.unshift(newPaper);
    res.status(201).json({ success: true, message: 'Research paper published', paper: newPaper });
  }

  async deleteResearch(req, res) {
    const { id } = req.params;
    dynamicResearch = dynamicResearch.filter((p) => p.id !== id);
    res.json({ success: true, message: 'Paper deleted' });
  }
}

export default new AdminController();
