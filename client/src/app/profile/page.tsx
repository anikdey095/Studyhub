'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Camera,
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  Edit3,
  CheckCircle,
  Share2,
  BookOpen,
  FileText,
  Award,
  Sparkles,
  Download,
  Star,
  Globe,
  Github,
  Linkedin,
  X,
  Plus,
  Upload,
  Layers,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';

const COVER_PRESETS = [
  {
    name: 'Cosmic Deep Space',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'University Library',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Cyberpunk Neon',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Quantum Aurora',
    url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=1600&q=80',
  },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
];

export default function ProfilePage() {
  const { user, updateUser, isAuthenticated } = useAuth();

  // Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState(user?.name || 'Dr. John Doe');
  const [university, setUniversity] = useState(user?.university || 'Massachusetts Institute of Technology');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & AI (CSAIL)');
  const [year, setYear] = useState(user?.year || 'Graduate Researcher • Class of 2026');
  const [studentId, setStudentId] = useState(user?.studentId || 'MIT-CS-2026-904');
  const [bio, setBio] = useState(
    user?.bio ||
      'Focusing on scalable latent diffusion models, distributed consensus protocols, and open-source science education for students worldwide.'
  );
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || 'https://github.com/scholar');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || 'https://linkedin.com/in/scholar');
  const [activeTab, setActiveTab] = useState<'notes' | 'research' | 'tutoring'>('notes');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Sync inputs with user state when loaded
  React.useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.university) setUniversity(user.university);
      if (user.department) setDepartment(user.department);
      if (user.year) setYear(user.year);
      if (user.studentId) setStudentId(user.studentId);
      if (user.bio) setBio(user.bio);
      if (user.githubUrl) setGithubUrl(user.githubUrl);
      if (user.linkedinUrl) setLinkedinUrl(user.linkedinUrl);
    }
  }, [user]);

  // Direct File Inputs
  const coverFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const currentCover =
    user?.coverUrl ||
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80';

  const currentAvatar =
    user?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  // Handle Cover Photo Upload from File
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        updateUser({ coverUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Avatar Photo Upload from File
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        updateUser({ avatarUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      university,
      department,
      year,
      studentId,
      bio,
      githubUrl,
      linkedinUrl,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-gray-100 pb-16">
      {/* 1. COVER PHOTO BANNER */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-900 group">
        <img
          src={currentCover}
          alt="Student Profile Cover"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-black/40 to-transparent" />

        {/* Change Cover Buttons */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center space-x-2">
          <input
            ref={coverFileRef}
            type="file"
            accept="image/*"
            onChange={handleCoverFileUpload}
            className="hidden"
          />
          <button
            onClick={() => coverFileRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xl transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-pink-400" />
            <span>Upload Cover</span>
          </button>
          <button
            onClick={() => setIsCoverPickerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* 2. PROFILE HEADER & AVATAR SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32 pb-6 border-b border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Avatar & Main Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              {/* Profile Avatar with Camera Button */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-1 bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 shadow-2xl">
                  <img
                    src={currentAvatar}
                    alt={user?.name || 'Student Avatar'}
                    className="w-full h-full rounded-[22px] object-cover bg-[#0d0d18]"
                  />
                </div>

                <input
                  ref={avatarFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />

                {/* Change Avatar Quick Button */}
                <button
                  onClick={() => avatarFileRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white shadow-lg border border-white/20 transition-all hover:scale-110"
                  title="Upload profile picture from files"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Identity Details */}
              <div className="space-y-1.5 pt-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {user?.name || name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold text-[10px] border border-pink-500/30 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-pink-400" />
                    <span>Verified Student</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                    🟢 Active Scholar
                  </span>
                </div>

                <p className="text-sm font-semibold text-purple-300">
                  {user?.department || department} • {user?.university || university}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400">
                  <span className="flex items-center">
                    <GraduationCap className="w-3.5 h-3.5 mr-1 text-pink-400" />
                    {user?.year || year}
                  </span>
                  <span className="flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    ID: {user?.studentId || studentId}
                  </span>
                  <span className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {user?.email || 'scholar@university.edu'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-pink-600/20 transition-all hover:scale-105"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setIsAvatarPickerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-200 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Avatar Presets</span>
              </button>
            </div>
          </div>

          {/* Student Bio & Tags */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
              {user?.bio || bio}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 text-gray-400">
              <a
                href={user?.githubUrl || githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={user?.linkedinUrl || linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
              </a>
              <Link
                href="/ai"
                className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-semibold text-xs border border-pink-500/20 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Workspace</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. ACADEMIC METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          {[
            { label: 'Study Notes Uploaded', value: '18', sub: 'Top 5% Contributor', icon: BookOpen, color: 'text-pink-400' },
            { label: 'Total Downloads', value: '14,250', sub: 'Across 28 Universities', icon: Download, color: 'text-emerald-400' },
            { label: 'Research Preprints', value: '4', sub: '230 Citations', icon: FileText, color: 'text-purple-400' },
            { label: 'Tutoring Reputation', value: '4.98 ★', sub: '32 Hours Completed', icon: Star, color: 'text-amber-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] shadow-lg flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center shrink-0">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="text-xs font-semibold text-gray-300">{stat.label}</p>
                  <p className="text-[10px] text-gray-500">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. PROFILE CONTENT TABS */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-white/[0.08] pb-3">
            {[
              { id: 'notes', label: '📚 My Uploaded Notes (18)' },
              { id: 'research', label: '🔬 Research Publications (4)' },
              { id: 'tutoring', label: '🎓 Tutoring & Verified Badges' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notes Tab Content */}
          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Distributed Consensus & Raft Implementation Guide',
                  course: 'CS401 • MIT CSAIL',
                  downloads: '3,450 downloads',
                  rating: '5.0 ★',
                  format: 'PDF • 4.2 MB',
                },
                {
                  title: 'Advanced PyTorch Transformer Training Pipeline',
                  course: 'AI302 • Stanford',
                  downloads: '2,890 downloads',
                  rating: '4.9 ★',
                  format: 'PDF • 8.1 MB',
                },
                {
                  title: 'Organic Chemistry Synthesis & Reaction Mechanisms',
                  course: 'CHEM220 • Harvard',
                  downloads: '1,720 downloads',
                  rating: '4.8 ★',
                  format: 'PDF • 3.5 MB',
                },
                {
                  title: 'Graph Algorithms & LeetCode Hard Patterns',
                  course: 'CS201 • UC Berkeley',
                  downloads: '4,100 downloads',
                  rating: '5.0 ★',
                  format: 'PDF • 2.9 MB',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-pink-500/30 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white hover:text-pink-300 cursor-pointer">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.course} • {item.format}</p>
                    <p className="text-[11px] text-pink-400 font-semibold">{item.downloads} • {item.rating}</p>
                  </div>
                  <Link
                    href="/study"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Research Tab Content */}
          {activeTab === 'research' && (
            <div className="space-y-4">
              {[
                {
                  title: 'Scalable Latent Diffusion Models for High-Fidelity Video Synthesis',
                  venue: 'StudyHub Preprints • 2026',
                  doi: '10.1145/studyhub.2026.041',
                  citations: '115 citations',
                },
                {
                  title: 'Asynchronous Fault-Tolerant State Machine Replication Under Byzantine Partitions',
                  venue: 'MIT Distributed Systems Lab Review',
                  doi: '10.1145/studyhub.2026.019',
                  citations: '84 citations',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold text-xs">
                      {item.venue}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">{item.citations}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-gray-400 font-mono">DOI: {item.doi}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tutoring Tab Content */}
          {activeTab === 'tutoring' && (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
              <h4 className="text-base font-bold text-white">Verified Peer Tutor Credentials</h4>
              <p className="text-xs text-gray-400">
                This student profile has passed academic credentials verification. Certified to teach undergraduate Calculus, Programming, and Physics.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Calculus I & II Certified', 'C++ & Python Verified', 'HSC Higher Math GPA 5.00', 'Top 1% Peer Mentor'].map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0f0f1c] border border-white/15 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-pink-400" />
                Edit Student Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
              <InputField
                id="edit-name"
                name="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  id="edit-uni"
                  name="university"
                  label="University / Institution"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                />
                <InputField
                  id="edit-dept"
                  name="department"
                  label="Department / Major"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  id="edit-year"
                  name="year"
                  label="Academic Standing / Class"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
                <InputField
                  id="edit-id"
                  name="studentId"
                  label="Student ID / Roll"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Academic Bio & Research Interests
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/60"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  id="edit-github"
                  name="github"
                  label="GitHub Profile URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
                <InputField
                  id="edit-linkedin"
                  name="linkedin"
                  label="LinkedIn URL"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <Button type="submit" className="w-auto px-6">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COVER PHOTO PRESETS PICKER MODAL */}
      {isCoverPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0f0f1c] border border-white/15 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Choose Cover Photo Preset</h3>
              <button onClick={() => setIsCoverPickerOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {COVER_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    updateUser({ coverUrl: preset.url });
                    setIsCoverPickerOpen(false);
                  }}
                  className="group relative h-28 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-pink-500 transition-all"
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2.5">
                    <span className="text-[11px] font-bold text-white drop-shadow">{preset.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AVATAR PRESETS PICKER MODAL */}
      {isAvatarPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0f0f1c] border border-white/15 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Choose Scholar Avatar Preset</h3>
              <button onClick={() => setIsAvatarPickerOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {AVATAR_PRESETS.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    updateUser({ avatarUrl: url });
                    setIsAvatarPickerOpen(false);
                  }}
                  className="w-18 h-18 rounded-2xl overflow-hidden cursor-pointer border-2 border-white/10 hover:border-pink-500 hover:scale-105 transition-all"
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
