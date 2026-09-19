'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedCard from '@/components/ui/AnimatedCard';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      if (token && user) {
        login(token, user);
        router.push('/dashboard');
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to connect to backend server. Make sure it is running.' : null) ||
        'Invalid email or password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f]">
      <AnimatedCard title="Welcome Back" subtitle="Log in to access your study materials and dashboard">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-sm py-1">
            <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-pink-600 focus:ring-pink-500 focus:ring-offset-gray-900"
              />
              <span className="ml-2 text-xs text-gray-400">Remember me</span>
            </label>
            <Link href="#" className="text-xs text-pink-400 hover:text-pink-300 transition duration-150">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-medium text-pink-400 hover:text-pink-300 underline underline-offset-4">
            Sign Up
          </Link>
        </p>
      </AnimatedCard>
    </div>
  );
};

export default LoginPage;