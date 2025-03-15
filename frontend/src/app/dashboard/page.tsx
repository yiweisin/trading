"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Portfolio } from "@/lib/types";
import PortfolioList from "@/components/portfolio-list";

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // In a real app, you would get the user ID from authentication
        // For demo, we'll just fetch all portfolios
        const data = await api.getPortfolios();
        setPortfolios(data);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setError("Failed to load portfolios. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/portfolios"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View All Portfolios
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Portfolios</h2>
        <PortfolioList portfolios={portfolios} />
      </div>
    </div>
  );
}
