"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Login App</h1>

        <p className="text-lg text-gray-600 mb-8">
          A simple authentication system with Next.js and C# WebAPI
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-lg font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 py-2 px-6 rounded-md text-lg font-medium"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
