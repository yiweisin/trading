"use client";

import { useState } from "react";

type MarketIndex = {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
};

type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

export default function MarketOverview() {
  // Mock data for market indices
  const [marketIndices] = useState<MarketIndex[]>([
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
  ]);

  // Mock data for top gainers
  const [topGainers] = useState<StockData[]>([
    {
      symbol: "NVDA",
      name: "NVIDIA Corp",
      price: 435.25,
      change: 15.32,
      changePercent: 3.65,
    },
    {
      symbol: "AAPL",
      name: "Apple Inc",
      price: 192.53,
      change: 5.78,
      changePercent: 3.1,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp",
      price: 425.22,
      change: 10.25,
      changePercent: 2.47,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc",
      price: 182.41,
      change: 3.93,
      changePercent: 2.2,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc",
      price: 145.23,
      change: 2.47,
      changePercent: 1.73,
    },
  ]);

  // Mock data for top losers
  const [topLosers] = useState<StockData[]>([
    {
      symbol: "TSLA",
      name: "Tesla Inc",
      price: 174.48,
      change: -8.52,
      changePercent: -4.65,
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      price: 471.24,
      change: -12.68,
      changePercent: -2.62,
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase",
      price: 195.32,
      change: -3.45,
      changePercent: -1.74,
    },
    {
      symbol: "DIS",
      name: "Walt Disney Co",
      price: 105.18,
      change: -1.75,
      changePercent: -1.64,
    },
    {
      symbol: "NFLX",
      name: "Netflix Inc",
      price: 632.77,
      change: -8.23,
      changePercent: -1.28,
    },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Market Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {marketIndices.map((index) => (
          <div key={index.id} className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">{index.name}</p>
            <p className="text-xl font-bold">{index.value.toLocaleString()}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-green-600 flex items-center mb-3">
            <svg
              className="w-5 h-5 mr-1"
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
            Top Gainers
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                    Symbol
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                    Price
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                    Chg %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topGainers.map((stock) => (
                  <tr key={stock.symbol} className="text-sm">
                    <td className="py-2">
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-gray-500 text-xs">{stock.name}</div>
                    </td>
                    <td className="text-right py-2">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className="text-right py-2 text-green-600">
                      +{stock.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-red-600 flex items-center mb-3">
            <svg
              className="w-5 h-5 mr-1"
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
            Top Losers
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                    Symbol
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                    Price
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                    Chg %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topLosers.map((stock) => (
                  <tr key={stock.symbol} className="text-sm">
                    <td className="py-2">
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-gray-500 text-xs">{stock.name}</div>
                    </td>
                    <td className="text-right py-2">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className="text-right py-2 text-red-600">
                      {stock.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
