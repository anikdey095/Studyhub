'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  Shield,
  Heart,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#06060c] border-t border-white/[0.08] text-gray-400 text-xs mt-auto">
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group inline-block">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 p-[1.5px]">
                <div className="w-full h-full bg-[#0d0d18] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Study
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500">
                  Hub
                </span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The premier next-generation academic network. Empowering students, researchers, and local tutors with AI-powered study materials, open preprints, and private tutoring opportunities.
            </p>

            {/* Live Operational Status */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-gray-300">
                All Systems Operational • Fast Edge Network
              </span>
            </div>
          </div>

          {/* Col 1: Academic Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Academic Hub</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/study" className="hover:text-pink-300 transition-colors">
                  Study Materials & Notes
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-pink-300 transition-colors">
                  Research Papers & Preprints
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-pink-300 transition-colors flex items-center space-x-1.5">
                  <span>AI Student Suite</span>
                  <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 text-[9px] font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-pink-300 transition-colors">
                  Local Tuition & Campus Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Student Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Ecosystem</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/profile" className="hover:text-pink-300 transition-colors">
                  My Student Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-pink-300 transition-colors">
                  Command Dashboard
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-pink-300 transition-colors">
                  Peer Study Network
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="hover:text-pink-300 transition-colors">
                  Faculty Mentorship
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Governance & Discreet Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">System & Governance</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#privacy" className="hover:text-gray-200 transition-colors">
                  Academic Integrity Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-gray-200 transition-colors">
                  Terms of Service & API
                </a>
              </li>
              <li>
                <a href="#scholar" className="hover:text-gray-200 transition-colors">
                  Scholar Pro Subscriptions
                </a>
              </li>
              {/* Discreet Admin Portal Link (Hidden in footer as requested) */}
              <li className="pt-2 border-t border-white/[0.05]">
                <Link
                  href="/admin"
                  className="flex items-center space-x-1.5 text-gray-500 hover:text-amber-400 transition-colors text-[11px] group"
                  title="Administrative Control Center"
                >
                  <Shield className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-white/[0.06] bg-[#040409]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} StudyHub Global Inc. Built for students and researchers worldwide.</p>
          <div className="flex items-center space-x-5">
            <span className="flex items-center text-gray-400">
              Crafted with <Heart className="w-3 h-3 text-pink-500 mx-1 fill-pink-500" /> for Academic Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
