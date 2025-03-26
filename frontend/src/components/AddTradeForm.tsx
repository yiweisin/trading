"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Stock } from "../types/stock";
import { getStockPrices } from "../lib/api";

interface AddTradeFormProps {
  stocks: Stock[];
  onAddTrade: (stockId: number) => void;
}

export default function AddTradeForm({
  stocks,
  onAddTrade,
}: AddTradeFormProps) {
  const [stockId, setStockId] = useState<number>(
    stocks.length > 0 ? stocks[0].id : 0
  );
  const [currentStocks, setCurrentStocks] = useState<Stock[]>(stocks);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Auto-refresh stock prices
  useEffect(() => {
    const updatePrices = async () => {
      try {
        const stockPrices = await getStockPrices();

        setCurrentStocks((prevStocks) =>
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

    // Initial refresh
    updatePrices();

    // Set up periodic refresh
    const timer = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
    }, 100); // Refresh every 30 seconds

    return () => clearInterval(timer);
  }, []);

  // Refresh prices when counter changes
  useEffect(() => {
    if (refreshCounter > 0) {
      const updatePrices = async () => {
        try {
          const stockPrices = await getStockPrices();

          setCurrentStocks((prevStocks) =>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTrade(stockId);
  };

  const selectedStock = currentStocks.find((s) => s.id === stockId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="stock"
          className="block mb-1 font-medium text-emerald-800"
        >
          Select Stock
        </label>
        <select
          id="stock"
          value={stockId}
          onChange={(e) => setStockId(parseInt(e.target.value))}
          className="w-full p-2 border border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
          required
        >
          {currentStocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStock && (
        <div className="p-3 bg-emerald-50 rounded">
          <p className="text-emerald-800">
            <span className="font-medium text-emerald-800">Current Price:</span>{" "}
            ${selectedStock.price.toFixed(2)}
          </p>
          <p className="text-sm text-black mt-1">{selectedStock.description}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        >
          Buy Stock
        </button>
      </div>
    </form>
  );
}
