"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PositionCard from "./PositionCard";
import LeverageControl from "./LeverageControl";
import { RefreshCw, TrendingUp, List, AlertCircle } from "lucide-react";

export default function AccountTradingCard({ apiKey, onRefresh, loading }) {
  const [activeTab, setActiveTab] = useState("positions");
  const [accountData, setAccountData] = useState({
    balance: null,
    positions: [],
    orders: [],
    error: null,
  });
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    if (apiKey) {
      fetchAccountData();
    }
  }, [apiKey]);

  const fetchAccountData = async () => {
    if (!apiKey) return;

    setRefreshLoading(true);
    try {
      const { BybitAPI } = await import("@/lib/bybit");
      const api = new BybitAPI(apiKey.apiKey, apiKey.apiSecret, apiKey.testnet);

      const [balanceData, positionsData, ordersData] = await Promise.all([
        api.getAccountBalance().catch((e) => ({ error: e.message })),
        api.getPositions().catch((e) => ({ error: e.message })),
        api.getActiveOrders().catch((e) => ({ error: e.message })),
      ]);

      setAccountData({
        balance: balanceData?.result?.list?.[0] || null,
        positions:
          positionsData?.result?.list?.filter(
            (p) =>
              parseFloat(p.size || 0) > 0 ||
              parseFloat(p.unrealisedPnl || 0) !== 0
          ) || [],
        orders: ordersData?.result?.list || [],
        error:
          balanceData.error || positionsData.error || ordersData.error || null,
      });
    } catch (error) {
      setAccountData((prev) => ({ ...prev, error: error.message }));
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, symbol) => {
    try {
      const { BybitAPI } = await import("@/lib/bybit");
      const api = new BybitAPI(apiKey.apiKey, apiKey.apiSecret, apiKey.testnet);

      await api.cancelOrder(orderId, symbol);
      await fetchAccountData(); // Refresh data
      alert("Order cancelled successfully!");
    } catch (error) {
      alert(`Failed to cancel order: ${error.message}`);
    }
  };

  const tabs = [
    {
      id: "positions",
      label: "Positions",
      icon: TrendingUp,
      count: accountData.positions.length,
    },
    {
      id: "orders",
      label: "Orders",
      icon: List,
      count: accountData.orders.length,
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold">{apiKey.name}</h3>
            <span
              className={`px-2 py-1 text-xs rounded ${
                apiKey.testnet
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {apiKey.testnet ? "TESTNET" : "MAINNET"}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={fetchAccountData}
            disabled={refreshLoading}
            className="p-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      }
      className="mb-4"
    >
      {/* Account Balance Summary */}
      {accountData.balance && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Equity:</span>
              <span className="ml-1 font-medium">
                ${parseFloat(accountData.balance.totalEquity || 0).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Available:</span>
              <span className="ml-1 font-medium">
                $
                {parseFloat(
                  accountData.balance.totalAvailableBalance || 0
                ).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Unrealized PnL:</span>
              <span
                className={`ml-1 font-medium ${
                  parseFloat(accountData.balance.totalUnrealisedPnl || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                $
                {parseFloat(
                  accountData.balance.totalUnrealisedPnl || 0
                ).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Margin Used:</span>
              <span className="ml-1 font-medium">
                $
                {parseFloat(
                  accountData.balance.totalInitialMargin || 0
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {accountData.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{accountData.error}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-32">
        {activeTab === "positions" && (
          <div>
            {accountData.positions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No open positions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {accountData.positions.map((position, index) => (
                  <PositionCard
                    key={`${position.symbol}-${index}`}
                    position={position}
                    selectedKey={apiKey}
                    onLeverageUpdate={fetchAccountData}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            {accountData.orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <List className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No active orders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {accountData.orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{order.symbol}</span>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            order.side === "Buy"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.side}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {order.orderType}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Qty: {order.qty}</span>
                        {order.price && (
                          <span className="ml-4">Price: ${order.price}</span>
                        )}
                        <span className="ml-4">
                          Status: {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleCancelOrder(order.orderId, order.symbol)
                      }
                      className="text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
