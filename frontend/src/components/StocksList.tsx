"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Stock } from "../types/stock";
import { getStocks, getStockPrices, getStockHistory } from "../lib/api";

export default function StocksList() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<
    { date: string; price: number }[]
  >([]);

  // Initial load
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStocks();
        setStocks(data);
      } catch (err) {
        setError("Failed to fetch stocks");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();

    // Start auto-refresh timer
    const timer = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh stock prices
  useEffect(() => {
    if (refreshCounter > 0) {
      const updatePrices = async () => {
        try {
          const stockPrices = await getStockPrices();

          setStocks((prevStocks) =>
            prevStocks.map((stock) => {
              const updatedPrice = stockPrices.find((sp) => sp.id === stock.id);
              if (updatedPrice) {
                return {
                  ...stock,
                  price: updatedPrice.price,
                };
              }
              return stock;
            })
          );
        } catch (err) {
          console.error("Failed to update prices:", err);
        }
      };

      updatePrices();
    }
  }, [refreshCounter]);

  // Fetch price history when a stock is selected
  useEffect(() => {
    if (selectedStock) {
      const fetchPriceHistory = async () => {
        try {
          const history = await getStockHistory(selectedStock);
          setPriceHistory(history);
        } catch (err) {
          console.error("Failed to fetch price history:", err);
        }
      };

      fetchPriceHistory();
    } else {
      setPriceHistory([]);
    }
  }, [selectedStock]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Stocks</h1>
        <span className="text-sm text-gray-600">
          Auto-refresh: {refreshCounter > 0 ? "Active" : "Loading..."}
        </span>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 font-medium">
          <div>Symbol</div>
          <div>Name</div>
          <div>Price</div>
          <div>Description</div>
          <div>Actions</div>
        </div>

        {stocks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No stocks available.
          </div>
        ) : (
          stocks.map((stock) => (
            <div
              key={stock.id}
              className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200"
            >
              <div className="font-medium">{stock.symbol}</div>
              <div>{stock.name}</div>
              <div>${stock.price.toFixed(2)}</div>
              <div className="text-sm text-gray-600 truncate">
                {stock.description}
              </div>
              <div>
                <button
                  onClick={() =>
                    setSelectedStock(
                      selectedStock === stock.id ? null : stock.id
                    )
                  }
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                >
                  {selectedStock === stock.id ? "Hide History" : "View History"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Price History Section */}
      {selectedStock && priceHistory.length > 0 && (
        <div className="mt-8 bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">
            Price History - {stocks.find((s) => s.id === selectedStock)?.symbol}
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 p-2 font-medium">Date</div>
            <div className="bg-gray-100 p-2 font-medium">Price</div>

            {priceHistory.map((item, index) => (
              <React.Fragment key={index}>
                <div className="p-2 border-b">{item.date}</div>
                <div className="p-2 border-b">${item.price.toFixed(2)}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
