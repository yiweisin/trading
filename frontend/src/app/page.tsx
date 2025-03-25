"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import TradeHistory from "../components/TradeHistory";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading)
    return <div className="text-center py-8 text-emerald-600">Loading...</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-emerald-800">
        Welcome to Your Trading Dashboard, {user.username}!
      </h1>
      <TradeHistory />
    </div>
  );
}
