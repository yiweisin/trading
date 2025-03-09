"use client";

import { useState } from "react";
import Link from "next/link";
import StockSearch from "@/components/trading/stock-search";

interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isFavorite: boolean;
}

interface Watchlist {
  id: string;
  name: string;
  stocks: WatchlistStock[];
}

export default function WatchlistPage() {
  const [activeWatchlist, setActiveWatchlist] = useState<string>("default");

  // Mock data for watchlists
  const [watchlists] = useState<Watchlist[]>([
    {
      id: "default",
      name: "Default Watchlist",
      stocks: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
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
          name: "Alphabet Inc.",
          price: 145.23,
          change: 2.47,
          changePercent: 1.73,
          isFavorite: false,
        },
        {
          symbol: "AMZN",
          name: "Amazon.com Inc.",
          price: 182.41,
          change: 3.93,
          changePercent: 2.2,
          isFavorite: false,
        },
        {
          symbol: "TSLA",
          name: "Tesla Inc.",
          price: 174.48,
          change: -8.52,
          changePercent: -4.65,
          isFavorite: false,
        },
      ],
    },
    {
      id: "tech",
      name: "Tech Stocks",
      stocks: [
        {
          symbol: "NVDA",
          name: "NVIDIA Corporation",
          price: 435.25,
          change: 15.32,
          changePercent: 3.65,
          isFavorite: true,
        },
        {
          symbol: "AMD",
          name: "Advanced Micro Devices",
          price: 123.45,
          change: 2.35,
          changePercent: 1.94,
          isFavorite: false,
        },
        {
          symbol: "INTC",
          name: "Intel Corporation",
          price: 42.32,
          change: -0.68,
          changePercent: -1.58,
          isFavorite: false,
        },
        {
          symbol: "CRM",
          name: "Salesforce Inc.",
          price: 235.12,
          change: 4.32,
          changePercent: 1.87,
          isFavorite: false,
        },
      ],
    },
    {
      id: "finance",
      name: "Financial Stocks",
      stocks: [
        {
          symbol: "JPM",
          name: "JPMorgan Chase & Co.",
          price: 195.32,
          change: -3.45,
          changePercent: -1.74,
          isFavorite: true,
        },
        {
          symbol: "BAC",
          name: "Bank of America Corp.",
          price: 42.18,
          change: -0.82,
          changePercent: -1.91,
          isFavorite: false,
        },
        {
          symbol: "GS",
          name: "Goldman Sachs Group",
          price: 387.45,
          change: -5.32,
          changePercent: -1.35,
          isFavorite: false,
        },
        {
          symbol: "V",
          name: "Visa Inc.",
          price: 275.32,
          change: 2.31,
          changePercent: 0.85,
          isFavorite: true,
        },
      ],
    },
  ]);

  const [showAddStockModal, setShowAddStockModal] = useState(false);

  // Toggle favorite status
  const toggleFavorite = (watchlistId: string, symbol: string) => {
    // Implement toggling favorite status
    console.log(`Toggle favorite for ${symbol} in watchlist ${watchlistId}`);
  };

  // Add stock to active watchlist
  const addStock = (symbol: string) => {
    // Implement adding stock to watchlist
    console.log(`Add ${symbol} to watchlist ${activeWatchlist}`);
    setShowAddStockModal(false);
  };

  // Current watchlist based on active ID
  const currentWatchlist =
    watchlists.find((wl) => wl.id === activeWatchlist) || watchlists[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Watchlists</h1>

          <div className="mt-4 md:mt-0 space-x-2">
            <button
              onClick={() => setShowAddStockModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Add Stock
            </button>
            <button className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md">
              New Watchlist
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav
              className="-mb-px flex space-x-6 overflow-x-auto"
              aria-label="Tabs"
            >
              {watchlists.map((watchlist) => (
                <button
                  key={watchlist.id}
                  onClick={() => setActiveWatchlist(watchlist.id)}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activeWatchlist === watchlist.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {watchlist.name}
                  <span className="ml-2 text-gray-400">
                    ({watchlist.stocks.length})
                  </span>
                </button>
              ))}
            </nav>
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
                  Last Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Change
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
              {currentWatchlist.stocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          toggleFavorite(currentWatchlist.id, stock.symbol)
                        }
                        className="mr-2"
                      >
                        {stock.isFavorite ? (
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-gray-300 hover:text-yellow-400"
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
                      <div>
                        <Link
                          href={`/dashboard/chart/${stock.symbol}/D`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {stock.symbol}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`inline-flex items-center ${
                        stock.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stock.change >= 0 ? (
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
                      <span>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)} (
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Link
                      href={`/dashboard/chart/${stock.symbol}/D`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Chart
                    </Link>
                    <button className="text-red-600 hover:text-red-900 mr-3">
                      Remove
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
              {currentWatchlist.stocks.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <p>No stocks in this watchlist yet.</p>
                    <button
                      onClick={() => setShowAddStockModal(true)}
                      className="mt-2 text-blue-600 font-medium hover:text-blue-800"
                    >
                      Add your first stock
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Stock to Watchlist</h3>
              <button
                onClick={() => setShowAddStockModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search for a stock
              </label>
              <StockSearch
                onSearch={(symbol) => addStock(symbol)}
                placeholder="Enter stock symbol or company name"
              />
            </div>

            <div className="mt-6 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Popular Stocks
              </h4>
              <div className="flex flex-wrap gap-2">
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
                    onClick={() => addStock(symbol)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
