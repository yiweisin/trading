"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Trade } from "../types/trade";
import { Stock } from "../types/stock";
import {
  getTrades,
  getStocks,
  getStockPrices,
  createTrade,
  sellTrade,
} from "../lib/api";
import TradeItem from "./TradeItem";
import AddTradeForm from "./AddTradeForm";

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trades, stocks and current prices
      const [tradesData, stocksData, stockPrices] = await Promise.all([
        getTrades(),
        getStocks(),
        getStockPrices(),
      ]);

      // Store all trades for PNL calculation
      setAllTrades(tradesData);

      // Filter only holding trades for dashboard
      const holdingTrades = tradesData.filter((trade) => trade.isHolding);

      // Add current prices to any active trades
      const tradesWithCurrentPrices = holdingTrades.map((trade) => {
        // Find current price for this stock
        const stockPrice = stockPrices.find((sp) => sp.id === trade.stockId);
        if (stockPrice) {
          return {
            ...trade,
            currentPrice: stockPrice.price,
          };
        }
        return trade;
      });

      setTrades(tradesWithCurrentPrices);
      setStocks(stocksData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh stock prices periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Refresh data when counter changes
  useEffect(() => {
    if (refreshCounter > 0) {
      const updatePrices = async () => {
        try {
          const stockPrices = await getStockPrices();

          setTrades((prevTrades) =>
            prevTrades.map((trade) => {
              const stockPrice = stockPrices.find(
                (sp) => sp.id === trade.stockId
              );
              if (stockPrice) {
                return {
                  ...trade,
                  currentPrice: stockPrice.price,
                };
              }
              return trade;
            })
          );
        } catch (err) {
          console.error("Failed to update prices:", err);
        }
      };

      updatePrices();
    }
  }, [refreshCounter]);

  const handleAddTrade = async (stockId: number) => {
    try {
      // Find current stock price to use as entry price
      const stock = stocks.find((s) => s.id === stockId);
      if (!stock) {
        throw new Error("Stock not found");
      }

      await createTrade({
        stockId,
        entryPrice: stock.price,
        isHolding: true,
      });

      fetchData();
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add trade");
      console.error(err);
    }
  };

  const handleSellTrade = async (id: number, pnl: number) => {
    try {
      await sellTrade(id, pnl);
      fetchData();
    } catch (err) {
      setError("Failed to sell trade");
      console.error(err);
    }
  };

  if (loading && trades.length === 0)
    return <div className="text-center py-4 text-emerald-600">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  // Calculate statistics for all trades
  const activePositions = trades.length;
  const totalPnL = allTrades.reduce((sum, trade) => {
    // For closed trades, use stored PNL
    if (!trade.isHolding) {
      return sum + trade.pnl;
    }

    // For active trades, calculate PNL based on current price if available
    if (trade.isHolding) {
      const currentTrade = trades.find((t) => t.id === trade.id);
      if (currentTrade && currentTrade.currentPrice) {
        return sum + (currentTrade.currentPrice - trade.entryPrice);
      }
    }

    return sum;
  }, 0);

  const pnlClass = totalPnL >= 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div className="max-w-6xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Active Positions
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/trades"
            className="text-emerald-600 hover:text-emerald-800 transition-colors mr-4"
          >
            See All Trades
          </Link>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
          >
            {showAddForm ? "Cancel" : "Buy Stock"}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium text-emerald-700">
            Active Positions
          </h3>
          <p className="text-2xl font-bold text-emerald-800">
            {activePositions}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium text-emerald-700">Total P&L</h3>
          <p className={`text-2xl font-bold ${pnlClass}`}>
            ${totalPnL.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Add Trade Form */}
      {showAddForm && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-emerald-800">
            Buy Stock
          </h2>
          <AddTradeForm stocks={stocks} onAddTrade={handleAddTrade} />
        </div>
      )}

      {/* Trade List */}
      <div className="bg-white rounded shadow overflow-hidden">
        {trades.length === 0 ? (
          <div className="p-6 text-center text-emerald-500">
            No active positions.
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-7 gap-4 p-4 bg-emerald-50 font-medium">
              <div className="text-emerald-800">Stock</div>
              <div className="text-emerald-800">Entry Price</div>
              <div className="text-emerald-800">Current Price</div>
              <div className="text-emerald-800">P&L</div>
              <div className="text-emerald-800">Date</div>
              <div className="text-emerald-800">Status</div>
              <div className="text-emerald-800">Actions</div>
            </div>
            <div>
              {trades.map((trade) => (
                <TradeItem
                  key={trade.id}
                  trade={trade}
                  onSell={handleSellTrade}
                  onDelete={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
