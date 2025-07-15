"use client";

import { useState, useEffect } from "react";
import { useApiKeys } from "@/hooks/useApiKeys";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import MultiAccountOrderForm from "@/components/trading/MultiAccountOrderForm";
import AccountTradingCard from "@/components/trading/AccountTradingCard";
import Card from "@/components/ui/Card";
import { TrendingUp, Users, AlertCircle } from "lucide-react";

export default function Trading() {
  const { apiKeys, loading: keysLoading } = useApiKeys();
  const [placingOrders, setPlacingOrders] = useState(false);
  const [orderResults, setOrderResults] = useState([]);

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

  if (keysLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading API keys...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Multi-Account Trading
                </h1>
                <p className="text-gray-600">
                  Place orders across multiple accounts and monitor all
                  positions
                </p>
              </div>

              {/* No API Keys Message */}
              {apiKeys.length === 0 && (
                <Card>
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No API Keys Connected
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Connect your Bybit API keys to start trading
                    </p>
                    <button
                      onClick={() => (window.location.href = "/api-keys")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add API Keys
                    </button>
                  </div>
                </Card>
              )}

              {/* Multi-Account Order Form */}
              {apiKeys.length > 0 && (
                <MultiAccountOrderForm
                  apiKeys={apiKeys}
                  onSubmitOrders={handleMultiOrderSubmit}
                  loading={placingOrders}
                />
              )}

              {/* Order Results */}
              {orderResults.length > 0 && (
                <Card title="Order Results" className="mb-6">
                  <div className="space-y-2">
                    {orderResults.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          result.success
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              result.success ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <span className="font-medium">
                            {result.accountName}
                          </span>
                          <span className="text-sm text-gray-600">
                            {result.side} {result.qty} {result.symbol}
                          </span>
                        </div>
                        <div className="text-sm">
                          {result.success ? (
                            <span className="text-green-700">
                              ✅ Order ID: {result.orderId?.slice(0, 8)}...
                            </span>
                          ) : (
                            <span className="text-red-700">
                              ❌ {result.error}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Account Cards */}
              {apiKeys.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Account Overview ({apiKeys.length})
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <AccountTradingCard
                        key={apiKey.id}
                        apiKey={apiKey}
                        loading={placingOrders}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
