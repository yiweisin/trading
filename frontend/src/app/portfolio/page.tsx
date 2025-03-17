"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getPortfolioSummary } from "@/services/tradeApi";
import { TradeLogSummary } from "@/types/tradelog";

export default function PortfolioPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [portfolio, setPortfolio] = useState<TradeLogSummary[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolioSummary();
        setPortfolio(data);
        setIsPortfolioLoading(false);
      } catch (err) {
        setError("Failed to load portfolio data");
        setIsPortfolioLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPortfolio();
    }
  }, [isAuthenticated]);

  if (isLoading || isPortfolioLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const totalPortfolioValue = portfolio.reduce(
    (sum, stock) => sum + stock.currentValue,
    0
  );

  const totalProfitLoss = portfolio.reduce(
    (sum, stock) => sum + stock.profitLoss,
    0
  );

  const totalProfitLossPercentage =
    (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100;

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
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
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
                  href="/portfolio"
                  className="text-indigo-600 border-b-2 border-indigo-600 px-3 py-2"
                >
                  Portfolio
                </Link>
                <Link
                  href="/trades"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Trade History
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">
                Welcome, {user.username}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Portfolio</h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-bold">
                ${totalPortfolioValue.toFixed(2)}
              </p>
              <p
                className={`text-sm ${
                  totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)} (
                {totalProfitLossPercentage.toFixed(2)}%)
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {portfolio.length === 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-4">
                You don't have any stocks in your portfolio yet.
              </p>
              <Link
                href="/stocks"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Stocks
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Shares
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Avg. Buy Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Current Value
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Profit/Loss
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.map((stock) => (
                    <tr key={stock.stockSymbol}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {stock.stockSymbol}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stock.stockName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stock.totalShares}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${stock.averageBuyPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${stock.currentValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            stock.profitLoss >= 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stock.profitLoss >= 0 ? "+" : ""}$
                          {stock.profitLoss.toFixed(2)} (
                          {stock.profitLossPercentage.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          href={`/stocks/${stock.stockSymbol}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
