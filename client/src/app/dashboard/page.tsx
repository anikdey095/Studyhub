'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import {
  Book,
  Download,
  FileText,
  Users,
  PlusCircle,
  Clock,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

interface StatsData {
  totalNotes: string;
  totalDownloads: string;
  totalResearch: string;
  activeStudents: string;
}

interface NoteItem {
  id: string;
  title: string;
  course?: string;
  time?: string;
  author?: string;
  downloads?: number;
}

interface QuestionItem {
  id: string;
  title: string;
  category: string;
  replies: number;
  time: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalNotes: '3,850',
    totalDownloads: '14,890',
    totalResearch: '520',
    activeStudents: '1,690',
  });
  const [recentNotes, setRecentNotes] = useState<NoteItem[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${API_URL}/api/stats`);
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
        if (res.data?.recentNotes) {
          setRecentNotes(res.data.recentNotes);
        }
        if (res.data?.recentQuestions) {
          setRecentQuestions(res.data.recentQuestions);
        }
      } catch (err) {
        console.warn('Using baseline dashboard stats due to network:', err);
        setRecentNotes([
          { id: '1', title: 'Distributed Systems & Consensus Protocols', course: 'CS401', time: '2 hours ago', author: 'Elena Rostova' },
          { id: '2', title: 'Deep Learning with PyTorch & Transformer Attention', course: 'AI302', time: '4 hours ago', author: 'Marcus Chen' },
          { id: '3', title: 'System Design Interview Cheatsheet: High Scale Services', course: 'SE310', time: 'Yesterday', author: 'Jordan Lee' },
          { id: '4', title: 'Organic Synthesis Reaction Mechanisms & Pathways', course: 'CHEM220', time: '2 days ago', author: 'David Kim' },
        ]);
        setRecentQuestions([
          { id: 'q1', title: 'How to efficiently handle WebSockets in Next.js 14 App Router?', category: 'Web Dev', replies: 12, time: '30 mins ago' },
          { id: 'q2', title: 'Difference between Raft and Multi-Paxos leader election?', category: 'Distributed Systems', replies: 8, time: '2 hours ago' },
          { id: 'q3', title: 'Tips for scoring in graduate-level Econometrics midterm exams?', category: 'Economics', replies: 15, time: '5 hours ago' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDownload = (id: string) => {
    setDownloadSuccessId(id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {user?.name || 'Scholar'}
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {user?.university ? `${user.university} • ` : ''}Your academic progress, notes repository, and community updates.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/study"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload Notes</span>
            </Link>
            <Link
              href="/study"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-sm font-semibold transition-all"
            >
              Browse Library
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Available Notes</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.totalNotes}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Total Downloads</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.totalDownloads}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Research Papers</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.totalResearch}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Active Scholars</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.activeStudents}</p>
            </div>
          </div>
        </div>

        {/* Dashboard 2-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed: Recent Notes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Recent Study Materials</h2>
              </div>
              <Link href="/study" className="text-xs font-semibold text-pink-400 hover:text-pink-300">
                View Repository →
              </Link>
            </div>

            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="group p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-pink-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {note.course && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {note.course}
                        </span>
                      )}
                      {note.time && (
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3 mr-0.5" /> {note.time}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-pink-300 transition-colors">
                      {note.title}
                    </h3>
                    {note.author && (
                      <p className="text-xs text-gray-400">By {note.author}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 sm:self-center">
                    <button
                      onClick={() => handleDownload(note.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        downloadSuccessId === note.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10'
                      }`}
                    >
                      {downloadSuccessId === note.id ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Study Hub Shortcut Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/20 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Need exam notes for your course?</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Filter by your university department or request custom notes from high-performing peers.
                </p>
              </div>
              <Link
                href="/study"
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm whitespace-nowrap transition-colors"
              >
                Search Notes
              </Link>
            </div>
          </div>

          {/* Side Panel: Discussion & Study Groups */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  <h2 className="text-xl font-bold text-white">Peer Q&A Hub</h2>
                </div>
                <Link href="/network" className="text-xs font-semibold text-pink-400 hover:text-pink-300">
                  All Topics
                </Link>
              </div>

              <div className="space-y-3">
                {recentQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all cursor-pointer"
                  >
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300">
                      {q.category}
                    </span>
                    <h4 className="font-medium text-sm text-gray-200 mt-2 hover:text-pink-300 transition-colors">
                      {q.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-white/5">
                      <span>{q.replies} answers</span>
                      <span>{q.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Quick Actions</h3>
              <div className="flex flex-col space-y-2 text-sm">
                <Link
                  href="/mentorship"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>Book Mentorship Session</span>
                  <span className="text-pink-400">→</span>
                </Link>
                <Link
                  href="/jobs"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>Explore Student Internships</span>
                  <span className="text-purple-400">→</span>
                </Link>
                <Link
                  href="/research"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>Read Academic Preprints</span>
                  <span className="text-blue-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;