"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import StocksList from "../../components/StocksList";

export default function StocksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <StocksList />
    </div>
  );
}
