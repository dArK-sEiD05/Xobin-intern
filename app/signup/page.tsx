'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/signup', { email, password });
      window.location.href = '/login';
    } catch (err) {

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to sign up');
      } else {
        setError('Failed to sign up');
      }
      
     
     
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm min-h-[500px] flex flex-col justify-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create Account</h1>
        
        {
        error && <p className="text-red-500 text-center mb-4">{error}</p>}
        

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
