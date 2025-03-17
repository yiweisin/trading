"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getPortfolioSummary } from "@/services/tradeApi";
import { TradeLogSummary } from "@/types/tradelog";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [portfolio, setPortfolio] = useState<TradeLogSummary[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
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
        console.error("Failed to load portfolio data", err);
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
                  href="/portfolio"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">Portfolio Value</h2>
                <p className="text-3xl font-bold text-indigo-600">
                  ${totalPortfolioValue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total value across all positions
                </p>
                <div className="mt-4">
                  <Link
                    href="/portfolio"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">Active Positions</h2>
                <p className="text-3xl font-bold text-indigo-600">
                  {portfolio.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Stocks in your portfolio
                </p>
                <div className="mt-4">
                  <Link
                    href="/portfolio"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Manage Positions &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">Account</h2>
                <p className="text-lg font-medium mb-1">{user.username}</p>
                <p className="text-sm text-gray-500">Logged in user</p>
                <div className="mt-4">
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Logout &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                <h2 className="text-xl font-semibold mb-4">Trade History</h2>
                <p className="text-gray-600 mb-4">
                  View your past transactions and trade performance.
                </p>
                <Link
                  href="/trades"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View History
                </Link>
              </div>
            </div>
          </div>

          {portfolio.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
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
                        Value
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Profit/Loss
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <Link
                  href="/portfolio"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View Full Portfolio &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
