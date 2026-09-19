'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldAlert,
  BookOpen,
  FileText,
  Briefcase,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  Sparkles,
  Search,
  Lock,
  GraduationCap,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'research' | 'notes'>('overview');
  const [adminKey, setAdminKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Dynamic lists from server
  const [careers, setCareers] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Career Form (Job / Tuition / Internship)
  const [careerTitle, setCareerTitle] = useState('');
  const [careerCompany, setCareerCompany] = useState('');
  const [careerCategory, setCareerCategory] = useState<'Job' | 'Tuition' | 'Internship'>('Job');
  const [careerSalary, setCareerSalary] = useState('');
  const [careerLocation, setCareerLocation] = useState('');
  const [careerTags, setCareerTags] = useState('');
  const [careerDesc, setCareerDesc] = useState('');

  // Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCourse, setNoteCourse] = useState('');
  const [noteDept, setNoteDept] = useState('Computer Science');
  const [noteUrl, setNoteUrl] = useState('');

  // Research Form
  const [paperTitle, setPaperTitle] = useState('');
  const [paperAuthors, setPaperAuthors] = useState('');
  const [paperField, setPaperField] = useState('AI & Robotics');
  const [paperAbstract, setPaperAbstract] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [careersRes, notesRes, researchRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/careers`),
        axios.get(`${API_URL}/api/notes`),
        axios.get(`${API_URL}/api/admin/research`),
      ]);
      setCareers(careersRes.data.careers || []);
      setNotes(notesRes.data.notes || []);
      setPapers(researchRes.data.papers || []);
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' || user?.email?.includes('admin')) {
      setIsUnlocked(true);
    }
    fetchData();
  }, [user]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'admin123' || adminKey === 'studyhub2026' || user?.role === 'admin') {
      setIsUnlocked(true);
      setNotification('Admin access granted!');
      setTimeout(() => setNotification(''), 2000);
    } else {
      alert('Incorrect Admin Passkey. Hint: admin123');
    }
  };

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/admin/careers`, {
        title: careerTitle,
        company: careerCompany,
        category: careerCategory,
        salary: careerSalary || (careerCategory === 'Tuition' ? '$35 - $50 / hr' : '$50k - $80k'),
        location: careerLocation || 'Remote / Hybrid',
        tags: careerTags.split(',').map((t) => t.trim()),
        description: careerDesc,
        deadline: 'Rolling Admission',
      });
      if (res.data?.item) {
        setCareers([res.data.item, ...careers]);
        setNotification(`Created new ${careerCategory} successfully!`);
        setTimeout(() => setNotification(''), 2500);
        setCareerTitle('');
        setCareerCompany('');
        setCareerSalary('');
        setCareerLocation('');
        setCareerTags('');
        setCareerDesc('');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create listing');
    }
  };

  const handleDeleteCareer = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/admin/careers/${id}`);
      setCareers(careers.filter((c) => c.id !== id));
      setNotification('Listing removed.');
      setTimeout(() => setNotification(''), 2000);
    } catch (err) {
      alert('Error deleting career item');
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/notes`, {
        title: noteTitle,
        courseName: noteCourse,
        departmentName: noteDept,
        fileUrl: noteUrl || 'https://example.com/admin-note.pdf',
        description: `Verified course notes added by Administrator.`,
        authorName: 'StudyHub Admin Team',
      });
      if (res.data?.note) {
        setNotes([res.data.note, ...notes]);
        setNotification('Study note published!');
        setTimeout(() => setNotification(''), 2500);
        setNoteTitle('');
        setNoteCourse('');
        setNoteUrl('');
      }
    } catch (err) {
      alert('Error creating note');
    }
  };

  const handleCreatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/admin/research`, {
        title: paperTitle,
        abstract: paperAbstract,
        field: paperField,
        authors: paperAuthors.split(',').map((a) => a.trim()),
        institution: 'StudyHub Open Lab',
      });
      if (res.data?.paper) {
        setPapers([res.data.paper, ...papers]);
        setNotification('Research preprint published!');
        setTimeout(() => setNotification(''), 2500);
        setPaperTitle('');
        setPaperAuthors('');
        setPaperAbstract('');
      }
    } catch (err) {
      alert('Error creating paper');
    }
  };

  const handleDeletePaper = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/admin/research/${id}`);
      setPapers(papers.filter((p) => p.id !== id));
      setNotification('Paper deleted.');
      setTimeout(() => setNotification(''), 2000);
    } catch (err) {
      alert('Error deleting paper');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#0a0a0f]">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/[0.04] border border-white/10 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">StudyHub Admin Gateway</h2>
          <p className="text-xs text-gray-400 mt-2 mb-6">
            Enter the admin passkey or log in with an administrator account to update platform content dynamically.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <InputField
              id="admin-key"
              name="adminKey"
              label="Master Admin Passkey"
              type="password"
              placeholder="Enter admin123"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Authenticate Admin
            </Button>
          </form>

          <p className="text-[11px] text-gray-500 mt-4">
            Authorized administrator access for StudyHub platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Management Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Dynamic Platform Control Center
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Add, update, or remove study notes, research papers, jobs, tuition listings, and internship programs in real-time.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="self-start md:self-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold flex items-center space-x-1.5 text-gray-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Content</span>
          </button>
        </div>

        {notification && (
          <div className="my-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 my-8 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: Sparkles },
            { id: 'careers', label: 'Jobs, Tuition & Internships', icon: Briefcase },
            { id: 'notes', label: 'Study Notes', icon: BookOpen },
            { id: 'research', label: 'Research Preprints', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xs text-gray-400 uppercase font-bold">Total Careers & Tuition</p>
                <p className="text-3xl font-black text-white mt-1">{careers.length}</p>
                <p className="text-xs text-purple-400 mt-1">Active listings</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xs text-gray-400 uppercase font-bold">Total Study Notes</p>
                <p className="text-3xl font-black text-white mt-1">{notes.length}</p>
                <p className="text-xs text-pink-400 mt-1">Available in library</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xs text-gray-400 uppercase font-bold">Research Papers</p>
                <p className="text-3xl font-black text-white mt-1">{papers.length}</p>
                <p className="text-xs text-blue-400 mt-1">Published preprints</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xs text-gray-400 uppercase font-bold">Database Status</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">Active & Synced</p>
                <p className="text-xs text-gray-500 mt-1">PostgreSQL + Local Cache</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white">Administrator Instructions</h3>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                Use the tabs above to post new <strong>Jobs</strong>, <strong>Tuition / Tutoring openings</strong>, and <strong>Internship Programs</strong>. Any additions made here instantly show up on the public <code>/jobs</code> and <code>/study</code> pages for all users!
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: CAREERS, TUITION & INTERNSHIPS */}
        {activeTab === 'careers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Form */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 lg:col-span-1 h-fit">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-pink-500" />
                <span>Post Job / Tuition / Internship</span>
              </h3>

              <form onSubmit={handleCreateCareer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
                  <select
                    value={careerCategory}
                    onChange={(e) => setCareerCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Job">💼 Job Opportunity (Full / Part Time)</option>
                    <option value="Tuition">📚 Tuition / Private Tutoring</option>
                    <option value="Internship">🚀 Internship Program</option>
                  </select>
                </div>

                <InputField
                  id="car-title"
                  name="title"
                  label="Title / Subject"
                  placeholder={
                    careerCategory === 'Tuition'
                      ? 'e.g. Calculus & Linear Algebra Tutor'
                      : 'e.g. Software Engineering Intern'
                  }
                  value={careerTitle}
                  onChange={(e) => setCareerTitle(e.target.value)}
                  required
                />

                <InputField
                  id="car-company"
                  name="company"
                  label={careerCategory === 'Tuition' ? 'Tutor Name / Academy' : 'Company / Organization'}
                  placeholder="e.g. Stanford Tutors / Google / Cloudflare"
                  value={careerCompany}
                  onChange={(e) => setCareerCompany(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    id="car-salary"
                    name="salary"
                    label="Rate / Salary"
                    placeholder="e.g. $40/hr or $60k"
                    value={careerSalary}
                    onChange={(e) => setCareerSalary(e.target.value)}
                  />
                  <InputField
                    id="car-location"
                    name="location"
                    label="Location"
                    placeholder="e.g. Remote / Campus"
                    value={careerLocation}
                    onChange={(e) => setCareerLocation(e.target.value)}
                  />
                </div>

                <InputField
                  id="car-tags"
                  name="tags"
                  label="Keywords (comma separated)"
                  placeholder="e.g. Math, Python, High School"
                  value={careerTags}
                  onChange={(e) => setCareerTags(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={careerDesc}
                    onChange={(e) => setCareerDesc(e.target.value)}
                    placeholder="Details about responsibilities, syllabus, or requirements..."
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Publish to Platform
                </Button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">
                Active Listings ({careers.length})
              </h3>
              {careers.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-4 hover:border-pink-500/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.category === 'Tuition'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : c.category === 'Internship'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {c.category || c.type}
                      </span>
                      <span className="text-xs text-gray-400">{c.company}</span>
                      <span className="text-xs text-emerald-400 font-semibold">• {c.salary}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{c.description}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteCareer(c.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDY NOTES */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 lg:col-span-1 h-fit">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-purple-500" />
                <span>Upload New Note</span>
              </h3>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <InputField
                  id="admin-note-title"
                  name="title"
                  label="Note Title"
                  placeholder="e.g. Advanced Operating Systems"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required
                />
                <InputField
                  id="admin-note-course"
                  name="course"
                  label="Course Code"
                  placeholder="e.g. CS301"
                  value={noteCourse}
                  onChange={(e) => setNoteCourse(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Department</label>
                  <select
                    value={noteDept}
                    onChange={(e) => setNoteDept(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Chemistry & Biology">Chemistry & Biology</option>
                    <option value="Business & Economics">Business & Economics</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                <InputField
                  id="admin-note-url"
                  name="url"
                  label="PDF / Resource Link"
                  placeholder="https://example.com/note.pdf"
                  value={noteUrl}
                  onChange={(e) => setNoteUrl(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Publish Note
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-lg font-bold text-white mb-2">Existing Notes ({notes.length})</h3>
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {n.department || 'General'}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{n.title}</h4>
                    <p className="text-xs text-gray-400">By {n.author} • {n.downloads || 0} downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESEARCH PAPERS */}
        {activeTab === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 lg:col-span-1 h-fit">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-500" />
                <span>Publish Research Preprint</span>
              </h3>
              <form onSubmit={handleCreatePaper} className="space-y-4">
                <InputField
                  id="paper-title-admin"
                  name="title"
                  label="Paper Title"
                  placeholder="e.g. Graph Neural Networks for Quantum Decoherence"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  required
                />
                <InputField
                  id="paper-authors-admin"
                  name="authors"
                  label="Authors"
                  placeholder="e.g. Dr. Alex Vance, Maria Smith"
                  value={paperAuthors}
                  onChange={(e) => setPaperAuthors(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Field</label>
                  <select
                    value={paperField}
                    onChange={(e) => setPaperField(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AI & Robotics">AI & Robotics</option>
                    <option value="Quantum Computing">Quantum Computing</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Abstract</label>
                  <textarea
                    rows={4}
                    value={paperAbstract}
                    onChange={(e) => setPaperAbstract(e.target.value)}
                    placeholder="Summary of research findings..."
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Publish Preprint
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Research Papers ({papers.length})</h3>
              {papers.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {p.field}
                    </span>
                    <h4 className="font-bold text-white text-base mt-1">{p.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.abstract}</p>
                    <p className="text-[11px] text-gray-500 mt-2">
                      Authors: {Array.isArray(p.authors) ? p.authors.join(', ') : p.authors}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePaper(p.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
