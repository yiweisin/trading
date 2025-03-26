"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Trade } from "@/types/trade";
import { Stock } from "@/types/stock";
import {
  getTrades,
  getStocks,
  getStockPrices,
  createTrade,
  sellTrade,
  deleteTrade,
} from "@/lib/api";
import TradeItem from "@/components/TradeItem";
import AddTradeForm from "@/components/AddTradeForm";

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

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

      // Add current prices to any active trades
      const tradesWithCurrentPrices = tradesData.map((trade) => {
        if (trade.isHolding) {
          // Find current price for this stock
          const stockPrice = stockPrices.find((sp) => sp.id === trade.stockId);
          if (stockPrice) {
            return {
              ...trade,
              currentPrice: stockPrice.price,
            };
          }
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
    }, 100); // Refresh every 30 seconds

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
              if (trade.isHolding) {
                const stockPrice = stockPrices.find(
                  (sp) => sp.id === trade.stockId
                );
                if (stockPrice) {
                  return {
                    ...trade,
                    currentPrice: stockPrice.price,
                  };
                }
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

  const handleDeleteTrade = async (id: number) => {
    try {
      await deleteTrade(id);
      fetchData();
    } catch (err) {
      setError("Failed to delete trade");
      console.error(err);
    }
  };

  // Filter trades based on selected filter
  const filteredTrades = trades.filter((trade) => {
    if (filter === "active") return trade.isHolding;
    if (filter === "closed") return !trade.isHolding;
    return true;
  });

  // Calculate statistics
  const activePositions = trades.filter((trade) => trade.isHolding).length;
  const closedPositions = trades.filter((trade) => !trade.isHolding).length;

  // Calculate total PNL including unrealized gains/losses
  const totalPnL = trades.reduce((sum, trade) => {
    if (trade.isHolding && trade.currentPrice) {
      // For active trades, calculate based on current price
      return sum + (trade.currentPrice - trade.entryPrice);
    } else {
      // For closed trades, use the stored PNL
      return sum + trade.pnl;
    }
  }, 0);

  const pnlClass = totalPnL >= 0 ? "text-emerald-600" : "text-red-600";

  if (loading && trades.length === 0)
    return <div className="text-center py-4 text-emerald-600">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Your Trading History
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-emerald-600">Filter:</span>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "active" | "closed")
              }
              className="px-2 py-1 border border-emerald-300 rounded text-black"
            >
              <option value="all">All Trades</option>
              <option value="active">Active Positions</option>
              <option value="closed">Closed Trades</option>
            </select>
          </div>
          <span className="text-sm text-emerald-600">
            Auto-refresh: {refreshCounter > 0 ? "Active" : "Loading..."}
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
          >
            {showAddForm ? "Cancel" : "Buy Stock"}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium text-emerald-700">
            Active Positions
          </h3>
          <p className="text-2xl font-bold text-emerald-800">
            {activePositions}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium text-emerald-700">
            Closed Positions
          </h3>
          <p className="text-2xl font-bold text-emerald-800">
            {closedPositions}
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
        {filteredTrades.length === 0 ? (
          <div className="p-6 text-center text-emerald-500">
            {filter === "active"
              ? "No active positions"
              : filter === "closed"
              ? "No closed trades"
              : "No trades yet. Buy your first stock!"}
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
              {filteredTrades.map((trade) => (
                <TradeItem
                  key={trade.id}
                  trade={trade}
                  onSell={handleSellTrade}
                  onDelete={handleDeleteTrade}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
