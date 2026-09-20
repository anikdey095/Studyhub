'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  Download,
  Star,
  Users,
  Award,
  FileCheck,
  Briefcase,
  GraduationCap,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const FEATURED_NOTES = [
  {
    id: 'note-1',
    title: 'Distributed Systems & Microservices Architecture',
    desc: 'Consensus protocols, Raft, CAP theorem, and event-driven architectures with real-world diagrams.',
    category: 'Computer Science & Engineering',
    university: 'MIT / Berkeley',
    downloads: '1.4k',
    rating: '4.9',
    author: 'Elena Rostova',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    id: 'note-2',
    title: 'Enterprise Software Architecture & Design Patterns',
    desc: 'Clean Architecture, Domain-Driven Design (DDD), SOLID principles, and microkernel patterns.',
    category: 'Software Engineering',
    university: 'Stanford SE Lab',
    downloads: '2.8k',
    rating: '5.0',
    author: 'Marcus Chen',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'note-3',
    title: 'Deep Learning Architectures & Transformer Foundations',
    desc: 'Mathematical foundations of self-attention mechanisms, multi-head attention, and PyTorch pipelines.',
    category: 'Data Science',
    university: 'Oxford Data Institute',
    downloads: '3.1k',
    rating: '4.95',
    author: 'Kavita Sengupta',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
];

const CATEGORIES = [
  { name: 'Computer Science & Engineering', count: '1,450 Notes', icon: '💻', href: '/study?cat=Computer Science & Engineering' },
  { name: 'Software Engineering', count: '1,120 Notes', icon: '⚙️', href: '/study?cat=Software Engineering' },
  { name: 'English', count: '890 Notes', icon: '📚', href: '/study?cat=English' },
  { name: 'Electrical Engineering', count: '980 Notes', icon: '⚡', href: '/study?cat=Electrical Engineering' },
  { name: 'Economics', count: '820 Notes', icon: '📈', href: '/study?cat=Economics' },
  { name: 'Data Science', count: '1,340 Notes', icon: '🧠', href: '/study?cat=Data Science' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/study?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/study');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-hidden">
      {/* Background ambient glow circles */}
      <div className="relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-80 right-10 w-[400px] h-[300px] bg-blue-600/10 blur-[100px] pointer-events-none -z-10" />

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-pink-300 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Over 15,000+ Verified Academic Notes & Research Papers</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            Supercharge Your Learning with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
              Peer Intelligence.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Access curated lecture notes, peer-reviewed research, verified exam summaries, and 1-on-1 mentorship from top university students worldwide.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
            <div className="relative flex items-center p-2 rounded-2xl bg-white/5 border border-white/15 shadow-2xl backdrop-blur-xl focus-within:border-pink-500/70 focus-within:ring-2 focus-within:ring-pink-500/20 transition-all duration-300">
              <Search className="w-6 h-6 text-gray-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject, course code, university, or topic (e.g. CS401, Linear Algebra)..."
                className="w-full bg-transparent px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-pink-600/20 whitespace-nowrap"
              >
                Search Notes
              </button>
            </div>
          </form>

          {/* Quick subject pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
            <span className="text-gray-500">Popular:</span>
            {['Distributed Systems', 'PyTorch', 'Data Structures', 'Organic Chemistry', 'Econometrics'].map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/study?q=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/study"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] transition-all"
            >
              <span>Explore Study Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 font-semibold transition-all"
            >
              Join Student Community
            </Link>
          </div>
        </section>

        {/* METRICS STRIP */}
        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  15,000+
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Study Notes & Guides</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                  120+
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Universities Represented</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
                  85,000+
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Resource Downloads</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  4.9 / 5.0
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Average Note Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* BROWSE BY ACADEMIC DISCIPLINE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-pink-400 uppercase">Disciplines</h2>
              <p className="text-3xl font-extrabold text-white mt-1">Explore By Department</p>
            </div>
            <Link
              href="/study"
              className="mt-4 md:mt-0 text-sm font-semibold text-pink-400 hover:text-pink-300 flex items-center group"
            >
              View all departments <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 hover:bg-white/[0.06] transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="font-semibold text-sm text-white group-hover:text-pink-300 transition-colors">
                  {cat.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{cat.count}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED STUDY NOTES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-widest text-purple-400 uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending Resources</span>
              </div>
              <p className="text-3xl font-extrabold text-white mt-1">Top Rated Study Materials</p>
            </div>
            <Link
              href="/study"
              className="mt-4 md:mt-0 text-sm font-semibold text-pink-400 hover:text-pink-300 flex items-center group"
            >
              Browse all notes <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_NOTES.map((note) => (
              <div
                key={note.id}
                className="group relative rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 flex flex-col justify-between hover:border-pink-500/40 transition-all duration-300 shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                      {note.category}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{note.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {note.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <div>
                    <span className="text-gray-300 font-medium block">{note.author}</span>
                    <span className="text-gray-500">{note.university}</span>
                  </div>
                  <Link
                    href={`/study`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-pink-600/20 text-pink-300 hover:bg-pink-600 hover:text-white transition-all font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{note.downloads}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CORE PLATFORM PILLARS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-pink-400 uppercase">Built For High Performers</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything You Need To Excel Academically
            </p>
            <p className="text-gray-400 text-base mt-4">
              From collaborative note-taking and peer research to exclusive career internships and 1-on-1 mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Verified Course Notes</h3>
              <p className="text-sm text-gray-400">
                Peer-reviewed lecture notes, exam problem sets, and syllabus breakdowns from top universities.
              </p>
              <Link href="/study" className="inline-flex items-center text-xs font-semibold text-purple-400 mt-4 hover:underline">
                Explore Notes <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Academic Research</h3>
              <p className="text-sm text-gray-400">
                Discover student preprints, undergraduate thesis papers, and collaborate on cutting-edge lab publications.
              </p>
              <Link href="/research" className="inline-flex items-center text-xs font-semibold text-pink-400 mt-4 hover:underline">
                Browse Research <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Tech & Campus Jobs</h3>
              <p className="text-sm text-gray-400">
                Exclusive internship listings, research assistant opportunities, and graduate job boards tailored to students.
              </p>
              <Link href="/jobs" className="inline-flex items-center text-xs font-semibold text-blue-400 mt-4 hover:underline">
                View Open Roles <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">1-on-1 Mentorship</h3>
              <p className="text-sm text-gray-400">
                Connect with upperclassmen, PhD candidates, and industry alumni for mock interviews and academic guidance.
              </p>
              <Link href="/mentorship" className="inline-flex items-center text-xs font-semibold text-emerald-400 mt-4 hover:underline">
                Find Mentors <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-slate-900/80 border border-white/15 p-8 sm:p-14 text-center">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-2xl mx-auto">
              Ready to elevate your academic journey?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mt-4">
              Join thousands of scholars sharing notes, finding mentors, and accelerating their careers on StudyHub today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-xl shadow-pink-600/30 transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/study"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/10 transition-all"
              >
                Explore Repository
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-[#08080c] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-pink-500" />
              <span className="text-white font-bold">StudyHub Platform</span>
              <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-xs sm:text-sm">
              <Link href="/study" className="hover:text-white transition-colors">Notes</Link>
              <Link href="/research" className="hover:text-white transition-colors">Research</Link>
              <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
              <Link href="/network" className="hover:text-white transition-colors">Network</Link>
              <Link href="/mentorship" className="hover:text-white transition-colors">Mentorship</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}