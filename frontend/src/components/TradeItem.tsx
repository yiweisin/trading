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
  const pnlClass = pnl >= 0 ? "text-emerald-600" : "text-red-600";

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
    <div className="grid grid-cols-7 gap-4 p-4 border-b border-emerald-200 items-center hover:bg-emerald-50 transition-colors">
      <div>
        <div className="font-medium text-emerald-800">{trade.stockSymbol}</div>
        <div className="text-sm text-emerald-600">{trade.stockName}</div>
      </div>

      <div className="text-emerald-700">${trade.entryPrice.toFixed(2)}</div>

      {trade.isHolding && trade.currentPrice ? (
        <div className="font-medium text-emerald-800">
          ${trade.currentPrice.toFixed(2)}
        </div>
      ) : (
        <div>—</div>
      )}

      <div className={`font-medium ${pnlClass}`}>
        ${pnlDisplay} ({percentChangeDisplay}%)
      </div>

      <div className="text-emerald-600">{formatDate(trade.date)}</div>

      <div>
        <span
          className={`px-2 py-1 rounded text-xs ${
            trade.isHolding
              ? "bg-emerald-100 text-emerald-800"
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
            className="px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
          >
            Sell
          </button>
        ) : null}
        <button
          onClick={() => onDelete(trade.id)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
