"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                Trading App
              </span>
              <div className="ml-10 flex space-x-4">
                <Link
                  href="/dashboard"
                  className="text-indigo-600 border-b-2 border-indigo-600 px-3 py-2"
                >
                  Dashboard
                </Link>
                <Link
                  href="/stocks"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Stocks
                </Link>
                <Link
                  href="/transactions"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Transactions
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">
                Welcome, {user.username}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Trade Stocks</h2>
                <p className="text-gray-600 mb-4">
                  Browse available stocks and make trades.
                </p>
                <Link
                  href="/stocks"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Browse Stocks
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Transaction History
                </h2>
                <p className="text-gray-600 mb-4">
                  View your past trades and transaction history.
                </p>
                <Link
                  href="/transactions"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Transactions
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Account Information
                </h2>
                <p className="text-gray-600 mb-4">
                  You are logged in as <strong>{user.username}</strong>.
                </p>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
