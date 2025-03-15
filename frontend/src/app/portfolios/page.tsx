"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Portfolio } from "@/lib/types";
import PortfolioList from "@/components/portfolio-list";

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await api.getPortfolios();
        setPortfolios(data);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setError("Failed to load portfolios");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPortfolioName.trim()) return;

    try {
      // In a real app, you would get the user ID from authentication
      // For demo purposes, we'll use a placeholder
      const newPortfolio = await api.createPortfolio({
        name: newPortfolioName,
        userId: "00000000-0000-0000-0000-000000000000", // Placeholder user ID
      });

      setPortfolios([...portfolios, newPortfolio]);
      setNewPortfolioName("");
    } catch (err) {
      console.error("Error creating portfolio:", err);
      setError("Failed to create portfolio");
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Portfolios</h1>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Create New Portfolio</h2>
        <form onSubmit={handleCreatePortfolio} className="flex gap-2">
          <input
            type="text"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            placeholder="Portfolio name"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </form>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>

      <PortfolioList portfolios={portfolios} />
    </div>
  );
}
