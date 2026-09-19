'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Bell,
  BookOpen,
  FileText,
  Briefcase,
  Users,
  Compass,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Study Notes', href: '/study' },
    { name: 'Research', href: '/research' },
    { name: 'AI Tools', href: '/ai', badge: 'AI' },
    { name: 'Jobs & Tuition', href: '/jobs' },
    { name: 'Network', href: '/network' },
    { name: 'Mentorship', href: '/mentorship' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#080811]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 p-[1.5px] shadow-lg shadow-purple-600/20 group-hover:shadow-pink-500/30 transition-all duration-300">
              <div className="w-full h-full bg-[#0d0d18] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Study
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500">
                  Hub
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-white/10 text-gray-400 tracking-wider">
                  Pro
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-1.5 ${
                    active
                      ? 'text-white bg-white/[0.08] shadow-sm'
                      : link.badge
                      ? 'text-pink-300 hover:text-white hover:bg-pink-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-md bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/40 animate-pulse">
                      ✦ {link.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Center */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3" ref={dropdownRef}>
                <Link
                  href="/dashboard"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors relative"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>

                {/* Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-left group"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500/30"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        {userInitial}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-200 group-hover:text-white truncate max-w-[120px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Glassmorphic Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f0f1c]/95 border border-white/10 shadow-2xl backdrop-blur-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-white/[0.08]">
                        <p className="font-bold text-white text-sm truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold text-[10px] border border-purple-500/30">
                          {user.university || 'Verified Scholar'}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-gray-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-pink-400" />
                          <div>
                            <p className="font-semibold">My Student Profile</p>
                            <p className="text-[10px] text-gray-400">Cover photo, avatar & academic bio</p>
                          </div>
                        </Link>

                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-gray-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-400" />
                          <span>Command Dashboard</span>
                        </Link>

                        <Link
                          href="/study"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-gray-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          <span>Study Notes & Uploads</span>
                        </Link>

                        <Link
                          href="/ai"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-gray-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>AI Study Suite</span>
                        </Link>
                      </div>

                      <div className="pt-1 mt-1 border-t border-white/[0.08]">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-pink-600/20 transition-all hover:scale-[1.02]"
                >
                  Join StudyHub
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a14]/98 border-b border-white/10 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive(link.href)
                  ? 'text-white bg-white/[0.08]'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-white/[0.05] text-pink-300 font-semibold text-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Student Profile ({user.name})</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-white/[0.03] text-gray-200 font-medium text-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-red-400 bg-red-500/10 font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-gray-200 border border-white/10 rounded-xl font-semibold text-xs"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-xs shadow-md shadow-pink-600/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}