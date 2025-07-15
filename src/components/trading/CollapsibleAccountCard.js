"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import {
  RefreshCw,
  TrendingUp,
  List,
  AlertCircle,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function CollapsibleAccountCard({ apiKey, onRefresh, loading }) {
  const [activeTab, setActiveTab] = useState("positions");
  const [isExpanded, setIsExpanded] = useState(false);
  const [accountData, setAccountData] = useState({
    balance: null,
    positions: [],
    orders: [],
    error: null,
  });
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [closingAll, setClosingAll] = useState(false);

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
      await fetchAccountData();
      alert("Order cancelled successfully!");
    } catch (error) {
      alert(`Failed to cancel order: ${error.message}`);
    }
  };

  const handleClosePosition = async (position) => {
    if (
      !confirm(
        `Are you sure you want to close this ${position.side} ${position.size} ${position.symbol} position?`
      )
    ) {
      return;
    }

    try {
      const { BybitAPI } = await import("@/lib/bybit");
      const api = new BybitAPI(apiKey.apiKey, apiKey.apiSecret, apiKey.testnet);

      const result = await api.closePosition(
        position.symbol,
        position.side,
        position.size
      );

      if (result?.result?.orderId) {
        alert(
          `✅ Position close order placed! Order ID: ${result.result.orderId}`
        );
        await fetchAccountData();
      }
    } catch (error) {
      alert(`❌ Failed to close position: ${error.message}`);
    }
  };

  const handleCloseAllPositions = async () => {
    const openPositions = accountData.positions.filter(
      (p) => parseFloat(p.size || 0) > 0
    );

    if (openPositions.length === 0) {
      alert("No open positions to close");
      return;
    }

    const positionsList = openPositions
      .map((p) => `${p.side} ${p.size} ${p.symbol}`)
      .join(", ");

    if (
      !confirm(
        `Are you sure you want to close ALL ${openPositions.length} positions?\n\nPositions: ${positionsList}`
      )
    ) {
      return;
    }

    setClosingAll(true);
    try {
      const { BybitAPI } = await import("@/lib/bybit");
      const api = new BybitAPI(apiKey.apiKey, apiKey.apiSecret, apiKey.testnet);

      const result = await api.closeAllPositions();

      if (result.success) {
        const { successCount, totalCount } = result;

        if (successCount === totalCount) {
          alert(`✅ All ${successCount} positions closed successfully!`);
        } else {
          alert(
            `⚠️ ${successCount}/${totalCount} positions closed successfully.`
          );
        }

        setTimeout(fetchAccountData, 1000);
      }
    } catch (error) {
      alert(`❌ Failed to close positions: ${error.message}`);
    } finally {
      setClosingAll(false);
    }
  };

  const openPositionsCount = accountData.positions.filter(
    (p) => parseFloat(p.size || 0) > 0
  ).length;
  const totalPnl = accountData.positions.reduce(
    (sum, p) => sum + parseFloat(p.unrealisedPnl || 0),
    0
  );

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg mb-4 overflow-hidden">
      {/* Header - Always Visible */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-white">
                {apiKey.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  apiKey.testnet
                    ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
                    : "bg-red-900/30 text-red-400 border border-red-700"
                }`}
              >
                {apiKey.testnet ? "TESTNET" : "MAINNET"}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              {accountData.balance && (
                <div className="text-gray-400">
                  <span className="text-white font-medium">
                    $
                    {parseFloat(accountData.balance.totalEquity || 0).toFixed(
                      2
                    )}
                  </span>
                </div>
              )}

              {openPositionsCount > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">
                    {openPositionsCount} positions
                  </span>
                  <span
                    className={`font-medium ${
                      totalPnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                fetchAccountData();
              }}
              disabled={refreshLoading}
              className="text-gray-400 hover:text-white p-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`}
              />
            </Button>

            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Mobile Quick Stats */}
        <div className="sm:hidden mt-2 flex items-center justify-between text-sm">
          {accountData.balance && (
            <div className="text-gray-400">
              Balance:{" "}
              <span className="text-white font-medium">
                ${parseFloat(accountData.balance.totalEquity || 0).toFixed(2)}
              </span>
            </div>
          )}

          {openPositionsCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">
                {openPositionsCount} positions
              </span>
              <span
                className={`font-medium ${
                  totalPnl >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-4">
          {/* Account Balance Summary */}
          {accountData.balance && (
            <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Equity:</span>
                  <span className="ml-1 font-medium text-white">
                    $
                    {parseFloat(accountData.balance.totalEquity || 0).toFixed(
                      2
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Available:</span>
                  <span className="ml-1 font-medium text-white">
                    $
                    {parseFloat(
                      accountData.balance.totalAvailableBalance || 0
                    ).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Unrealized PnL:</span>
                  <span
                    className={`ml-1 font-medium ${
                      parseFloat(accountData.balance.totalUnrealisedPnl || 0) >=
                      0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {parseFloat(accountData.balance.totalUnrealisedPnl || 0) >=
                    0
                      ? "+"
                      : ""}
                    $
                    {parseFloat(
                      accountData.balance.totalUnrealisedPnl || 0
                    ).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Used Margin:</span>
                  <span className="ml-1 font-medium text-white">
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
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{accountData.error}</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-700 mb-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("positions")}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "positions"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Positions</span>
                {openPositionsCount > 0 && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === "positions"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {openPositionsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
                <span>Orders</span>
                {accountData.orders.length > 0 && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === "orders"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {accountData.orders.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-32">
            {activeTab === "positions" && (
              <div>
                {/* Close All Button */}
                {openPositionsCount > 0 && (
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="ghost"
                      onClick={handleCloseAllPositions}
                      disabled={closingAll}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      {closingAll ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent mr-2"></div>
                          Closing All...
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 mr-2" />
                          Close All Positions ({openPositionsCount})
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {accountData.positions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p>No open positions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {accountData.positions.map((position, index) => (
                      <PositionCard
                        key={`${position.symbol}-${index}`}
                        position={position}
                        onClosePosition={() => handleClosePosition(position)}
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
                    <List className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p>No active orders</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {accountData.orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-white">
                              {order.symbol}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                order.side === "Buy"
                                  ? "bg-green-900/30 text-green-400"
                                  : "bg-red-900/30 text-red-400"
                              }`}
                            >
                              {order.side}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-400 rounded">
                              {order.orderType}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            <span>Qty: {order.qty}</span>
                            {order.price && (
                              <span className="ml-4">
                                Price: ${order.price}
                              </span>
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
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
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
        </div>
      )}
    </div>
  );
}

// Individual Position Card Component
function PositionCard({ position, onClosePosition }) {
  const [closing, setClosing] = useState(false);

  const isLong = position.side === "Buy";
  const pnl = parseFloat(position.unrealisedPnl || 0);
  const pnlPercentage = parseFloat(position.unrealisedPnlPercentage || 0);
  const pnlColor = pnl >= 0 ? "text-green-400" : "text-red-400";
  const size = parseFloat(position.size || 0);
  const leverage = position.leverage || "1";

  const handleClose = async () => {
    setClosing(true);
    await onClosePosition();
    setClosing(false);
  };

  const getMarginMode = () => {
    return position.tradeMode === 1 ? "Isolated" : "Cross";
  };

  return (
    <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-white">{position.symbol}</h4>
            <span
              className={`text-xs px-2 py-1 rounded ${
                getMarginMode() === "Isolated"
                  ? "bg-purple-900/30 text-purple-400"
                  : "bg-blue-900/30 text-blue-400"
              }`}
            >
              {getMarginMode()}
            </span>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              isLong
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/30 text-red-400"
            }`}
          >
            {position.side} {size} ({leverage}x)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm text-gray-400">Entry Price</div>
            <div className="font-medium text-white">
              ${parseFloat(position.avgPrice || 0).toFixed(2)}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={closing}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
            title="Close Position"
          >
            {closing ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Mark Price:</span>
          <span className="ml-1 font-medium text-white">
            ${parseFloat(position.markPrice || 0).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Unrealized PnL:</span>
          <div className={`ml-1 font-medium ${pnlColor}`}>
            <div>
              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
            </div>
            {pnlPercentage !== 0 && (
              <div className="text-xs">
                ({pnlPercentage > 0 ? "+" : ""}
                {pnlPercentage.toFixed(2)}%)
              </div>
            )}
          </div>
        </div>
        <div>
          <span className="text-gray-400">Position Value:</span>
          <span className="ml-1 font-medium text-white">
            ${parseFloat(position.positionValue || 0).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Liq. Price:</span>
          <span className="ml-1 font-medium text-red-400">
            ${parseFloat(position.liqPrice || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
