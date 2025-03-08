"use client";

import { useState } from "react";
import Link from "next/link";

type PortfolioHolding = {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPercent: number;
  dayChange: number;
  dayChangePercent: number;
};

export default function PortfolioSummary() {
  // Mock data for portfolio holdings
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 100,
      avgCost: 150.25,
      currentPrice: 192.53,
      value: 19253.0,
      gain: 4228.0,
      gainPercent: 28.14,
      dayChange: 578.0,
      dayChangePercent: 3.1,
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
      dayChange: 512.5,
      dayChangePercent: 2.47,
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
      dayChange: 117.9,
      dayChangePercent: 2.2,
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
      dayChange: -340.8,
      dayChangePercent: -4.65,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp",
      shares: 25,
      avgCost: 350.25,
      currentPrice: 435.25,
      value: 10881.25,
      gain: 2125.0,
      gainPercent: 24.28,
      dayChange: 383.0,
      dayChangePercent: 3.65,
    },
  ]);

  // Calculate total portfolio values
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalGain = holdings.reduce((sum, h) => sum + h.gain, 0);
  const totalCost = totalValue - totalGain;
  const totalGainPercent = (totalGain / totalCost) * 100;
  const dailyChange = holdings.reduce((sum, h) => sum + h.dayChange, 0);
  const dailyChangePercent = (dailyChange / (totalValue - dailyChange)) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Portfolio Summary</h2>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <Link
            href="/dashboard/portfolio"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
          >
            View Full Portfolio
          </Link>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none">
            Add Position
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Symbol
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Shares
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Avg Cost
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Value
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Gain/Loss
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Day Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map((holding) => (
              <tr key={holding.symbol} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/dashboard/stocks/${holding.symbol}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {holding.symbol}
                  </Link>
                  <div className="text-xs text-gray-500">{holding.name}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  {holding.shares}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  ${holding.avgCost.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  ${holding.currentPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  $
                  {holding.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div
                    className={`text-sm ${
                      holding.gain >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    $
                    {Math.abs(holding.gain).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`text-xs ${
                      holding.gain >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {holding.gain >= 0 ? "+" : "-"}
                    {Math.abs(holding.gainPercent).toFixed(2)}%
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div
                    className={`text-sm ${
                      holding.dayChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    $
                    {Math.abs(holding.dayChange).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`text-xs ${
                      holding.dayChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {holding.dayChange >= 0 ? "+" : "-"}
                    {Math.abs(holding.dayChangePercent).toFixed(2)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                Total
              </td>
              <td className="px-4 py-3 whitespace-nowrap"></td>
              <td className="px-4 py-3 whitespace-nowrap"></td>
              <td className="px-4 py-3 whitespace-nowrap"></td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                $
                {totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <div
                  className={`text-sm font-medium ${
                    totalGain >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  $
                  {Math.abs(totalGain).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs ${
                    totalGain >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalGain >= 0 ? "+" : "-"}
                  {Math.abs(totalGainPercent).toFixed(2)}%
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <div
                  className={`text-sm font-medium ${
                    dailyChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  $
                  {Math.abs(dailyChange).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs ${
                    dailyChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {dailyChange >= 0 ? "+" : "-"}
                  {Math.abs(dailyChangePercent).toFixed(2)}%
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
