"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Stock } from "../types/stock";
import { getStocks, getStockPrices, getStockHistory } from "../lib/api";
import { useRouter } from "next/navigation";

export default function StocksList() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [yesterdayPrices, setYesterdayPrices] = useState<
    Record<number, number>
  >({});

  // Initial load
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStocks();
        setStocks(data);

        // Fetch yesterday's prices for each stock
        const yesterdayData: Record<number, number> = {};
        for (const stock of data) {
          try {
            const history = await getStockHistory(stock.id);
            // Assuming the history is sorted by date, with the most recent first
            // We want the second entry (yesterday's price)
            if (history.length >= 2) {
              yesterdayData[stock.id] = history[1].price;
            }
          } catch (err) {
            console.error(
              `Failed to fetch history for stock ${stock.id}:`,
              err
            );
          }
        }
        setYesterdayPrices(yesterdayData);
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
    }, 60000); // Changed to refresh every minute to reduce API load

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

  // Calculate daily change for a stock
  const calculateDailyChange = (stock: Stock) => {
    const yesterdayPrice = yesterdayPrices[stock.id];
    if (!yesterdayPrice) return { value: 0, percentage: 0 };

    const change = stock.price - yesterdayPrice;
    const percentage = (change / yesterdayPrice) * 100;

    return {
      value: change,
      percentage: percentage,
    };
  };

  // Get CSS class for change (positive/negative)
  const getChangeClass = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Handle stock selection - navigate to detail page
  const handleStockClick = (stockId: number) => {
    router.push(`/stocks/${stockId}`);
  };

  if (loading)
    return <div className="text-center py-4 text-emerald-600">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Available Stocks
        </h1>
        <span className="text-sm text-emerald-600">
          Auto-refresh: {refreshCounter > 0 ? "Active" : "Loading..."}
        </span>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 bg-emerald-50 font-medium">
          <div className="text-emerald-800">Symbol</div>
          <div className="text-emerald-800">Name</div>
          <div className="text-emerald-800">Price</div>
          <div className="text-emerald-800">Daily Change</div>
        </div>

        {stocks.length === 0 ? (
          <div className="p-6 text-center text-emerald-500">
            No stocks available.
          </div>
        ) : (
          stocks.map((stock) => {
            const change = calculateDailyChange(stock);
            return (
              <div
                key={stock.id}
                className="grid grid-cols-4 gap-4 p-4 border-b border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer"
                onClick={() => handleStockClick(stock.id)}
              >
                <div className="font-medium text-emerald-700">
                  {stock.symbol}
                </div>
                <div className="text-emerald-600">{stock.name}</div>
                <div className="text-emerald-800">
                  ${stock.price.toFixed(2)}
                </div>
                <div className={getChangeClass(change.value)}>
                  {change.value > 0 ? "+" : ""}
                  {change.value.toFixed(2)} ({change.value > 0 ? "+" : ""}
                  {change.percentage.toFixed(2)}%)
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
