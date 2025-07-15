"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useApiKeys } from "@/hooks/useApiKeys";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";

export default function TradingPage() {
  const { user } = useAuth();
  const { apiKeys, loading: keysLoading } = useApiKeys();
  const [placingOrders, setPlacingOrders] = useState(false);
  const [orderResults, setOrderResults] = useState([]);
  const router = useRouter();

  // Multi-Account Order Form
  const MultiAccountOrderForm = () => {
    const [orderData, setOrderData] = useState({
      symbol: "BTCUSDT",
      side: "Buy",
      orderType: "Limit",
      price: "",
      reduceOnly: false,
    });
    const [accountOrders, setAccountOrders] = useState([]);
    const [symbolInputMode, setSymbolInputMode] = useState("dropdown");
    const [showConfirmation, setShowConfirmation] = useState(false);

    const popularSymbols = [
      "BTCUSDT",
      "ETHUSDT",
      "BNBUSDT",
      "SOLUSDT",
      "ADAUSDT",
      "DOGEUSDT",
      "XRPUSDT",
    ];

    useEffect(() => {
      if (apiKeys.length > 0 && accountOrders.length === 0) {
        setAccountOrders([
          {
            id: Date.now(),
            apiKeyId: apiKeys[0].id,
            qty: "0.001",
            enabled: true,
          },
        ]);
      }
    }, [apiKeys]);

    const handleSubmit = (e) => {
      e.preventDefault();

      const enabledOrders = accountOrders.filter((order) => order.enabled);
      const hasMainnetAccount = enabledOrders.some((order) => {
        const apiKey = apiKeys.find((k) => k.id === order.apiKeyId);
        return !apiKey?.testnet;
      });

      if (hasMainnetAccount && !showConfirmation) {
        setShowConfirmation(true);
        return;
      }

      const ordersToPlace = enabledOrders.map((accountOrder) => {
        const apiKey = apiKeys.find((k) => k.id === accountOrder.apiKeyId);
        return {
          apiKey,
          orderData: {
            symbol: orderData.symbol.toUpperCase(),
            side: orderData.side,
            orderType: orderData.orderType,
            qty: parseFloat(accountOrder.qty).toString(),
            ...(orderData.orderType === "Limit" && {
              price: parseFloat(orderData.price).toString(),
            }),
            ...(orderData.reduceOnly && { reduceOnly: true }),
          },
        };
      });

      handleMultiOrderSubmit(ordersToPlace);
      setShowConfirmation(false);
    };

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Multi-Account Order Placement
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Symbol
              </label>
              <div className="flex space-x-1 mb-1">
                <button
                  type="button"
                  onClick={() => setSymbolInputMode("dropdown")}
                  className={`px-2 py-1 text-xs rounded ${
                    symbolInputMode === "dropdown"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setSymbolInputMode("custom")}
                  className={`px-2 py-1 text-xs rounded ${
                    symbolInputMode === "custom"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Custom
                </button>
              </div>

              {symbolInputMode === "dropdown" ? (
                <select
                  value={orderData.symbol}
                  onChange={(e) =>
                    setOrderData({ ...orderData, symbol: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  required
                >
                  {popularSymbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="BTCUSDT"
                  value={orderData.symbol}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Side
              </label>
              <select
                value={orderData.side}
                onChange={(e) =>
                  setOrderData({ ...orderData, side: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="Buy">Buy / Long</option>
                <option value="Sell">Sell / Short</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Order Type
              </label>
              <select
                value={orderData.orderType}
                onChange={(e) =>
                  setOrderData({ ...orderData, orderType: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="Market">Market</option>
                <option value="Limit">Limit</option>
              </select>
            </div>

            {orderData.orderType === "Limit" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price (USDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={orderData.price}
                  onChange={(e) =>
                    setOrderData({ ...orderData, price: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  required={orderData.orderType === "Limit"}
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="reduceOnly"
              checked={orderData.reduceOnly}
              onChange={(e) =>
                setOrderData({ ...orderData, reduceOnly: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="reduceOnly" className="text-sm text-gray-300">
              Reduce Only (Close positions only)
            </label>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Account Quantities
            </h4>
            <div className="space-y-3">
              {accountOrders.map((accountOrder) => {
                const apiKey = apiKeys.find(
                  (k) => k.id === accountOrder.apiKeyId
                );
                return (
                  <div
                    key={accountOrder.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg ${
                      accountOrder.enabled
                        ? "border-green-600 bg-green-900/20"
                        : "border-gray-600 bg-gray-800/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={accountOrder.enabled}
                      onChange={() =>
                        setAccountOrders(
                          accountOrders.map((order) =>
                            order.id === accountOrder.id
                              ? { ...order, enabled: !order.enabled }
                              : order
                          )
                        )
                      }
                      className="w-4 h-4"
                    />

                    <select
                      value={accountOrder.apiKeyId}
                      onChange={(e) =>
                        setAccountOrders(
                          accountOrders.map((order) =>
                            order.id === accountOrder.id
                              ? { ...order, apiKeyId: e.target.value }
                              : order
                          )
                        )
                      }
                      className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      disabled={!accountOrder.enabled}
                    >
                      {apiKeys.map((key) => (
                        <option key={key.id} value={key.id}>
                          {key.name} ({key.testnet ? "Testnet" : "Mainnet"})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      step="0.001"
                      placeholder="Quantity"
                      value={accountOrder.qty}
                      onChange={(e) =>
                        setAccountOrders(
                          accountOrders.map((order) =>
                            order.id === accountOrder.id
                              ? { ...order, qty: e.target.value }
                              : order
                          )
                        )
                      }
                      className="w-24 p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      disabled={!accountOrder.enabled}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {showConfirmation && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h4 className="font-semibold text-red-400 mb-2">
                ⚠️ Confirm Multi-Account Orders
              </h4>
              <p className="text-red-300 text-sm mb-3">
                You are about to place REAL orders across multiple accounts:
              </p>
              <div className="space-y-1 text-red-300 text-sm mb-4">
                {accountOrders
                  .filter((order) => order.enabled)
                  .map((order) => {
                    const apiKey = apiKeys.find((k) => k.id === order.apiKeyId);
                    return (
                      <div key={order.id}>
                        • {apiKey?.name}: {orderData.side} {order.qty}{" "}
                        {orderData.symbol}
                        {!apiKey?.testnet && (
                          <span className="font-bold"> (LIVE)</span>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={placingOrders}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {placingOrders ? "Placing Orders..." : "CONFIRM ALL ORDERS"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showConfirmation && (
            <button
              type="submit"
              disabled={
                placingOrders ||
                accountOrders.filter((o) => o.enabled).length === 0
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {placingOrders
                ? "Placing Orders..."
                : `Place Orders (${
                    accountOrders.filter((o) => o.enabled).length
                  } accounts)`}
            </button>
          )}
        </form>
      </div>
    );
  };

  // Collapsible Account Card
  const AccountCard = ({ apiKey }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("positions");
    const [accountData, setAccountData] = useState({
      balance: null,
      positions: [],
      orders: [],
    });
    const [loading, setLoading] = useState(false);

    const fetchAccountData = async () => {
      setLoading(true);
      try {
        const { BybitAPI } = await import("@/lib/bybit");
        const api = new BybitAPI(
          apiKey.apiKey,
          apiKey.apiSecret,
          apiKey.testnet
        );

        const [balanceData, positionsData, ordersData] = await Promise.all([
          api.getAccountBalance().catch(() => ({ result: { list: [] } })),
          api.getPositions().catch(() => ({ result: { list: [] } })),
          api.getActiveOrders().catch(() => ({ result: { list: [] } })),
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
        });
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (apiKey && isExpanded) {
        fetchAccountData();
      }
    }, [apiKey, isExpanded]);

    const handleClosePosition = async (position) => {
      if (
        !confirm(`Close ${position.side} ${position.size} ${position.symbol}?`)
      )
        return;

      try {
        const { BybitAPI } = await import("@/lib/bybit");
        const api = new BybitAPI(
          apiKey.apiKey,
          apiKey.apiSecret,
          apiKey.testnet
        );

        await api.closePosition(position.symbol, position.side, position.size);
        alert("Position closed successfully!");
        fetchAccountData();
      } catch (error) {
        alert(`Failed to close position: ${error.message}`);
      }
    };

    const handleCloseAllPositions = async () => {
      const openPositions = accountData.positions.filter(
        (p) => parseFloat(p.size || 0) > 0
      );
      if (openPositions.length === 0) return;

      if (!confirm(`Close ALL ${openPositions.length} positions?`)) return;

      try {
        const { BybitAPI } = await import("@/lib/bybit");
        const api = new BybitAPI(
          apiKey.apiKey,
          apiKey.apiSecret,
          apiKey.testnet
        );

        await api.closeAllPositions();
        alert("All positions closed successfully!");
        fetchAccountData();
      } catch (error) {
        alert(`Failed to close positions: ${error.message}`);
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
      <div className="bg-gray-800 border border-gray-700 rounded-lg mb-4">
        <div
          className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-white">
                {apiKey.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  apiKey.testnet
                    ? "bg-yellow-900/30 text-yellow-400"
                    : "bg-red-900/30 text-red-400"
                }`}
              >
                {apiKey.testnet ? "TESTNET" : "MAINNET"}
              </span>
              {accountData.balance && (
                <div className="text-sm text-gray-400">
                  ${parseFloat(accountData.balance.totalEquity || 0).toFixed(2)}
                </div>
              )}
              {openPositionsCount > 0 && (
                <div className="text-sm">
                  <span className="text-gray-400">
                    {openPositionsCount} positions
                  </span>
                  <span
                    className={`ml-2 font-medium ${
                      totalPnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchAccountData();
                }}
                disabled={loading}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-700 p-4">
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
                        parseFloat(
                          accountData.balance.totalUnrealisedPnl || 0
                        ) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {parseFloat(
                        accountData.balance.totalUnrealisedPnl || 0
                      ) >= 0
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

            <div className="border-b border-gray-700 mb-4">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("positions")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "positions"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Positions
                  {openPositionsCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400">
                      {openPositionsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "orders"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Orders
                  {accountData.orders.length > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400">
                      {accountData.orders.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="min-h-32">
              {activeTab === "positions" && (
                <div>
                  {openPositionsCount > 0 && (
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={handleCloseAllPositions}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded text-sm"
                      >
                        Close All Positions ({openPositionsCount})
                      </button>
                    </div>
                  )}

                  {accountData.positions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No open positions</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {accountData.positions.map((position, index) => {
                        const isLong = position.side === "Buy";
                        const pnl = parseFloat(position.unrealisedPnl || 0);
                        const pnlPercentage = parseFloat(
                          position.unrealisedPnlPercentage || 0
                        );
                        const size = parseFloat(position.size || 0);

                        return (
                          <div
                            key={index}
                            className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold text-white">
                                    {position.symbol}
                                  </h4>
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      position.tradeMode === 1
                                        ? "bg-purple-900/30 text-purple-400"
                                        : "bg-blue-900/30 text-blue-400"
                                    }`}
                                  >
                                    {position.tradeMode === 1
                                      ? "Isolated"
                                      : "Cross"}
                                  </span>
                                </div>
                                <span
                                  className={`text-sm px-2 py-1 rounded ${
                                    isLong
                                      ? "bg-green-900/30 text-green-400"
                                      : "bg-red-900/30 text-red-400"
                                  }`}
                                >
                                  {position.side} {size} (
                                  {position.leverage || "1"}x)
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="text-right">
                                  <div className="text-sm text-gray-400">
                                    Entry Price
                                  </div>
                                  <div className="font-medium text-white">
                                    $
                                    {parseFloat(position.avgPrice || 0).toFixed(
                                      2
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleClosePosition(position)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">
                                  Mark Price:
                                </span>
                                <span className="ml-1 font-medium text-white">
                                  $
                                  {parseFloat(position.markPrice || 0).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  Unrealized PnL:
                                </span>
                                <div
                                  className={`ml-1 font-medium ${
                                    pnl >= 0 ? "text-green-400" : "text-red-400"
                                  }`}
                                >
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
                                <span className="text-gray-400">
                                  Position Value:
                                </span>
                                <span className="ml-1 font-medium text-white">
                                  $
                                  {parseFloat(
                                    position.positionValue || 0
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  Liq. Price:
                                </span>
                                <span className="ml-1 font-medium text-red-400">
                                  $
                                  {parseFloat(position.liqPrice || 0).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  {accountData.orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
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
                          <button
                            onClick={async () => {
                              try {
                                const { BybitAPI } = await import(
                                  "@/lib/bybit"
                                );
                                const api = new BybitAPI(
                                  apiKey.apiKey,
                                  apiKey.apiSecret,
                                  apiKey.testnet
                                );
                                await api.cancelOrder(
                                  order.orderId,
                                  order.symbol
                                );
                                alert("Order cancelled!");
                                fetchAccountData();
                              } catch (error) {
                                alert(`Failed to cancel: ${error.message}`);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
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
  };

  const handleMultiOrderSubmit = async (ordersToPlace) => {
    setPlacingOrders(true);
    setOrderResults([]);

    const results = [];
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

        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
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
    const successCount = results.filter((r) => r.success).length;

    if (successCount === results.length) {
      alert(`✅ All ${successCount} orders placed successfully!`);
    } else {
      alert(`⚠️ ${successCount}/${results.length} orders placed successfully.`);
    }

    setPlacingOrders(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Header />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Multi-Account Trading
              </h1>
              <p className="text-gray-400">
                Place orders across multiple accounts and monitor all positions
              </p>
            </div>

            {keysLoading && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading API keys...</p>
              </div>
            )}

            {!keysLoading && apiKeys.length === 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <svg
                  className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
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

            {!keysLoading && apiKeys.length > 0 && (
              <>
                <MultiAccountOrderForm />

                {orderResults.length > 0 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Order Results
                    </h3>
                    <div className="space-y-2">
                      {orderResults.map((result, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            result.success
                              ? "bg-green-900/20 border border-green-700"
                              : "bg-red-900/20 border border-red-700"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
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
                          <div className="text-sm">
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
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">
                      Account Overview ({apiKeys.length})
                    </h2>
                  </div>

                  <div className="space-y-1">
                    {apiKeys.map((apiKey) => (
                      <AccountCard key={apiKey.id} apiKey={apiKey} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
