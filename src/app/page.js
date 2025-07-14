"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to Firebase Auth
        </h1>
        <p className="text-gray-600 mb-8">
          A complete authentication solution with Next.js 14 and Firebase
        </p>
        <div className="space-y-4">
          <Button onClick={() => router.push("/login")}>Sign In</Button>
          <Button variant="secondary" onClick={() => router.push("/register")}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
