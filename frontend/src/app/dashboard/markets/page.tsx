"use client";

import { useState } from "react";
import Link from "next/link";

interface MarketSector {
  name: string;
  performance: number;
  companies: string[];
}

export default function MarketsPage() {
  // Mock data for market indices
  const [marketIndices] = useState([
    {
      id: "dji",
      name: "Dow Jones",
      value: 38754.23,
      change: 254.24,
      changePercent: 0.66,
    },
    {
      id: "spx",
      name: "S&P 500",
      value: 5234.31,
      change: 43.37,
      changePercent: 0.84,
    },
    {
      id: "ixic",
      name: "NASDAQ",
      value: 16432.72,
      change: 182.16,
      changePercent: 1.12,
    },
    {
      id: "rut",
      name: "Russell 2000",
      value: 2078.35,
      change: 22.56,
      changePercent: 1.1,
    },
    {
      id: "vix",
      name: "CBOE Volatility Index",
      value: 15.23,
      change: -0.82,
      changePercent: -5.11,
    },
  ]);

  // Mock data for sectors
  const [sectors] = useState<MarketSector[]>([
    {
      name: "Technology",
      performance: 1.45,
      companies: ["AAPL", "MSFT", "NVDA", "GOOGL", "META"],
    },
    {
      name: "Healthcare",
      performance: 0.82,
      companies: ["JNJ", "UNH", "PFE", "ABT", "MRK"],
    },
    {
      name: "Financials",
      performance: 0.56,
      companies: ["JPM", "BAC", "WFC", "C", "GS"],
    },
    {
      name: "Consumer Discretionary",
      performance: 1.23,
      companies: ["AMZN", "HD", "NKE", "SBUX", "MCD"],
    },
    {
      name: "Consumer Staples",
      performance: -0.32,
      companies: ["PG", "KO", "PEP", "WMT", "COST"],
    },
    {
      name: "Energy",
      performance: -1.28,
      companies: ["XOM", "CVX", "COP", "EOG", "SLB"],
    },
    {
      name: "Industrials",
      performance: 0.67,
      companies: ["HON", "UNP", "UPS", "CAT", "BA"],
    },
    {
      name: "Utilities",
      performance: -0.46,
      companies: ["NEE", "DUK", "SO", "D", "AEP"],
    },
    {
      name: "Real Estate",
      performance: 0.25,
      companies: ["AMT", "PLD", "CCI", "PSA", "DLR"],
    },
    {
      name: "Materials",
      performance: -0.18,
      companies: ["LIN", "FCX", "APD", "NEM", "SHW"],
    },
    {
      name: "Communication Services",
      performance: 1.32,
      companies: ["GOOGL", "META", "NFLX", "DIS", "VZ"],
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Markets Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {marketIndices.map((index) => (
            <div
              key={index.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <p className="text-sm text-gray-500">{index.name}</p>
              <p className="text-xl font-bold">
                {index.value.toLocaleString()}
              </p>
              <div
                className={`flex items-center text-sm ${
                  index.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      index.change >= 0
                        ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    }
                  />
                </svg>
                <span>
                  {index.change >= 0 ? "+" : ""}
                  {index.change.toFixed(2)} ({index.change >= 0 ? "+" : ""}
                  {index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Sector Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sector
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Daily Performance
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Top Companies
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectors.map((sector) => (
                <tr key={sector.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {sector.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`inline-flex items-center ${
                        sector.performance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {sector.performance >= 0 ? (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          />
                        </svg>
                      )}
                      <span className="font-medium">
                        {sector.performance >= 0 ? "+" : ""}
                        {sector.performance.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {sector.companies.map((symbol) => (
                        <Link
                          key={symbol}
                          href={`/dashboard/chart/${symbol}/D`}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                        >
                          {symbol}
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Market Heatmap</h2>
        <div className="bg-gray-100 text-center p-10 rounded-lg border border-gray-200">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700">
            Market Heatmap View
          </h3>
          <p className="text-gray-500 mt-2">
            Interactive heatmap showing market performance by sector and company
            size.
          </p>
        </div>
      </div>
    </div>
  );
}
