"use client";

import { useState } from "react";
import Link from "next/link";

type WatchlistStock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isFavorite: boolean;
};

export default function Watchlist() {
  // Mock data for watchlist
  const [stocks, setStocks] = useState<WatchlistStock[]>([
    {
      symbol: "AAPL",
      name: "Apple Inc",
      price: 192.53,
      change: 5.78,
      changePercent: 3.1,
      isFavorite: true,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp",
      price: 425.22,
      change: 10.25,
      changePercent: 2.47,
      isFavorite: true,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc",
      price: 145.23,
      change: 2.47,
      changePercent: 1.73,
      isFavorite: false,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc",
      price: 182.41,
      change: 3.93,
      changePercent: 2.2,
      isFavorite: false,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc",
      price: 174.48,
      change: -8.52,
      changePercent: -4.65,
      isFavorite: false,
    },
  ]);

  // Toggle favorite status
  const toggleFavorite = (symbol: string) => {
    setStocks(
      stocks.map((stock) =>
        stock.symbol === symbol
          ? { ...stock, isFavorite: !stock.isFavorite }
          : stock
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Watchlist</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none">
          Edit
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="flex items-center">
                  <Link
                    href={`/dashboard/stocks/${stock.symbol}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {stock.symbol}
                  </Link>
                  <button
                    onClick={() => toggleFavorite(stock.symbol)}
                    className="ml-2 focus:outline-none"
                  >
                    {stock.isFavorite ? (
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-400 hover:text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-500">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  ${stock.price.toFixed(2)}
                </div>
                <div
                  className={`text-xs ${
                    stock.change >= 0 ? "text-green-600" : "text-red-600"
                  } flex items-center justify-end`}
                >
                  <svg
                    className="w-3 h-3 mr-1"
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
                        stock.change >= 0
                          ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      }
                    />
                  </svg>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              <button className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none">
                Buy
              </button>
              <button className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none">
                Set Alert
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none">
          + Add Symbol
        </button>
      </div>
    </div>
  );
}
