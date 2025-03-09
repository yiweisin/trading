"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StockSearch from "@/components/trading/stock-search";
import TradingViewChart from "@/components/trading/tradingview-chart";

export default function TradingPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Trading Dashboard</h1>

        <div className="max-w-lg mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search for a stock symbol
          </label>
          <StockSearch
            onSearch={handleSearch}
            placeholder="Enter a stock symbol (e.g., AAPL, MSFT, GOOGL)"
            className="w-full"
          />
          <p className="mt-2 text-sm text-gray-500">
            Search for any US stock by symbol or company name
          </p>
        </div>

        {selectedSymbol ? (
          <TradingViewChart
            symbol={`NASDAQ:${selectedSymbol}`}
            interval="D"
            height={600}
          />
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No stock selected
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Search for a stock symbol above to view its chart
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                "AAPL",
                "MSFT",
                "GOOGL",
                "AMZN",
                "TSLA",
                "META",
                "NVDA",
                "JPM",
              ].map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => setSelectedSymbol(symbol)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedSymbol && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Trading Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium mb-2">Market Order</h3>
              <p className="text-sm text-gray-500 mb-4">
                Buy or sell at the current market price
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Buy
                </button>
                <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Sell
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium mb-2">Limit Order</h3>
              <p className="text-sm text-gray-500 mb-4">
                Buy or sell at a specified price or better
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Buy Limit
                </button>
                <button className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Sell Limit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() =>
                router.push(`/dashboard/chart/${selectedSymbol}/D`)
              }
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <span>View Advanced Chart</span>
              <svg
                className="ml-1 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
