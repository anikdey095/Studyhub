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

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Artificial Intelligence',
  'Electrical Engineering',
  'Chemistry & Biology',
  'Business & Economics',
  'Mathematics & Physics',
];

export default function StudyPage() {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Upload Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newDepartment, setNewDepartment] = useState('Computer Science');
  const [newDescription, setNewDescription] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

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
      // Fallback initial dataset
      setNotes([
        {
          id: 'note-1',
          title: 'Distributed Systems & Microservices Architecture',
          description: 'Comprehensive study guide covering consensus algorithms (Raft, Paxos), CAP theorem, and event sourcing.',
          course: 'CS401',
          department: 'Computer Science',
          university: 'MIT',
          author: 'Elena Rostova',
          fileUrl: 'https://example.com/notes/distributed-systems.pdf',
          downloads: 1420,
          rating: 4.9,
          tags: ['Distributed Systems', 'Backend'],
        },
        {
          id: 'note-2',
          title: 'Deep Learning with PyTorch & Transformer Models',
          description: 'Lecture summaries, mathematical derivations of self-attention mechanisms, and complete hands-on PyTorch training pipelines.',
          course: 'AI302',
          department: 'Artificial Intelligence',
          university: 'Stanford',
          author: 'Marcus Chen',
          fileUrl: 'https://example.com/notes/deep-learning.pdf',
          downloads: 3150,
          rating: 5.0,
          tags: ['AI', 'Transformers'],
        },
        {
          id: 'note-3',
          title: 'Data Structures & Algorithms: LeetCode Patterns',
          description: 'Systematic breakdown of two pointers, sliding window, topological sort, and dynamic programming patterns.',
          course: 'CS201',
          department: 'Computer Science',
          university: 'UC Berkeley',
          author: 'Priya Sharma',
          fileUrl: 'https://example.com/notes/dsa.pdf',
          downloads: 2890,
          rating: 4.8,
          tags: ['DSA', 'LeetCode'],
        },
        {
          id: 'note-4',
          title: 'Organic Chemistry II: Reaction Mechanisms & Synthesis',
          description: 'Complete synthesis pathways, nucleophilic additions, electrophilic substitutions, and spectral analysis tips.',
          course: 'CHEM220',
          department: 'Chemistry & Biology',
          university: 'Harvard University',
          author: 'David Kim',
          fileUrl: 'https://example.com/notes/orgo.pdf',
          downloads: 870,
          rating: 4.7,
          tags: ['Chemistry', 'Synthesis'],
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
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
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

      const res = await axios.post(`${API_URL}/api/notes`, {
        title: newTitle,
        description: newDescription,
        courseName: newCourse || 'General',
        departmentName: newDepartment,
        fileUrl: uploadedFileUrl || 'https://example.com/uploaded-note.pdf',
        authorName: user?.name || 'Student Contributor',
      });

      if (res.data?.note) {
        setNotes([res.data.note, ...notes]);
      }
      setUploadMessage('🎉 Note and file uploaded successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setNewTitle('');
        setNewCourse('');
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

          <button
            onClick={() => {
              if (!isAuthenticated) {
                setShowAuthGate(true);
              } else {
                setIsModalOpen(true);
              }
            }}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Study Note</span>
          </button>
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
            {DEPARTMENTS.map((dept) => (
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

                  <h3 className="font-bold text-lg text-white group-hover:text-pink-300 transition-colors line-clamp-2">
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

                  <button
                    onClick={() => handleDownload(note.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      downloadSuccessId === note.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-pink-600/20 hover:bg-pink-600 hover:text-white text-pink-300 border border-pink-500/30'
                    }`}
                  >
                    {downloadSuccessId === note.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Downloaded</span>
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

                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    id="note-course"
                    name="course"
                    label="Course Code"
                    placeholder="e.g. CS401"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Department
                    </label>
                    <select
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {DEPARTMENTS.filter((d) => d !== 'All').map((d) => (
                        <option key={d} value={d} className="bg-[#0f0f18]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
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

        {/* Auth Gate Modal */}
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