'use client';

import Link from 'next/link';

const Navbar = () => {
  const isLoggedIn = false; // Placeholder for authentication logic

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-50 backdrop-blur-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">StudyHub</Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-300 hover:text-pink-500 transition duration-200">Home</Link>
          <Link href="/study" className="text-gray-300 hover:text-pink-500 transition duration-200">Study</Link>
          <Link href="/research" className="text-gray-300 hover:text-pink-500 transition duration-200">Research</Link>
          <Link href="/jobs" className="text-gray-300 hover:text-pink-500 transition duration-200">Jobs</Link>
          <Link href="/network" className="text-gray-300 hover:text-pink-500 transition duration-200">Network</Link>
          <Link href="/mentorship" className="text-gray-300 hover:text-pink-500 transition duration-200">Mentorship</Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-white font-semibold hover:text-pink-500 transition duration-200">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;