"use client";

import { useState } from "react";
import Link from "next/link";

export default function PortfolioPage() {
  // Mock data for portfolio
  const [portfolioValue] = useState(124567.89);
  const [dailyChange] = useState(1234.56);
  const [dailyChangePercent] = useState(1.02);
  const [portfolioData] = useState([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 100,
      avgCost: 150.25,
      currentPrice: 192.53,
      value: 19253.0,
      gain: 4228.0,
      gainPercent: 28.14,
      dailyChange: 578.0,
      dailyChangePercent: 3.1,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp",
      shares: 50,
      avgCost: 350.5,
      currentPrice: 425.22,
      value: 21261.0,
      gain: 3736.0,
      gainPercent: 21.32,
      dailyChange: 512.5,
      dailyChangePercent: 2.47,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc",
      shares: 30,
      avgCost: 150.75,
      currentPrice: 182.41,
      value: 5472.3,
      gain: 950.1,
      gainPercent: 21.0,
      dailyChange: 117.9,
      dailyChangePercent: 2.2,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc",
      shares: 40,
      avgCost: 200.5,
      currentPrice: 174.48,
      value: 6979.2,
      gain: -1040.8,
      gainPercent: -12.98,
      dailyChange: -340.8,
      dailyChangePercent: -4.65,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Portfolio</h1>
            <div className="mt-2 flex items-center">
              <span className="text-2xl font-semibold">
                $
                {portfolioValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="ml-2 text-green-600">
                +$
                {dailyChange.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ({dailyChangePercent}%) today
              </span>
            </div>
          </div>

          <div className="mt-4 md:mt-0 space-x-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md">
              Add Position
            </button>
            <button className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Symbol
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Shares
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Avg Cost
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gain/Loss
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolioData.map((position) => (
                <tr key={position.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/chart/${position.symbol}/D`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {position.symbol}
                    </Link>
                    <div className="text-sm text-gray-500">{position.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {position.shares}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${position.avgCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${position.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    $
                    {position.value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`text-sm ${
                        position.gain >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {position.gain >= 0 ? "+" : ""}$
                      {position.gain.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className={`text-xs ${
                        position.gain >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {position.gain >= 0 ? "+" : ""}
                      {position.gainPercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      Buy
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
