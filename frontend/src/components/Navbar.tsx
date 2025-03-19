"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Trading App
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {user && (
            <>
              <Link href="/" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link href="/stocks" className="hover:text-blue-200">
                Stocks
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link
                href="/login"
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 pt-2 border-t border-blue-500">
          {user ? (
            <>
              <Link href="/" className="block py-2">
                Dashboard
              </Link>
              <Link href="/stocks" className="block py-2">
                Stocks
              </Link>
              <div className="flex justify-between items-center py-2">
                <span>Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2 py-2">
              <Link
                href="/login"
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 text-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
