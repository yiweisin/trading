"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useApiKeys } from "@/hooks/useApiKeys";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import MultiAccountOrderForm from "@/components/trading/MultiAccountOrderForm";
import CollapsibleAccountCard from "@/components/trading/CollapsibleAccountCard";
import { TrendingUp, Users, AlertCircle } from "lucide-react";

export default function TradingPage() {
  const { user, loading: authLoading } = useAuth();
  const { apiKeys, loading: keysLoading } = useApiKeys();
  const [placingOrders, setPlacingOrders] = useState(false);
  const [orderResults, setOrderResults] = useState([]);
  const router = useRouter();

  const handleMultiOrderSubmit = async (ordersToPlace) => {
    setPlacingOrders(true);
    setOrderResults([]);

    const results = [];

    try {
      // Place orders sequentially to avoid rate limiting
      for (const { apiKey, orderData } of ordersToPlace) {
        try {
          const { BybitAPI } = await import("@/lib/bybit");
          const api = new BybitAPI(
            apiKey.apiKey,
            apiKey.apiSecret,
            apiKey.testnet
          );

          const result = await api.placeOrder(orderData);
          results.push({
            accountName: apiKey.name,
            success: true,
            orderId: result.result?.orderId,
            symbol: orderData.symbol,
            side: orderData.side,
            qty: orderData.qty,
          });

          // Small delay between orders to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Order failed for ${apiKey.name}:`, error);
          results.push({
            accountName: apiKey.name,
            success: false,
            error: error.message,
            symbol: orderData.symbol,
            side: orderData.side,
            qty: orderData.qty,
          });
        }
      }

      setOrderResults(results);

      // Show summary
      const successCount = results.filter((r) => r.success).length;
      const totalCount = results.length;

      if (successCount === totalCount) {
        alert(`✅ All ${successCount} orders placed successfully!`);
      } else {
        alert(
          `⚠️ ${successCount}/${totalCount} orders placed successfully. Check results below.`
        );
      }
    } catch (error) {
      console.error("Multi-order submission failed:", error);
      alert(`Failed to place orders: ${error.message}`);
    } finally {
      setPlacingOrders(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Header />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Multi-Account Trading
              </h1>
              <p className="text-gray-400">
                Place orders across multiple accounts and monitor all positions
              </p>
            </div>

            {/* Loading State */}
            {keysLoading && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading API keys...</p>
              </div>
            )}

            {/* No API Keys Message */}
            {!keysLoading && apiKeys.length === 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No API Keys Connected
                </h3>
                <p className="text-gray-400 mb-6">
                  Connect your Bybit API keys to start trading
                </p>
                <button
                  onClick={() => router.push("/api-keys")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add API Keys
                </button>
              </div>
            )}

            {/* Multi-Account Order Form */}
            {!keysLoading && apiKeys.length > 0 && (
              <MultiAccountOrderForm
                apiKeys={apiKeys}
                onSubmitOrders={handleMultiOrderSubmit}
                loading={placingOrders}
              />
            )}

            {/* Order Results */}
            {orderResults.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Order Results
                </h3>
                <div className="space-y-2">
                  {orderResults.map((result, index) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg ${
                        result.success
                          ? "bg-green-900/20 border border-green-700"
                          : "bg-red-900/20 border border-red-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            result.success ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span className="font-medium text-white">
                          {result.accountName}
                        </span>
                        <span className="text-sm text-gray-400">
                          {result.side} {result.qty} {result.symbol}
                        </span>
                      </div>
                      <div className="text-sm ml-5 sm:ml-0">
                        {result.success ? (
                          <span className="text-green-400">
                            ✅ Order ID: {result.orderId?.slice(0, 8)}...
                          </span>
                        ) : (
                          <span className="text-red-400">
                            ❌ {result.error}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Results Button */}
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setOrderResults([])}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Clear Results
                  </button>
                </div>
              </div>
            )}

            {/* Account Cards */}
            {!keysLoading && apiKeys.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-white">
                      Account Overview ({apiKeys.length})
                    </h2>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Expand all cards
                        const expandButtons =
                          document.querySelectorAll("[data-expand-card]");
                        expandButtons.forEach((btn) => {
                          if (!btn.getAttribute("data-expanded")) {
                            btn.click();
                          }
                        });
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 rounded border border-blue-600 hover:border-blue-500 transition-colors"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={() => {
                        // Collapse all cards
                        const expandButtons =
                          document.querySelectorAll("[data-expand-card]");
                        expandButtons.forEach((btn) => {
                          if (btn.getAttribute("data-expanded")) {
                            btn.click();
                          }
                        });
                      }}
                      className="text-gray-400 hover:text-gray-300 text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-500 transition-colors"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {apiKeys.map((apiKey) => (
                    <CollapsibleAccountCard
                      key={apiKey.id}
                      apiKey={apiKey}
                      loading={placingOrders}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-12 text-center text-gray-500 text-sm">
              <p>
                Multi-account trading interface for Bybit futures.
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> | </span>
                Always use proper risk management.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
