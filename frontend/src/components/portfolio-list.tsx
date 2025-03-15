"use client";

import Link from "next/link";
import { Portfolio } from "@/lib/types";

interface PortfolioListProps {
  portfolios: Portfolio[] | { value: Portfolio[] };
}

export default function PortfolioList({ portfolios }: PortfolioListProps) {
  // Handle the new format with ReferenceHandler.Preserve
  const portfolioArray = Array.isArray(portfolios)
    ? portfolios
    : (portfolios as any)?.value || [];

  if (portfolioArray.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 rounded">
        <p className="mb-4">You don't have any portfolios yet.</p>
        <Link
          href="/portfolios"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolioArray.map((portfolio: Portfolio) => (
        <Link key={portfolio.id} href={`/portfolios/${portfolio.id}`}>
          <div className="border rounded p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{portfolio.name}</h3>
            <p className="text-sm text-gray-600">
              {portfolio.items?.length || 0} stocks
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Last updated:{" "}
              {new Date(portfolio.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
