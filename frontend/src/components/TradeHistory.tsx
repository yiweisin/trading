"use client";

import { useState, useEffect } from "react";
import { Trade } from "../types/trade";
import { Stock } from "../types/stock";
import {
  getTrades,
  getStocks,
  createTrade,
  updateTrade,
  deleteTrade,
} from "../lib/api";
import TradeItem from "./TradeItem";
import AddTradeForm from "./AddTradeForm";

export default function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tradesData, stocksData] = await Promise.all([
        getTrades(),
        getStocks(),
      ]);

      setTrades(tradesData);
      setStocks(stocksData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTrade = async (newTrade: {
    stockId: number;
    entryPrice: number;
  }) => {
    try {
      await createTrade({
        stockId: newTrade.stockId,
        entryPrice: newTrade.entryPrice,
        isHolding: true,
      });
      fetchData();
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add trade");
      console.error(err);
    }
  };

  const handleUpdateTrade = async (
    id: number,
    pnl: number,
    isHolding: boolean
  ) => {
    try {
      await updateTrade(id, { pnl, isHolding });
      fetchData();
    } catch (err) {
      setError("Failed to update trade");
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

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  // Calculate statistics
  const activePositions = trades.filter((trade) => trade.isHolding).length;
  const closedPositions = trades.filter((trade) => !trade.isHolding).length;
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const pnlClass = totalPnL >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Trading History</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showAddForm ? "Cancel" : "Add New Trade"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium text-gray-700">
            Active Positions
          </h3>
          <p className="text-2xl font-bold">{activePositions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium text-gray-700">
            Closed Positions
          </h3>
          <p className="text-2xl font-bold">{closedPositions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium text-gray-700">Total P&L</h3>
          <p className={`text-2xl font-bold ${pnlClass}`}>
            ${totalPnL.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Add Trade Form */}
      {showAddForm && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Trade</h2>
          <AddTradeForm stocks={stocks} onAddTrade={handleAddTrade} />
        </div>
      )}

      {/* Trade List */}
      <div className="bg-white rounded shadow overflow-hidden">
        {trades.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No trades yet. Add your first trade above!
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 font-medium">
              <div>Stock</div>
              <div>Entry Price</div>
              <div>P&L</div>
              <div>Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div>
              {trades.map((trade) => (
                <TradeItem
                  key={trade.id}
                  trade={trade}
                  onUpdate={handleUpdateTrade}
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
