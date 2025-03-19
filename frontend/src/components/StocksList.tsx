"use client";

import { useState, useEffect } from "react";
import { Stock } from "../types/stock";
import { getStocks } from "../lib/api";

export default function StocksList() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6">Available Stocks</h1>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 font-medium">
          <div>Symbol</div>
          <div>Name</div>
          <div>Price</div>
          <div>Description</div>
        </div>

        {stocks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No stocks available.
          </div>
        ) : (
          stocks.map((stock) => (
            <div
              key={stock.id}
              className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200"
            >
              <div className="font-medium">{stock.symbol}</div>
              <div>{stock.name}</div>
              <div>${stock.price.toFixed(2)}</div>
              <div className="text-sm text-gray-600">{stock.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
