"use client";

import { useState } from "react";
import { Trade } from "../types/trade";

interface TradeItemProps {
  trade: Trade;
  onUpdate: (id: number, pnl: number, isHolding: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TradeItem({
  trade,
  onUpdate,
  onDelete,
}: TradeItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pnl, setPnl] = useState<string>(trade.pnl.toString());
  const [isHolding, setIsHolding] = useState(trade.isHolding);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSave = async () => {
    await onUpdate(trade.id, parseFloat(pnl) || 0, isHolding);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 items-center">
      <div>
        <div className="font-medium">{trade.stockSymbol}</div>
        <div className="text-sm text-gray-600">{trade.stockName}</div>
      </div>

      <div>${trade.entryPrice.toFixed(2)}</div>

      {isEditing ? (
        <div>
          <input
            type="number"
            value={pnl}
            onChange={(e) => setPnl(e.target.value)}
            className="w-24 p-1 border rounded"
            step="0.01"
          />
        </div>
      ) : (
        <div className={trade.pnl >= 0 ? "text-green-600" : "text-red-600"}>
          ${trade.pnl.toFixed(2)}
        </div>
      )}

      <div>{formatDate(trade.date)}</div>

      {isEditing ? (
        <div>
          <select
            value={isHolding ? "true" : "false"}
            onChange={(e) => setIsHolding(e.target.value === "true")}
            className="p-1 border rounded"
          >
            <option value="true">Holding</option>
            <option value="false">Closed</option>
          </select>
        </div>
      ) : (
        <div>
          <span
            className={`px-2 py-1 rounded text-xs ${
              trade.isHolding
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {trade.isHolding ? "Holding" : "Closed"}
          </span>
        </div>
      )}

      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setPnl(trade.pnl.toString());
                setIsHolding(trade.isHolding);
              }}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(trade.id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
