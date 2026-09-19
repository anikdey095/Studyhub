'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Search,
  MessageCircle,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';

interface Mentor {
  id: string;
  name: string;
  role: string;
  organization: string;
  alumni: string;
  rating: number;
  reviews: number;
  sessionsCompleted: number;
  rate: string;
  bio: string;
  specialties: string[];
  avatarGradient: string;
  category: string;
}

const MENTORS_DATA: Mentor[] = [
  {
    id: 'm-1',
    name: 'Dr. Aris Thorne',
    role: 'Staff Quantum Scientist',
    organization: 'MIT Quantum Lab / Google Quantum',
    alumni: 'MIT PhD \'23',
    rating: 5.0,
    reviews: 64,
    sessionsCompleted: 142,
    rate: 'Free for Students',
    bio: 'Guiding undergraduate and master students preparing for competitive PhD applications and quantum algorithms research.',
    specialties: ['Quantum Computing', 'Graduate Admissions', 'Physics'],
    avatarGradient: 'from-purple-600 to-indigo-600',
    category: 'Academics',
  },
  {
    id: 'm-2',
    name: 'Samantha Wei',
    role: 'Senior Software Engineer',
    organization: 'Stripe',
    alumni: 'UC Berkeley CS \'21',
    rating: 4.95,
    reviews: 88,
    sessionsCompleted: 215,
    rate: '$35 / hr',
    bio: 'Ex-Meta, ex-Uber. Specializing in high-scale distributed backend systems, FAANG mock coding interviews, and resume overhauls.',
    specialties: ['System Design', 'FAANG Prep', 'Backend Architecture'],
    avatarGradient: 'from-pink-600 to-rose-600',
    category: 'Tech & Engineering',
  },
  {
    id: 'm-3',
    name: 'Lucas Dupont',
    role: 'Investment Banking Associate',
    organization: 'Goldman Sachs',
    alumni: 'Harvard Business School \'24',
    rating: 4.9,
    reviews: 42,
    sessionsCompleted: 98,
    rate: '$40 / hr',
    bio: 'Helping college students crack Wall Street analyst superdays, financial modeling technicals, and networking strategies.',
    specialties: ['Wall Street Prep', 'Financial Modeling', 'M&A Technicals'],
    avatarGradient: 'from-amber-600 to-orange-600',
    category: 'Business & Finance',
  },
  {
    id: 'm-4',
    name: 'Maya Lin (MD Candidate)',
    role: 'Medical Scholar & Researcher',
    organization: 'Johns Hopkins Medicine',
    alumni: 'Stanford Human Bio \'22',
    rating: 5.0,
    reviews: 53,
    sessionsCompleted: 110,
    rate: 'Free for Pre-Meds',
    bio: 'Scored in the 99th percentile on MCAT. Passionate about mentoring first-generation pre-meds through medical school applications.',
    specialties: ['MCAT Strategy', 'Med School Essays', 'Clinical Research'],
    avatarGradient: 'from-emerald-600 to-teal-600',
    category: 'Pre-Med',
  },
];

const CATEGORIES = ['All', 'Tech & Engineering', 'Academics', 'Business & Finance', 'Pre-Med'];

export default function MentorshipPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-03-25');
  const [bookingTime, setBookingTime] = useState('15:00');
  const [sessionTopic, setSessionTopic] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredMentors = MENTORS_DATA.filter((mentor) => {
    const matchesCategory = selectedCategory === 'All' || mentor.category === selectedCategory;
    const matchesQuery =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    setTimeout(() => {
      setIsBooking(false);
      setBookingConfirmed(true);
      setTimeout(() => {
        setBookingConfirmed(false);
        setSelectedMentor(null);
        setSessionTopic('');
      }, 2000);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 border-b border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
            <GraduationCap className="w-4 h-4" />
            <span>1-on-1 Academic & Career Coaching</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Academic Mentorship Network</h1>
          <p className="text-sm text-gray-400 mt-1">
            Book one-on-one sessions with senior engineers, researchers, and alumni for interview prep and research guidance.
          </p>
        </div>

        {/* Filters */}
        <div className="my-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentors by name, specialty, employer, or research field..."
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-600/20'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/30 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${mentor.avatarGradient} flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0`}
                  >
                    {mentor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white hover:text-pink-300 transition-colors">
                        {mentor.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{mentor.rating.toFixed(2)}</span>
                        <span className="text-gray-500">({mentor.reviews})</span>
                      </div>
                    </div>
                    <p className="text-xs text-pink-400 font-semibold">{mentor.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{mentor.organization} • {mentor.alumni}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mt-4 leading-relaxed">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {mentor.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">{mentor.sessionsCompleted} sessions hosted</span>
                  <span className="text-sm font-bold text-emerald-400">{mentor.rate}</span>
                </div>

                <button
                  onClick={() => setSelectedMentor(mentor)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/20 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0f0f18] border border-white/15 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">Book Session with {selectedMentor.name}</h3>
                  <p className="text-xs text-pink-400">{selectedMentor.role} • {selectedMentor.rate}</p>
                </div>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookingConfirmed ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-white">Session Successfully Scheduled!</h4>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    A calendar invitation and video link have been generated. Check your email for details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Time (UTC)</label>
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Session Focus / Questions
                    </label>
                    <textarea
                      rows={3}
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      placeholder="What would you like to cover? (e.g. mock technical interview, PhD lab proposals, resume review)..."
                      className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Sessions are 45 minutes long, conducted via StudyHub Live Classroom.</span>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(null)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <Button type="submit" isLoading={isBooking} className="w-auto px-6">
                      Confirm Booking
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