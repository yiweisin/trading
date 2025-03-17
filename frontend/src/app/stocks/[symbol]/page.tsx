"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getStockDetails } from "@/services/api";
import { createTrade } from "@/services/tradeApi";
import { Stock } from "@/types/portfolio";
import { CreateTradeRequest, TradeType } from "@/types/tradelog";

export default function StockDetailPage({
  params,
}: {
  params: { symbol: string };
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stock, setStock] = useState<Stock | null>(null);
  const [isStockLoading, setIsStockLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [tradeType, setTradeType] = useState<TradeType>("Buy");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const data = await getStockDetails(params.symbol);
        setStock(data);
        setIsStockLoading(false);
      } catch (err) {
        setError("Failed to load stock details");
        setIsStockLoading(false);
      }
    };

    if (isAuthenticated && params.symbol) {
      fetchStockDetails();
    }
  }, [isAuthenticated, params.symbol]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const tradeData: CreateTradeRequest = {
        stockSymbol: params.symbol,
        type: tradeType,
        sharePrice: stock?.currentPrice || 0,
        quantity: quantity,
      };

      await createTrade(tradeData);
      setSuccessMessage(
        `Successfully ${
          tradeType === "Buy" ? "bought" : "sold"
        } ${quantity} shares of ${params.symbol}`
      );

      // Reset form
      setQuantity(1);
      setTradeType("Buy");
    } catch (err: any) {
      setError(err.message || "Failed to create trade");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isStockLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  if (!stock) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Stock not found</p>
          <Link
            href="/stocks"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Stocks
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = quantity * stock.currentPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                Trading App
              </span>
              <div className="ml-10 flex space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Dashboard
                </Link>
                <Link
                  href="/stocks"
                  className="text-indigo-600 border-b-2 border-indigo-600 px-3 py-2"
                >
                  Stocks
                </Link>
                <Link
                  href="/portfolio"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Portfolio
                </Link>
                <Link
                  href="/trades"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Trade History
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">
                Welcome, {user.username}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-6">
            <Link
              href="/stocks"
              className="mr-4 text-indigo-600 hover:text-indigo-800"
            >
              &larr; Back to Stocks
            </Link>
            <h1 className="text-2xl font-bold">
              {stock.name} ({stock.symbol})
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Stock Details
                  </h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Symbol
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {stock.symbol}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Current Price
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${stock.currentPrice.toFixed(2)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Industry
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {stock.industry || "N/A"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {stock.description || "No description available."}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Trade {stock.symbol}
                  </h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      {successMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                      </label>
                      <div className="flex">
                        <button
                          type="button"
                          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
                            tradeType === "Buy"
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setTradeType("Buy")}
                        >
                          Buy
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
                            tradeType === "Sell"
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setTradeType("Sell")}
                        >
                          Sell
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Summary
                      </label>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Price per share:
                          </span>
                          <span className="text-sm font-medium">
                            ${stock.currentPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Quantity:
                          </span>
                          <span className="text-sm font-medium">
                            {quantity}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium">Total:</span>
                          <span className="text-sm font-bold">
                            ${totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        tradeType === "Buy"
                          ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                          : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : tradeType === "Buy"
                        ? "Buy Shares"
                        : "Sell Shares"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
