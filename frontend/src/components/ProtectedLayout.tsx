"use client";

import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50">
        <div className="text-emerald-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-emerald-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-emerald-50">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6">{children}</main>
    </div>
  );
}
