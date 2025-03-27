"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStock, getStockHistory } from "@/lib/api";
import { Stock } from "@/types/stock";

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stockId = Number(params.id);

  const [stock, setStock] = useState<Stock | null>(null);
  const [priceHistory, setPriceHistory] = useState<
    { date: string; price: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!stockId || isNaN(stockId)) {
        setError("Invalid stock ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch stock details using existing getStock function
        const stockData = await getStock(stockId);
        setStock(stockData);

        // Fetch price history
        const history = await getStockHistory(stockId);
        setPriceHistory(history);
      } catch (err) {
        console.error("Failed to fetch stock data:", err);
        setError("Failed to load stock information");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stockId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-emerald-600">
        Loading stock information...
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="max-w-6xl mx-auto my-8 p-4">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
        >
          Back to Stocks
        </button>
        <div className="text-center py-4 text-red-500">
          {error || "Stock not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 p-4">
      <button
        onClick={handleBack}
        className="mb-6 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
      >
        Back to Stocks
      </button>

      <div className="bg-white rounded shadow p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-800">
            {stock.symbol} - {stock.name}
          </h1>
          <div className="text-2xl mt-2 text-emerald-700">
            ${stock.price.toFixed(2)}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-emerald-700 mb-2">
            About {stock.name}
          </h2>
          <p className="text-emerald-600">
            {stock.description || "No description available."}
          </p>
        </div>

        {/* Price History */}
        <div>
          <h2 className="text-xl font-semibold text-emerald-700 mb-4">
            Price History
          </h2>

          {priceHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-emerald-100">
                  {priceHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-emerald-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">
                        ${item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-emerald-500">No price history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
