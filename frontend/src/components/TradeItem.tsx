"use client";

import React from "react";
import { useState } from "react";
import { Trade } from "../types/trade";

interface TradeItemProps {
  trade: Trade;
  onSell: (id: number, pnl: number) => void;
  onDelete: (id: number) => void;
}

export default function TradeItem({ trade, onSell, onDelete }: TradeItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate current PNL if holding (use stored PNL if closed)
  const pnl =
    trade.isHolding && trade.currentPrice
      ? ((trade.currentPrice - trade.entryPrice) * 100) / 100
      : trade.pnl;

  const pnlDisplay = pnl.toFixed(2);
  const pnlClass = pnl >= 0 ? "text-green-600" : "text-red-600";

  // Calculate percent change
  const percentChange =
    trade.isHolding && trade.currentPrice
      ? ((trade.currentPrice - trade.entryPrice) / trade.entryPrice) * 100
      : (trade.pnl / trade.entryPrice) * 100;

  const percentChangeDisplay = percentChange.toFixed(2);

  const handleSell = async () => {
    if (trade.isHolding && trade.currentPrice) {
      await onSell(trade.id, pnl);
    }
  };

  return (
    <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 items-center">
      <div>
        <div className="font-medium">{trade.stockSymbol}</div>
        <div className="text-sm text-gray-600">{trade.stockName}</div>
      </div>

      <div>${trade.entryPrice.toFixed(2)}</div>

      {trade.isHolding && trade.currentPrice ? (
        <div className="font-medium">${trade.currentPrice.toFixed(2)}</div>
      ) : (
        <div>—</div>
      )}

      <div className={pnlClass}>
        ${pnlDisplay} ({percentChangeDisplay}%)
      </div>

      <div>{formatDate(trade.date)}</div>

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

      <div className="flex space-x-2">
        {trade.isHolding ? (
          <button
            onClick={handleSell}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded"
          >
            Sell
          </button>
        ) : null}
        <button
          onClick={() => onDelete(trade.id)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
