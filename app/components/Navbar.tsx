'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 p-8 shadow-lg">
      <div className="container mx-auto flex justify-center">
        <ul className="flex space-x-8 text-white font-medium">
          <li>
            <Link href="/" className="hover:text-blue-400 transition-colors">
              All Meals
            </Link>
          </li>
          <li>
            <Link href="/favorites" className="hover:text-blue-400 transition-colors">
              Favorites
            </Link>
          </li>

          {!session ? (
            <>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-blue-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hover:text-blue-400 transition-colors"
              >
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
