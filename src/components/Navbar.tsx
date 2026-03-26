'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { signOut } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-blue-600">AMPLIFI</span>
              <span className="text-gray-800">.AI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/directory"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Directory
                </Link>
                <Link
                  href="/block-party"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Block Party
                </Link>
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Messages
                </Link>
              </>
            )}

            {/* Auth Section */}
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/directory"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Directory
                </Link>
                <Link
                  href="/block-party"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Block Party
                </Link>
                <Link
                  href="/messages"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Profile
                </Link>
              </>
            )}

            {/* Mobile Auth Section */}
            {loading ? (
              <div className="text-gray-500 py-2">Loading...</div>
            ) : user ? (
              <button
                onClick={handleSignOut}
                className="w-full text-left bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
