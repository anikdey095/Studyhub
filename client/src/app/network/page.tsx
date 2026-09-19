'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  UserPlus,
  Check,
  Radio,
  BookOpen,
  Sparkles,
  Award,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Student {
  id: string;
  name: string;
  university: string;
  major: string;
  year: string;
  interests: string[];
  avatarBg: string;
}

interface StudyGroup {
  id: string;
  title: string;
  subject: string;
  members: number;
  activeNow: number;
  tags: string[];
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    name: 'Elena Rostova',
    university: 'MIT',
    major: 'Computer Science',
    year: 'Senior',
    interests: ['Distributed Systems', 'Raft', 'Rust'],
    avatarBg: 'from-purple-500 to-indigo-500',
  },
  {
    id: 's-2',
    name: 'Marcus Chen',
    university: 'Stanford University',
    major: 'Artificial Intelligence',
    year: 'Graduate / MS',
    interests: ['Transformers', 'PyTorch', 'LLMs'],
    avatarBg: 'from-pink-500 to-rose-500',
  },
  {
    id: 's-3',
    name: 'Priya Sharma',
    university: 'UC Berkeley',
    major: 'Software Engineering',
    year: 'Junior',
    interests: ['Algorithms', 'System Design', 'Web3'],
    avatarBg: 'from-blue-500 to-cyan-500',
  },
  {
    id: 's-4',
    name: 'David Kim',
    university: 'Harvard University',
    major: 'Biochemistry & Pre-Med',
    year: 'Senior',
    interests: ['Organic Synthesis', 'MCAT Prep', 'Genetics'],
    avatarBg: 'from-emerald-500 to-teal-500',
  },
];

const STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'g-1',
    title: 'Distributed Systems & Cloud Architecture Circle',
    subject: 'Computer Science',
    members: 142,
    activeNow: 18,
    tags: ['CS401', 'Microservices', 'Raft'],
  },
  {
    id: 'g-2',
    title: 'NeurIPS & ICML Paper Reading Sprint',
    subject: 'AI & ML',
    members: 280,
    activeNow: 34,
    tags: ['Deep Learning', 'PyTorch', 'Research'],
  },
  {
    id: 'g-3',
    title: 'Daily LeetCode & FAANG Mock Interview Group',
    subject: 'Career & Algorithms',
    members: 510,
    activeNow: 42,
    tags: ['DSA', 'Interview Prep'],
  },
];

export default function NetworkPage() {
  const { user } = useAuth();
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(['g-1']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleConnect = (id: string) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter((item) => item !== id));
    } else {
      setConnectedIds([...connectedIds, id]);
    }
  };

  const toggleJoinGroup = (id: string) => {
    if (joinedGroupIds.includes(id)) {
      setJoinedGroupIds(joinedGroupIds.filter((item) => item !== id));
    } else {
      setJoinedGroupIds([...joinedGroupIds, id]);
    }
  };

  const filteredStudents = INITIAL_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 border-b border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
            <Users className="w-4 h-4" />
            <span>Global Scholar Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Peer Network & Study Circles</h1>
          <p className="text-sm text-gray-400 mt-1">
            Connect with top students, participate in virtual study rooms, and collaborate on shared course goals.
          </p>
        </div>

        {/* Live Study Rooms Section */}
        <div className="my-8">
          <div className="flex items-center space-x-2 mb-4">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white">Active Collaborative Study Circles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDY_GROUPS.map((g) => {
              const hasJoined = joinedGroupIds.includes(g.id);
              return (
                <div
                  key={g.id}
                  className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 flex flex-col justify-between hover:border-pink-500/30 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-purple-300 font-semibold">{g.subject}</span>
                      <span className="flex items-center text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                        {g.activeNow} Studying Now
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-1">{g.title}</h3>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {g.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-gray-400 border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{g.members} members</span>
                    <button
                      onClick={() => toggleJoinGroup(g.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        hasJoined
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md'
                      }`}
                    >
                      {hasJoined ? 'Joined' : 'Join Circle'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scholar Search & Directory */}
        <div className="my-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Find Students & Study Partners</h2>
              <p className="text-xs text-gray-400 mt-0.5">Filter by university, department, or research interest.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholars..."
                className="w-full pl-9 pr-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-pink-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStudents.map((s) => {
              const isConnected = connectedIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col items-center text-center shadow-lg"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${s.avatarBg} flex items-center justify-center text-xl font-black text-white shadow-lg mb-4`}
                  >
                    {s.name.charAt(0)}
                  </div>

                  <h3 className="font-bold text-white text-base">{s.name}</h3>
                  <p className="text-xs text-pink-400 font-medium mt-0.5">{s.university}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.major} ({s.year})</p>

                  <div className="flex flex-wrap gap-1 justify-center my-4">
                    {s.interests.map((int) => (
                      <span
                        key={int}
                        className="px-2 py-0.5 bg-white/5 text-[10px] text-gray-300 rounded border border-white/5"
                      >
                        {int}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => toggleConnect(s.id)}
                    className={`w-full mt-auto py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}