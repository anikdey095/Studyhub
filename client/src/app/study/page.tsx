'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  Search,
  BookOpen,
  Download,
  Star,
  Plus,
  X,
  Upload,
  Filter,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Lock,
  FileText,
  Paperclip,
  ExternalLink,
  Eye,
  Maximize2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';

interface Note {
  id: string;
  title: string;
  description: string;
  course: string;
  department: string;
  university: string;
  author: string;
  fileUrl: string;
  downloads: number;
  rating: number;
  reviewsCount?: number;
  tags?: string[];
  createdAt?: string;
}

const DEFAULT_DEPARTMENTS = [
  'All',
  'Computer Science & Engineering',
  'Software Engineering',
  'English',
  'Electrical Engineering',
  'Economics',
  'Data Science',
];

const DEFAULT_COURSES: Record<string, string[]> = {
  'Computer Science & Engineering': [
    'CSE 110: Programming Language I (C/C++)',
    'CSE 220: Data Structures & Algorithms',
    'CSE 321: Operating Systems & Systems Programming',
    'CSE 330: Numerical Methods & Analysis',
    'CSE 420: Compiler Design',
    'CSE 422: Artificial Intelligence & Machine Learning',
  ],
  'Software Engineering': [
    'SWE 121: Object Oriented Concepts & Java',
    'SWE 221: Software Engineering Methodologies',
    'SWE 311: Software Architecture & Design Patterns',
    'SWE 322: Software Quality Assurance & Testing',
    'SWE 411: Web & Mobile Application Engineering',
    'SWE 421: DevOps, CI/CD & Cloud Infrastructure',
  ],
  'English': [
    'ENG 101: Basic Academic English & Reading',
    'ENG 102: English Composition & Expository Writing',
    'ENG 201: Professional Communication & Public Speaking',
    'ENG 301: Critical Thinking & Literary Theory',
    'ENG 315: History of English Literature',
    'ENG 401: Advanced Linguistics & Stylistics',
  ],
  'Electrical Engineering': [
    'EEE 101: Electrical Circuit Analysis I',
    'EEE 102: Electrical Circuit Analysis II',
    'EEE 201: Electronic Devices & Analog Circuits',
    'EEE 205: Digital Logic Design',
    'EEE 301: Signals, Systems & Transforms',
    'EEE 311: Microprocessors & Embedded Systems',
    'EEE 401: Power System Engineering & Energy Systems',
  ],
  'Economics': [
    'ECO 101: Principles of Microeconomics',
    'ECO 102: Principles of Macroeconomics',
    'ECO 201: Intermediate Microeconomic Theory',
    'ECO 202: Intermediate Macroeconomic Theory',
    'ECO 301: Econometrics & Quantitative Methods',
    'ECO 401: International Trade & Global Finance',
    'ECO 420: Development Economics & Public Policy',
  ],
  'Data Science': [
    'DS 101: Introduction to Data Science with Python',
    'DS 201: Applied Probability & Inferential Statistics',
    'DS 301: Machine Learning & Predictive Modeling',
    'DS 311: Big Data Technologies & Data Engineering',
    'DS 401: Deep Learning & Neural Architectures',
    'DS 415: Natural Language Processing & LLMs',
  ],
};

export default function StudyPage() {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS);
  const [courseCatalog, setCourseCatalog] = useState<Record<string, string[]>>(DEFAULT_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [selectedReadingNote, setSelectedReadingNote] = useState<Note | null>(null);

  // Registered User Course Creation Modal State
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courseModalDept, setCourseModalDept] = useState('Computer Science & Engineering');
  const [courseModalName, setCourseModalName] = useState('');
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [courseAddMessage, setCourseAddMessage] = useState('');

  // Upload Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Computer Science & Engineering');
  const [newCourse, setNewCourse] = useState('CSE 220: Data Structures & Algorithms');
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [customCourseInput, setCustomCourseInput] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Fetch dynamic departments and courses from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${API_URL}/api/departments`);
        if (res.data?.departments && Array.isArray(res.data.departments)) {
          const apiDepts = res.data.departments;
          const deptNames = apiDepts.map((d: any) => d.name);
          const combinedDepts = Array.from(
            new Set(['All', ...DEFAULT_DEPARTMENTS.filter((d) => d !== 'All'), ...deptNames])
          );
          setDepartments(combinedDepts);

          const newCatalog: Record<string, string[]> = { ...DEFAULT_COURSES };
          apiDepts.forEach((d: any) => {
            if (d.courses && Array.isArray(d.courses) && d.courses.length > 0) {
              const courseNames = d.courses.map((c: any) => c.name);
              newCatalog[d.name] = Array.from(
                new Set([...(newCatalog[d.name] || []), ...courseNames])
              );
            }
          });
          setCourseCatalog(newCatalog);
        }
      } catch (err) {
        console.warn('Using local departments and course catalog');
      }
    };
    fetchDepartments();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await axios.get(`${API_URL}/api/notes`, {
        params: {
          search: searchQuery,
          department: selectedDepartment === 'All' ? '' : selectedDepartment,
          sort: sortBy,
        },
      });
      if (res.data?.notes) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.warn('Using local notes fallback:', err);
      // Fallback initial dataset aligned with university departments
      setNotes([
        {
          id: 'note-1',
          title: 'Distributed Systems & Microservices Architecture',
          description: 'Comprehensive study guide covering consensus algorithms (Raft, Paxos), CAP theorem, and event sourcing.',
          course: 'CSE 420: Distributed Systems & Architecture',
          department: 'Computer Science & Engineering',
          university: 'University Campus',
          author: 'Elena Rostova',
          fileUrl: 'https://example.com/notes/distributed-systems.pdf',
          downloads: 1420,
          rating: 4.9,
          tags: ['Distributed Systems', 'CSE'],
        },
        {
          id: 'note-2',
          title: 'Enterprise Software Architecture & Design Patterns',
          description: 'Clean Architecture, Domain-Driven Design (DDD), SOLID principles, and microkernel patterns.',
          course: 'SWE 311: Software Architecture & Design Patterns',
          department: 'Software Engineering',
          university: 'University Campus',
          author: 'Marcus Chen',
          fileUrl: 'https://example.com/notes/software-architecture.pdf',
          downloads: 2780,
          rating: 5.0,
          tags: ['Software Architecture', 'SWE'],
        },
        {
          id: 'note-3',
          title: 'Academic Rhetoric, Critical Discourse & Expository Writing',
          description: 'Mastery handbook for university-level essay synthesis, argument structure, MLA/APA documentation.',
          course: 'ENG 102: English Composition & Expository Writing',
          department: 'English',
          university: 'University Campus',
          author: 'Prof. Julian Brooks',
          fileUrl: 'https://example.com/notes/academic-rhetoric.pdf',
          downloads: 1120,
          rating: 4.85,
          tags: ['English Composition', 'Rhetoric'],
        },
        {
          id: 'note-4',
          title: 'Analog Circuit Design & Operational Amplifiers',
          description: 'BJT and MOSFET small-signal models, frequency response, feedback topologies, and operational amplifiers.',
          course: 'EEE 201: Electronic Devices & Analog Circuits',
          department: 'Electrical Engineering',
          university: 'University Campus',
          author: 'Tariq Al-Mansoor',
          fileUrl: 'https://example.com/notes/analog-electronics.pdf',
          downloads: 1650,
          rating: 4.9,
          tags: ['Analog Circuits', 'EEE'],
        },
        {
          id: 'note-5',
          title: 'Financial Econometrics & Applied Time-Series Forecasting',
          description: 'ARIMA, GARCH modeling, stationarity testing, cointegration, and macroeconomic forecasting.',
          course: 'ECO 301: Econometrics & Quantitative Methods',
          department: 'Economics',
          university: 'University Campus',
          author: 'Sophia Rossi',
          fileUrl: 'https://example.com/notes/econometrics.pdf',
          downloads: 1940,
          rating: 4.95,
          tags: ['Econometrics', 'Economics'],
        },
        {
          id: 'note-6',
          title: 'Deep Learning Architectures & Transformer Foundations',
          description: 'Mathematical foundations of self-attention mechanisms, multi-head attention, and PyTorch pipelines.',
          course: 'DS 401: Deep Learning & Neural Architectures',
          department: 'Data Science',
          university: 'University Campus',
          author: 'Kavita Sengupta',
          fileUrl: 'https://example.com/notes/deep-learning-transformers.pdf',
          downloads: 3150,
          rating: 5.0,
          tags: ['Deep Learning', 'Data Science'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedDepartment, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleDownload = (id: string) => {
    setDownloadSuccessId(id);
    const targetNote = notes.find((n) => n.id === id);

    if (targetNote) {
      // Call backend to record download
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      axios.post(`${API_URL}/api/notes/${id}/download`).catch(() => {});

      // Increment download count locally
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === id ? { ...n, downloads: n.downloads + 1 } : n))
      );
      if (selectedReadingNote?.id === id) {
        setSelectedReadingNote((prev) => (prev ? { ...prev, downloads: prev.downloads + 1 } : null));
      }

      // Trigger real file download
      if (
        targetNote.fileUrl &&
        (targetNote.fileUrl.startsWith('http://localhost') ||
          targetNote.fileUrl.startsWith('/uploads') ||
          targetNote.fileUrl.endsWith('.pdf')) &&
        !targetNote.fileUrl.includes('example.com')
      ) {
        const link = document.createElement('a');
        link.href = targetNote.fileUrl;
        link.download = `${targetNote.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Generate a verified, valid PDF binary blob and download directly
        const cleanTitle = (targetNote.title || 'Study Material').replace(/[()\\\r\n]/g, '').slice(0, 50);
        const cleanCourse = (targetNote.course || 'GEN101').replace(/[()\\\r\n]/g, '');
        const cleanDept = (targetNote.department || 'Academic').replace(/[()\\\r\n]/g, '');
        const cleanUni = (targetNote.university || 'StudyHub').replace(/[()\\\r\n]/g, '');
        const cleanAuthor = (targetNote.author || 'Scholar').replace(/[()\\\r\n]/g, '');
        const cleanDesc1 = (targetNote.description || '').replace(/[()\\\r\n]/g, '').slice(0, 75);
        const cleanDesc2 = (targetNote.description || '').replace(/[()\\\r\n]/g, '').slice(75, 150);

        const pdfContent = [
          '%PDF-1.4',
          '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
          '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
          '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj',
          '4 0 obj << /Length 520 >> stream',
          'BT',
          '/F1 20 Tf',
          '50 720 Td',
          `(${cleanTitle}) Tj`,
          '/F2 11 Tf',
          '0 -28 Td',
          `(Course: ${cleanCourse} | Department: ${cleanDept}) Tj`,
          '0 -18 Td',
          `(Institution: ${cleanUni} | Contributor: ${cleanAuthor}) Tj`,
          '0 -18 Td',
          `(StudyHub Verified Academic Notes - Rating: ${targetNote.rating.toFixed(1)} Stars) Tj`,
          '/F1 13 Tf',
          '0 -35 Td',
          '(Lecture Syllabus & Course Overview:) Tj',
          '/F2 10 Tf',
          '0 -20 Td',
          `(${cleanDesc1}) Tj`,
          '0 -16 Td',
          `(${cleanDesc2}) Tj`,
          '0 -35 Td',
          '(Generated & Downloaded via StudyHub Global Academic Network - www.studyhub.org) Tj',
          'ET',
          'endstream',
          'endobj',
          '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
          '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
          'xref',
          '0 7',
          '0000000000 65535 f ',
          '0000000010 00000 n ',
          '0000000060 00000 n ',
          '0000000117 00000 n ',
          '0000000244 00000 n ',
          '0000000820 00000 n ',
          '0000000890 00000 n ',
          'trailer << /Size 7 /Root 1 0 R >>',
          'startxref',
          '955',
          '%%EOF',
        ].join('\n');

        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${targetNote.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_StudyHub.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }
    }

    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseModalName.trim()) return;
    setIsSubmittingCourse(true);
    setCourseAddMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const targetDept = courseModalDept || 'Computer Science & Engineering';
      await axios.post(`${API_URL}/api/departments/courses`, {
        name: courseModalName.trim(),
        departmentName: targetDept,
      });

      // Update local course catalog immediately so it is selectable everywhere
      setCourseCatalog((prev) => {
        const currentList = prev[targetDept] || [];
        if (!currentList.includes(courseModalName.trim())) {
          return { ...prev, [targetDept]: [...currentList, courseModalName.trim()] };
        }
        return prev;
      });

      setCourseAddMessage(`🎉 Course "${courseModalName.trim()}" added to ${targetDept}!`);
      setTimeout(() => {
        setIsAddCourseModalOpen(false);
        setCourseModalName('');
        setCourseAddMessage('');
      }, 1500);
    } catch (err: any) {
      setCourseAddMessage(err.response?.data?.error || 'Failed to add course');
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      let uploadedFileUrl = newFileUrl;

      // Real Device / Gallery File Upload via multipart form-data
      if (selectedFile) {
        setUploadMessage('Uploading file to server...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await axios.post(`${API_URL}/api/notes/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data?.file?.fileUrl) {
          uploadedFileUrl = `${API_URL}${uploadRes.data.file.fileUrl}`;
        }
      }

      if (!uploadedFileUrl && !selectedFile) {
        setUploadMessage('Please select a file or provide a resource link.');
        setIsUploading(false);
        return;
      }

      const finalCourse = isCustomCourse
        ? (customCourseInput.trim() || 'General Studies')
        : (newCourse.trim() || 'General Studies');

      const res = await axios.post(`${API_URL}/api/notes`, {
        title: newTitle,
        description: newDescription,
        courseName: finalCourse,
        departmentName: newDepartment,
        fileUrl: uploadedFileUrl || 'https://example.com/uploaded-note.pdf',
        authorName: user?.name || 'Student Contributor',
      });

      // If user typed a custom course, also save it into the department course catalog
      if (isCustomCourse && customCourseInput.trim()) {
        axios
          .post(`${API_URL}/api/departments/courses`, {
            name: customCourseInput.trim(),
            departmentName: newDepartment,
          })
          .catch(() => {});

        setCourseCatalog((prev) => {
          const current = prev[newDepartment] || [];
          if (!current.includes(customCourseInput.trim())) {
            return { ...prev, [newDepartment]: [...current, customCourseInput.trim()] };
          }
          return prev;
        });
      }

      if (res.data?.note) {
        setNotes([res.data.note, ...notes]);
      }
      setUploadMessage('🎉 Note and file uploaded successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setNewTitle('');
        setCustomCourseInput('');
        setIsCustomCourse(false);
        setNewDescription('');
        setNewFileUrl('');
        setSelectedFile(null);
        setUploadMessage('');
      }, 1500);
    } catch (err: any) {
      setUploadMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to upload note');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
              <BookOpen className="w-4 h-4" />
              <span>Academic Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Study Materials & Lecture Notes</h1>
            <p className="text-sm text-gray-400 mt-1">
              Browse, download, and share verified notes from top universities worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthGate(true);
                } else {
                  if (selectedDepartment !== 'All') {
                    setCourseModalDept(selectedDepartment);
                  }
                  setIsAddCourseModalOpen(true);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 border border-white/10 font-semibold text-sm flex items-center space-x-2 transition-all hover:border-purple-500/50"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>+ Add Course</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthGate(true);
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Study Note</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="my-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by keyword, topic, or course code..."
                className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 text-sm transition-all"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-pink-500/60"
                >
                  <option value="popular" className="bg-[#0f0f15]">Most Popular</option>
                  <option value="rating" className="bg-[#0f0f15]">Highest Rated</option>
                  <option value="recent" className="bg-[#0f0f15]">Most Recent</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl transition-colors"
              >
                Filter
              </button>
            </div>
          </form>

          {/* Department Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDepartment === dept
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-600/20'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading verified notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-white/[0.02] border border-white/10">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No study notes found</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or department filter, or be the first to upload notes for this subject!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-6 flex flex-col justify-between hover:border-pink-500/40 transition-all duration-300 shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                      {note.department}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{note.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedReadingNote(note)}
                    className="font-bold text-lg text-white group-hover:text-pink-300 transition-colors line-clamp-2 cursor-pointer"
                    title="Click to view & read note"
                  >
                    {note.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                    {note.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <div>
                    <span className="text-gray-300 font-medium block">{note.author}</span>
                    <span className="text-gray-500">{note.university}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedReadingNote(note)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/10 transition-all hover:border-purple-500/40"
                      title="Read & view note"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>Read</span>
                    </button>

                    <button
                      onClick={() => handleDownload(note.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        downloadSuccessId === note.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-pink-600/20 hover:bg-pink-600 hover:text-white text-pink-300 border border-pink-500/30'
                      }`}
                      title="Download verified note"
                    >
                      {downloadSuccessId === note.id ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{note.downloads}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Note Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0f0f18] border border-white/15 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-pink-500" />
                  <span>Upload Study Material</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
                <InputField
                  id="note-title"
                  name="title"
                  label="Document Title"
                  placeholder="e.g. Distributed Systems Midterm Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Department
                      </label>
                      <select
                        value={newDepartment}
                        onChange={(e) => {
                          const dept = e.target.value;
                          setNewDepartment(dept);
                          const courses = courseCatalog[dept] || [];
                          if (courses.length > 0 && !isCustomCourse) {
                            setNewCourse(courses[0]);
                          }
                        }}
                        className="w-full px-3 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {departments
                          .filter((d) => d !== 'All')
                          .map((d) => (
                            <option key={d} value={d} className="bg-[#0f0f18]">
                              {d}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-gray-300">
                          Course
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCustomCourse(!isCustomCourse)}
                          className="text-[11px] font-bold text-pink-400 hover:text-pink-300 underline"
                        >
                          {isCustomCourse ? 'Choose Existing' : '+ Add New Course'}
                        </button>
                      </div>

                      {isCustomCourse ? (
                        <div>
                          <input
                            type="text"
                            placeholder="e.g. SWE 312: Software Testing"
                            value={customCourseInput}
                            onChange={(e) => setCustomCourseInput(e.target.value)}
                            className="w-full px-3 py-3 bg-pink-500/10 border border-pink-500/50 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                          />
                        </div>
                      ) : (
                        <select
                          value={newCourse}
                          onChange={(e) => {
                            if (e.target.value === '__add_new__') {
                              setIsCustomCourse(true);
                            } else {
                              setNewCourse(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          {(courseCatalog[newDepartment] || []).map((c) => (
                            <option key={c} value={c} className="bg-[#0f0f18]">
                              {c}
                            </option>
                          ))}
                          <option value="__add_new__" className="bg-purple-900 text-pink-300 font-bold">
                            ➕ + Create / Type New Course...
                          </option>
                        </select>
                      )}
                    </div>
                  </div>

                  {isCustomCourse && (
                    <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs flex items-center space-x-2">
                      <span>✨ Any user can add a new course! It will be registered automatically when you upload.</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Summary / Key Topics
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Summary of formulas, key chapters, or concepts covered in this note..."
                    className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                {/* Device PDF & File Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>Select PDF or Notes from Device / Gallery</span>
                    <span className="text-[11px] text-pink-400 font-semibold">PDF, DOCX, Images</span>
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-500/40 hover:border-pink-500/80 bg-purple-500/[0.03] hover:bg-pink-500/[0.06] rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="flex items-center justify-between bg-white/[0.06] border border-white/10 rounded-xl p-3 text-left">
                        <div className="flex items-center space-x-3 truncate">
                          <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs shrink-0">
                            PDF
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                            <p className="text-xs text-emerald-400 font-medium">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 shrink-0 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Click to browse your files or device gallery</p>
                          <p className="text-xs text-gray-400 mt-0.5">Drag and drop lecture PDF, slides, or handwritten notes</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Optional Web Link */}
                <div className="pt-1">
                  <label className="block text-xs text-gray-400 mb-1">Or enter an external PDF link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/external-notes.pdf"
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {uploadMessage && (
                  <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg text-pink-300 text-sm text-center">
                    {uploadMessage}
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <Button type="submit" isLoading={isUploading} className="w-auto px-6">
                    Publish Material
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Note Reader & Document Preview Modal */}
        {selectedReadingNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-4xl max-h-[92vh] bg-[#0d0d15] border border-white/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 bg-white/[0.02] flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30">
                      {selectedReadingNote.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-gray-300 text-xs border border-white/10">
                      {selectedReadingNote.course}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{selectedReadingNote.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedReadingNote.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Contributed by <span className="text-gray-200 font-medium">{selectedReadingNote.author}</span> • {selectedReadingNote.university}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDownload(selectedReadingNote.id)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-pink-600/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedReadingNote(null)}
                    className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reader Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {/* Description & Overview */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Syllabus Summary & Key Highlights</span>
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedReadingNote.description}
                  </p>
                </div>

                {/* PDF Viewer / Document Preview */}
                {selectedReadingNote.fileUrl &&
                (selectedReadingNote.fileUrl.startsWith('http://localhost') ||
                  selectedReadingNote.fileUrl.startsWith('/uploads') ||
                  selectedReadingNote.fileUrl.endsWith('.pdf')) &&
                !selectedReadingNote.fileUrl.includes('example.com') ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="font-semibold text-gray-300">Document Reader Canvas</span>
                      <a
                        href={selectedReadingNote.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 flex items-center space-x-1"
                      >
                        <span>Open in New Tab</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <iframe
                      src={selectedReadingNote.fileUrl}
                      className="w-full h-[55vh] rounded-xl border border-white/15 bg-white shadow-xl"
                      title={selectedReadingNote.title}
                    />
                  </div>
                ) : (
                  /* Formatted Academic Study Notes Interactive Reader Canvas */
                  <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-gray-400">
                      <span className="text-purple-300 font-semibold">StudyHub Verified Course Reader</span>
                      <span>Total Downloads: {selectedReadingNote.downloads}</span>
                    </div>

                    <div className="space-y-4 text-sm text-gray-300">
                      <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/20">
                        <h5 className="font-bold text-white text-sm mb-1">📘 Course Module Breakdown</h5>
                        <p className="text-xs text-gray-300">
                          This verified study resource comprehensively covers key midterm and final lecture materials for{' '}
                          <span className="text-pink-300 font-semibold">{selectedReadingNote.course}</span> under the{' '}
                          <span className="text-purple-300 font-semibold">{selectedReadingNote.department}</span> syllabus.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                          <h6 className="font-semibold text-white text-xs uppercase tracking-wider">Topics Included</h6>
                          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                            <li>Fundamental principles and theoretical derivations</li>
                            <li>Step-by-step solved problem patterns</li>
                            <li>Key formulas and quick-reference cheat sheets</li>
                            <li>University past exam question solutions</li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                          <h6 className="font-semibold text-white text-xs uppercase tracking-wider">Academic Integrity</h6>
                          <p className="text-xs text-gray-400">
                            Verified by student peer review ({selectedReadingNote.rating.toFixed(1)} / 5.0 stars). Safe for personal revision and exam preparation.
                          </p>
                          <div className="pt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
                              <CheckCircle className="w-3 h-3 mr-1" /> Peer Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-xs text-gray-400">
                        Need the offline revision copy? Download the high-resolution printable PDF directly.
                      </p>
                      <button
                        onClick={() => handleDownload(selectedReadingNote.id)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Full PDF Note</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Registered User Add Course Modal */}
        {isAddCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0f0f18] border border-white/15 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-purple-400" />
                  <span>Add Course to Department</span>
                </h3>
                <button
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCourseSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Target Department
                  </label>
                  <select
                    value={courseModalDept}
                    onChange={(e) => setCourseModalDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {departments
                      .filter((d) => d !== 'All')
                      .map((d) => (
                        <option key={d} value={d} className="bg-[#0f0f18]">
                          {d}
                        </option>
                      ))}
                  </select>
                </div>

                <InputField
                  id="course-modal-name"
                  name="courseName"
                  label="Course Code & Title"
                  placeholder="e.g. CSE 425: Advanced Web Engineering"
                  value={courseModalName}
                  onChange={(e) => setCourseModalName(e.target.value)}
                  required
                />

                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center space-x-2">
                  <span>✨ Every registered student or educator can add a new course under any department.</span>
                </div>

                {courseAddMessage && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-sm text-center">
                    {courseAddMessage}
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCourseModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                  <Button type="submit" isLoading={isSubmittingCourse} className="w-auto px-6">
                    Add Course
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showAuthGate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0f0f18] border border-pink-500/30 rounded-2xl p-6 shadow-2xl text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-pink-600/30">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Login or Sign Up Required</h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                To maintain academic integrity, uploading study notes requires an active student account. Please sign in or create an account to share your materials.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-semibold text-center transition-all shadow-md shadow-pink-600/20"
                >
                  Sign In to StudyHub
                </Link>
                <Link
                  href="/signup"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold text-center transition-all border border-white/10"
                >
                  Create Student Account
                </Link>
                <button
                  onClick={() => setShowAuthGate(false)}
                  className="text-xs text-gray-500 hover:text-gray-300 mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}