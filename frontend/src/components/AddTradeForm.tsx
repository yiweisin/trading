"use client";

import { useState } from "react";
import { Stock } from "../types/stock";

interface AddTradeFormProps {
  stocks: Stock[];
  onAddTrade: (trade: { stockId: number; entryPrice: number }) => void;
}

export default function AddTradeForm({
  stocks,
  onAddTrade,
}: AddTradeFormProps) {
  const [stockId, setStockId] = useState<number>(
    stocks.length > 0 ? stocks[0].id : 0
  );
  const [entryPrice, setEntryPrice] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTrade({
      stockId,
      entryPrice,
    });
  };

  const selectedStock = stocks.find((s) => s.id === stockId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="stock" className="block mb-1 font-medium">
          Select Stock
        </label>
        <select
          id="stock"
          value={stockId}
          onChange={(e) => setStockId(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStock && (
        <div className="p-3 bg-gray-50 rounded">
          <p>
            <span className="font-medium">Current Price:</span> $
            {selectedStock.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {selectedStock.description}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="entryPrice" className="block mb-1 font-medium">
          Entry Price ($)
        </label>
        <input
          type="number"
          id="entryPrice"
          value={entryPrice}
          onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Trade
        </button>
      </div>
    </form>
  );
}
