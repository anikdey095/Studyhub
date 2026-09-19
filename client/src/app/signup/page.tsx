'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedCard from '@/components/ui/AnimatedCard';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        university: university || 'Global Student',
        password,
      });

      setSuccess('Account created successfully! Redirecting...');
      
      if (response.data?.token && response.data?.user) {
        login(response.data.token, response.data.user);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      } else {
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to connect to backend server. Make sure it is running.' : null) ||
        'An error occurred during signup.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f]">
      <AnimatedCard title="Create an Account" subtitle="Join thousands of students and researchers on StudyHub">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="name"
            name="name"
            label="Full Name"
            type="text"
            placeholder="Alex Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputField
            id="email"
            name="email"
            label="University / Work Email"
            type="email"
            placeholder="alex@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            id="university"
            name="university"
            label="University or Institution"
            type="text"
            placeholder="e.g. Stanford University"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            required
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm text-center flex flex-col items-center gap-2">
              <span>{error}</span>
              {error.toLowerCase().includes('already') && (
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                >
                  Sign In to Existing Account →
                </Link>
              )}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm text-center">
              {success}
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-pink-400 hover:text-pink-300 underline underline-offset-4">
            Log In
          </Link>
        </p>
      </AnimatedCard>
    </div>
  );
};

export default SignupPage;