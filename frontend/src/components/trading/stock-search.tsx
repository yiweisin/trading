"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Sample stock data - in a real app, you might get this from an API
const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "BAC", name: "Bank of America Corp." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "MA", name: "Mastercard Inc." },
  { symbol: "DIS", name: "Walt Disney Co." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "VZ", name: "Verizon Communications Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "CSCO", name: "Cisco Systems Inc." },
];

interface StockSearchProps {
  onSearch?: (symbol: string) => void;
  placeholder?: string;
  className?: string;
}

const StockSearch = ({
  onSearch,
  placeholder = "Search stocks...",
  className = "",
}: StockSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState(POPULAR_STOCKS);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter stocks based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStocks(POPULAR_STOCKS);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = POPULAR_STOCKS.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(lowerCaseSearch) ||
          stock.name.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredStocks(filtered);
    }
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search selection
  const handleSelectStock = (symbol: string) => {
    setSearchTerm("");
    setIsOpen(false);

    // If onSearch prop is provided, call it
    if (onSearch) {
      onSearch(symbol);
    } else {
      // Otherwise navigate to the chart page
      router.push(`/dashboard/chart/${symbol}/D`);
    }
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim() !== "") {
      // If there are filtered results, navigate to the first result
      if (filteredStocks.length > 0) {
        handleSelectStock(filteredStocks[0].symbol);
      }
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-500"
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
          )}
        </div>
      </form>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {filteredStocks.length > 0 ? (
            <ul className="py-1">
              {filteredStocks.map((stock) => (
                <li
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock.symbol)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {stock.name}
                    </span>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
