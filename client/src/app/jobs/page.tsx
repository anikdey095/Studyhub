'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Building,
  CheckCircle,
  X,
  Sparkles,
  BookOpen,
  Rocket,
  GraduationCap,
  Calendar,
  Send,
  Plus,
  Compass,
  Filter,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';

interface CareerItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  description: string;
  deadline: string;
  category: 'Job' | 'Tuition' | 'Internship';
}

const FALLBACK_CAREERS: CareerItem[] = [
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
    id: 'car-6',
    title: 'Full-Stack Software Engineer (New Grad 2026)',
    company: 'Vercel / Next.js Team',
    location: 'San Francisco, CA / Remote',
    type: 'Job',
    salary: '$135k - $160k + Equity',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'React'],
    description: 'Build developer tooling, frontend frameworks, and edge delivery infrastructure.',
    deadline: 'May 30, 2026',
    category: 'Job',
  },
];

const LOCAL_AREAS = ['All Areas', 'Dhanmondi', 'Uttara', 'Gulshan / Banani', 'Mirpur', 'Online / Remote'];
const MEDIUMS = ['All Mediums', 'Bangla Medium', 'English Version', 'Cambridge / Edexcel'];

export default function JobsPage() {
  const { user } = useAuth();
  const [careers, setCareers] = useState<CareerItem[]>(FALLBACK_CAREERS);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Job' | 'Tuition' | 'Internship'>('All');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedMedium, setSelectedMedium] = useState('All Mediums');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CareerItem | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Post Tuition Modal State
  const [isPostTuitionOpen, setIsPostTuitionOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postLocation, setPostLocation] = useState('Dhanmondi, Dhaka');
  const [postSalary, setPostSalary] = useState('8,000 BDT / month (3 days/wk)');
  const [postTags, setPostTags] = useState('Bangla Medium, Class 9, General Science');
  const [postDesc, setPostDesc] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Form State
  const [applicantNote, setApplicantNote] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantUni, setApplicantUni] = useState(user?.university || '');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/careers`);
        if (res.data?.careers && res.data.careers.length > 0) {
          setCareers(res.data.careers);
        }
      } catch {
        // Fallback to initial careers
      }
    };
    fetchCareers();
  }, []);

  const filteredCareers = careers.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea =
      activeCategory !== 'Tuition' ||
      selectedArea === 'All Areas' ||
      item.location.toLowerCase().includes(selectedArea.split(' ')[0].toLowerCase());

    const matchesMedium =
      activeCategory !== 'Tuition' ||
      selectedMedium === 'All Mediums' ||
      item.tags.some((t) => t.toLowerCase().includes(selectedMedium.toLowerCase()));

    return matchesCategory && matchesQuery && matchesArea && matchesMedium;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsApplying(true);

    setTimeout(() => {
      setAppliedIds([...appliedIds, selectedItem.id]);
      setIsApplying(false);
      setApplicationSuccess(true);
      setTimeout(() => {
        setApplicationSuccess(false);
        setSelectedItem(null);
        setApplicantNote('');
        setApplicantPhone('');
      }, 1500);
    }, 600);
  };

  const handlePostTuitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPost(true);

    const newTuition: CareerItem = {
      id: `car-loc-${Date.now()}`,
      title: postTitle,
      company: user?.name ? `Guardian (${user.name})` : 'Direct Guardian',
      location: postLocation,
      type: 'Tuition',
      salary: postSalary,
      tags: postTags.split(',').map((t) => t.trim()).filter(Boolean),
      description: postDesc,
      deadline: 'Urgent Hire',
      category: 'Tuition',
    };

    try {
      await axios.post(`${API_URL}/api/admin/careers`, newTuition);
    } catch {
      // Local state fallback
    }

    setCareers([newTuition, ...careers]);
    setIsSubmittingPost(false);
    setPostSuccess(true);

    setTimeout(() => {
      setPostSuccess(false);
      setIsPostTuitionOpen(false);
      setPostTitle('');
      setPostDesc('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
              <Sparkles className="w-4 h-4" />
              <span>Opportunities Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Jobs, Local Tuition & Internship Programs
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Discover campus jobs, earn through local home & online private tuition, or land frontier tech internships.
            </p>
          </div>

          <button
            onClick={() => setIsPostTuitionOpen(true)}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Tuition Requirement</span>
          </button>
        </div>

        {/* Primary Pillar Tabs: All, Jobs, Tuition, Internships */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
          {[
            { id: 'All', label: 'All Opportunities', count: careers.length, icon: Sparkles },
            {
              id: 'Tuition',
              label: '📚 Local Tuition & Tutors',
              count: careers.filter((c) => c.category === 'Tuition').length,
              icon: BookOpen,
            },
            {
              id: 'Job',
              label: '💼 Jobs & Campus Roles',
              count: careers.filter((c) => c.category === 'Job').length,
              icon: Briefcase,
            },
            {
              id: 'Internship',
              label: '🚀 Internship Programs',
              count: careers.filter((c) => c.category === 'Internship').length,
              icon: Rocket,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/40 border-pink-500/50 shadow-lg shadow-pink-900/20 text-white'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-pink-400' : 'text-gray-400'}`} />
                    <span className="text-sm font-bold text-white">{tab.label}</span>
                  </div>
                  <p className="text-xs text-gray-400">{tab.count} Listings available</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dedicated Local Student Tuition Sub-Filters */}
        {activeCategory === 'Tuition' && (
          <div className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Compass className="w-4 h-4" />
                <span>Local Student Tuition Filter (Bangladesh & Online)</span>
              </div>
              <span className="text-xs text-gray-400">
                {filteredCareers.length} Tuitions Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" /> Target Area / District
                </label>
                <div className="flex flex-wrap gap-2">
                  {LOCAL_AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedArea === area
                          ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-pink-400" /> Curriculum & Medium
                </label>
                <div className="flex flex-wrap gap-2">
                  {MEDIUMS.map((med) => (
                    <button
                      key={med}
                      onClick={() => setSelectedMedium(med)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedMedium === med
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                    >
                      {med}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role title, subject (e.g. Higher Math, Physics, Chemistry, C++), area, or company..."
            className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20"
          />
        </div>

        {/* Career / Tuition / Internship Cards */}
        <div className="space-y-4">
          {filteredCareers.map((item) => {
            const hasApplied = appliedIds.includes(item.id);
            const isTuition = item.category === 'Tuition';
            const isInternship = item.category === 'Internship';

            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                        isTuition
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : isInternship
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {isTuition ? '📚 Local Student Tuition' : isInternship ? '🚀 Internship Program' : '💼 Job Opportunity'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" /> Deadline: {item.deadline}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white hover:text-pink-300 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                    <span className="flex items-center text-gray-200 font-semibold">
                      <Building className="w-3.5 h-3.5 mr-1 text-purple-400" />
                      {item.company}
                    </span>
                    <span className="flex items-center text-gray-400">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                      {item.salary}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2 pt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] text-gray-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 min-w-[170px]">
                  <button
                    disabled={hasApplied}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                      hasApplied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                        : isTuition
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold shadow-amber-500/20'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-pink-600/20'
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isTuition ? 'Apply as Tutor' : isInternship ? 'Apply for Internship' : 'Quick Apply'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredCareers.length === 0 && (
            <div className="text-center py-16 bg-white/[0.01] border border-white/10 rounded-2xl">
              <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No opportunities match your filter</h3>
              <p className="text-xs text-gray-500 mt-1">Try changing your search terms or location filters.</p>
            </div>
          )}
        </div>

        {/* Post Tuition Requirement Modal */}
        {isPostTuitionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0f0f18] border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white">Post Local Tuition Requirement</h3>
                  <p className="text-xs text-amber-400">Find verified university tutors for your child or yourself</p>
                </div>
                <button
                  onClick={() => setIsPostTuitionOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {postSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-white">Tuition Requirement Posted!</h4>
                  <p className="text-xs text-gray-400">
                    Your listing is now live on the Local Student Tuition Board. Eligible university tutors can apply immediately.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePostTuitionSubmit} className="space-y-4 mt-4">
                  <InputField
                    id="post-title"
                    name="title"
                    label="Tuition Subject & Class"
                    placeholder="e.g. Class 10 Higher Math & Physics Home Tutor"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      id="post-location"
                      name="location"
                      label="Area / District"
                      placeholder="e.g. Dhanmondi, Dhaka"
                      value={postLocation}
                      onChange={(e) => setPostLocation(e.target.value)}
                      required
                    />
                    <InputField
                      id="post-salary"
                      name="salary"
                      label="Offered Remuneration"
                      placeholder="e.g. 8,500 BDT / mo (3 days/wk)"
                      value={postSalary}
                      onChange={(e) => setPostSalary(e.target.value)}
                      required
                    />
                  </div>

                  <InputField
                    id="post-tags"
                    name="tags"
                    label="Medium & Subjects (comma separated)"
                    placeholder="e.g. English Version, SSC 2026, Higher Math"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Requirements & Preferred Tutor
                    </label>
                    <textarea
                      rows={3}
                      value={postDesc}
                      onChange={(e) => setPostDesc(e.target.value)}
                      placeholder="e.g. BUET or DU student preferred, 3 days a week, 1.5 hours per session..."
                      className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPostTuitionOpen(false)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <Button type="submit" isLoading={isSubmittingPost} className="w-auto px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold">
                      Publish Tuition
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Application / Tutor Apply Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0f0f18] border border-white/15 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedItem.category === 'Tuition' ? 'Apply as University Tutor' : 'Submit Application'}
                  </h3>
                  <p className="text-xs text-pink-400">{selectedItem.title} • {selectedItem.salary}</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {applicationSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-white">Application Successfully Submitted!</h4>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Your credentials have been delivered to the guardian / provider. You will be contacted shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4 mt-4">
                  <InputField
                    id="applicant-name"
                    name="name"
                    label="Applicant / Tutor Name"
                    defaultValue={user?.name || 'Dr. John Doe'}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      id="applicant-email"
                      name="email"
                      label="Email Address"
                      type="email"
                      defaultValue={user?.email || 'tutor@university.edu'}
                      required
                    />
                    <InputField
                      id="applicant-phone"
                      name="phone"
                      label="Phone / WhatsApp"
                      placeholder="e.g. 01712-345678"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      required
                    />
                  </div>

                  <InputField
                    id="applicant-uni"
                    name="university"
                    label="Current University & Department"
                    placeholder="e.g. BUET CSE / Dhaka University Physics"
                    value={applicantUni}
                    onChange={(e) => setApplicantUni(e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      {selectedItem.category === 'Tuition'
                        ? 'Relevant Experience / HSC GPA / Subject Expertise'
                        : 'Cover Letter / Key Highlights'}
                    </label>
                    <textarea
                      rows={3}
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      placeholder={
                        selectedItem.category === 'Tuition'
                          ? 'Mention your HSC college, GPA 5.00, past tutoring track record, and days available...'
                          : 'Mention your GPA, technical projects, or relevant experience...'
                      }
                      className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <Button type="submit" isLoading={isApplying} className="w-auto px-6">
                      {selectedItem.category === 'Tuition' ? 'Send Tutor Profile' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}