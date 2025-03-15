"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Portfolio, Stock, PortfolioItem } from "@/lib/types";
import PortfolioItemComponent from "@/components/portfolio-item";

export default function PortfolioDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStock, setNewStock] = useState({
    stockSymbol: "",
    quantity: 1,
    purchasePrice: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioData, stocksData] = await Promise.all([
          api.getPortfolio(params.id),
          api.getStocks(),
        ]);
        setPortfolio(portfolioData);
        setAvailableStocks(stocksData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load portfolio data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStock.stockSymbol) return;

    try {
      const addedItem = await api.addStockToPortfolio(params.id, {
        stockSymbol: newStock.stockSymbol,
        quantity: newStock.quantity,
        purchasePrice: newStock.purchasePrice,
      });

      // Update portfolio with new item
      if (portfolio && portfolio.items) {
        const selectedStock = availableStocks.find(
          (s) => s.symbol === newStock.stockSymbol
        );
        const newItem = { ...addedItem, stock: selectedStock };
        setPortfolio({
          ...portfolio,
          items: [...portfolio.items, newItem],
        });
      }

      // Reset form
      setNewStock({
        stockSymbol: "",
        quantity: 1,
        purchasePrice: 0,
      });
    } catch (err) {
      console.error("Error adding stock:", err);
      setError("Failed to add stock to portfolio");
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error || !portfolio) {
    return (
      <div className="text-center p-8 text-red-500">
        {error || "Portfolio not found"}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{portfolio.name}</h1>
      <p className="text-gray-600 mb-6">
        Created: {new Date(portfolio.createdAt).toLocaleDateString()}
      </p>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add Stock to Portfolio</h2>
        <form onSubmit={handleAddStock} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Stock</label>
              <select
                value={newStock.stockSymbol}
                onChange={(e) =>
                  setNewStock({ ...newStock, stockSymbol: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a stock</option>
                {availableStocks.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Quantity</label>
              <input
                type="number"
                value={newStock.quantity}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Purchase Price ($)</label>
              <input
                type="number"
                value={newStock.purchasePrice}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    purchasePrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border rounded"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Stock
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Portfolio Stocks</h2>

      {portfolio.items && portfolio.items.length > 0 ? (
        <div className="space-y-4">
          {portfolio.items.map((item) => (
            <PortfolioItemComponent key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 p-4 bg-gray-50 rounded">
          No stocks in this portfolio yet. Add your first stock using the form
          above.
        </p>
      )}
    </div>
  );
}
