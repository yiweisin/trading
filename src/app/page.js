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
  const OrderForm = () => {
    const [orderData, setOrderData] = useState({
      symbol: "BTCUSDT",
      side: "Buy",
      orderType: "Market",
      price: "",
      reduceOnly: false,
    });
    const [accountOrders, setAccountOrders] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const popularSymbols = [
      "BTCUSDT",
      "ETHUSDT",
      "BNBUSDT",
      "SOLUSDT",
      "ADAUSDT",
      "DOGEUSDT",
      "XRPUSDT",
      "AVAXUSDT",
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

    const addAccount = () => {
      setAccountOrders([
        ...accountOrders,
        {
          id: Date.now(),
          apiKeyId: apiKeys[0]?.id || "",
          qty: "0.001",
          enabled: true,
        },
      ]);
    };

    const removeAccount = (id) => {
      setAccountOrders(accountOrders.filter((order) => order.id !== id));
    };

    return (
      <div className="trading-panel">
        <div className="trading-panel-header">
          <h3 className="trading-panel-title">Multi-Account Order</h3>
          <div className="flex gap-sm">
            <button
              type="button"
              onClick={addAccount}
              className="btn btn-ghost btn-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              Add Account
            </button>
          </div>
        </div>

        <div className="trading-panel-body">
          <form onSubmit={handleSubmit} className="order-form">
            {/* Order Parameters */}
            <div className="order-params">
              <div className="form-group">
                <label className="form-label">Symbol</label>
                <select
                  value={orderData.symbol}
                  onChange={(e) =>
                    setOrderData({ ...orderData, symbol: e.target.value })
                  }
                  className="form-select"
                >
                  {popularSymbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Side</label>
                <select
                  value={orderData.side}
                  onChange={(e) =>
                    setOrderData({ ...orderData, side: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="Buy">Buy / Long</option>
                  <option value="Sell">Sell / Short</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  value={orderData.orderType}
                  onChange={(e) =>
                    setOrderData({ ...orderData, orderType: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="Market">Market</option>
                  <option value="Limit">Limit</option>
                </select>
              </div>

              {orderData.orderType === "Limit" && (
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={orderData.price}
                    onChange={(e) =>
                      setOrderData({ ...orderData, price: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center gap-md">
              <label className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  checked={orderData.reduceOnly}
                  onChange={(e) =>
                    setOrderData({ ...orderData, reduceOnly: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <span className="text-sm">Reduce Only</span>
              </label>
            </div>

            {/* Account Selection */}
            <div className="account-selector">
              <div className="flex items-center justify-between mb-md">
                <h4 className="font-semibold">Account Selection</h4>
                <span className="text-sm text-secondary">
                  {accountOrders.filter((o) => o.enabled).length} selected
                </span>
              </div>

              <div className="flex flex-col gap-sm">
                {accountOrders.map((accountOrder) => {
                  const apiKey = apiKeys.find(
                    (k) => k.id === accountOrder.apiKeyId
                  );
                  return (
                    <div
                      key={accountOrder.id}
                      className={`account-item ${
                        accountOrder.enabled ? "enabled" : ""
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
                        className="account-checkbox"
                      />

                      <div className="account-info">
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
                          className="form-select"
                          disabled={!accountOrder.enabled}
                        >
                          {apiKeys.map((key) => (
                            <option key={key.id} value={key.id}>
                              {key.name}
                            </option>
                          ))}
                        </select>
                        <div className="account-type">
                          {apiKey?.testnet ? (
                            <span className="status-badge testnet">
                              Testnet
                            </span>
                          ) : (
                            <span className="status-badge mainnet">Live</span>
                          )}
                        </div>
                      </div>

                      <input
                        type="number"
                        step="0.001"
                        placeholder="0.001"
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
                        className="quantity-input"
                        disabled={!accountOrder.enabled}
                      />

                      {accountOrders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAccount(accountOrder.id)}
                          className="btn btn-ghost btn-sm"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirmation */}
            {showConfirmation && (
              <div className="alert warning">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-semibold mb-sm">Confirm Live Trading</h4>
                  <p className="text-sm mb-md">
                    You are about to place real orders on live accounts. This
                    action cannot be undone.
                  </p>
                  <div className="flex gap-sm">
                    <button
                      type="submit"
                      disabled={placingOrders}
                      className="btn btn-danger btn-sm"
                    >
                      {placingOrders ? "Placing..." : "Confirm Orders"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmation(false)}
                      className="btn btn-outline btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            {!showConfirmation && (
              <button
                type="submit"
                disabled={
                  placingOrders ||
                  accountOrders.filter((o) => o.enabled).length === 0
                }
                className="btn btn-primary btn-lg w-full"
              >
                {placingOrders ? (
                  <div className="flex items-center gap-sm">
                    <div className="loading-spinner"></div>
                    Placing Orders...
                  </div>
                ) : (
                  `Place ${orderData.side} Orders (${
                    accountOrders.filter((o) => o.enabled).length
                  })`
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  };

  // Account Overview Component
  const AccountOverview = ({ apiKey }) => {
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

    const openPositionsCount = accountData.positions.filter(
      (p) => parseFloat(p.size || 0) > 0
    ).length;
    const totalPnl = accountData.positions.reduce(
      (sum, p) => sum + parseFloat(p.unrealisedPnl || 0),
      0
    );

    return (
      <div className="account-card">
        <div
          className="account-header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="account-summary">
            <div>
              <h3 className="font-semibold">{apiKey.name}</h3>
              <div className="flex items-center gap-sm mt-xs">
                {apiKey.testnet ? (
                  <span className="status-badge testnet">Testnet</span>
                ) : (
                  <span className="status-badge mainnet">Live</span>
                )}
                {accountData.balance && (
                  <span className="text-sm text-secondary">
                    $
                    {parseFloat(accountData.balance.totalEquity || 0).toFixed(
                      2
                    )}
                  </span>
                )}
              </div>
            </div>

            {openPositionsCount > 0 && (
              <div className="flex items-center gap-sm">
                <span className="text-sm text-secondary">
                  {openPositionsCount} positions
                </span>
                <span
                  className={`font-semibold ${
                    totalPnl >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchAccountData();
              }}
              disabled={loading}
              className="btn btn-ghost btn-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={loading ? "animate-spin" : ""}
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {isExpanded && (
          <div className="account-details">
            {/* Balance Overview */}
            {accountData.balance && (
              <div className="balance-grid">
                <div className="balance-item">
                  <div className="balance-label">Total Equity</div>
                  <div className="balance-value">
                    $
                    {parseFloat(accountData.balance.totalEquity || 0).toFixed(
                      2
                    )}
                  </div>
                </div>
                <div className="balance-item">
                  <div className="balance-label">Available</div>
                  <div className="balance-value">
                    $
                    {parseFloat(
                      accountData.balance.totalAvailableBalance || 0
                    ).toFixed(2)}
                  </div>
                </div>
                <div className="balance-item">
                  <div className="balance-label">Unrealized PnL</div>
                  <div
                    className={`balance-value ${
                      parseFloat(accountData.balance.totalUnrealisedPnl || 0) >=
                      0
                        ? "positive"
                        : "negative"
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
                  </div>
                </div>
                <div className="balance-item">
                  <div className="balance-label">Used Margin</div>
                  <div className="balance-value">
                    $
                    {parseFloat(
                      accountData.balance.totalInitialMargin || 0
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === "positions" ? "active" : ""}`}
                onClick={() => setActiveTab("positions")}
              >
                Positions
                {openPositionsCount > 0 && (
                  <span className="status-badge success ml-sm">
                    {openPositionsCount}
                  </span>
                )}
              </button>
              <button
                className={`tab ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders
                {accountData.orders.length > 0 && (
                  <span className="status-badge warning ml-sm">
                    {accountData.orders.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "positions" && (
                <div className="position-list">
                  {accountData.positions.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="empty-state-title">No Open Positions</div>
                      <div className="empty-state-text">
                        Your positions will appear here once you start trading.
                      </div>
                    </div>
                  ) : (
                    accountData.positions.map((position, index) => (
                      <div key={index} className="position-item">
                        <div className="position-info">
                          <div className="position-symbol">
                            {position.symbol}
                          </div>
                          <div className="position-details">
                            <span
                              className={`status-badge ${
                                position.side === "Buy" ? "success" : "error"
                              }`}
                            >
                              {position.side} {parseFloat(position.size || 0)} (
                              {position.leverage}x)
                            </span>
                            <span className="text-sm text-secondary">
                              Entry: $
                              {parseFloat(position.avgPrice || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-sm">
                          <div className="text-right">
                            <div
                              className={`position-pnl ${
                                parseFloat(position.unrealisedPnl || 0) >= 0
                                  ? "positive"
                                  : "negative"
                              }`}
                            >
                              {parseFloat(position.unrealisedPnl || 0) >= 0
                                ? "+"
                                : ""}
                              $
                              {parseFloat(position.unrealisedPnl || 0).toFixed(
                                2
                              )}
                            </div>
                            <div className="text-sm text-secondary">
                              ${parseFloat(position.markPrice || 0).toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleClosePosition(position)}
                            className="btn btn-danger btn-sm"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div className="order-list">
                  {accountData.orders.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="empty-state-title">No Active Orders</div>
                      <div className="empty-state-text">
                        Your pending orders will appear here.
                      </div>
                    </div>
                  ) : (
                    accountData.orders.map((order) => (
                      <div key={order.orderId} className="order-item">
                        <div className="order-info">
                          <div className="order-symbol">{order.symbol}</div>
                          <div className="order-details">
                            <span
                              className={`status-badge ${
                                order.side === "Buy" ? "success" : "error"
                              }`}
                            >
                              {order.side} {order.qty}
                            </span>
                            <span className="text-sm text-secondary">
                              {order.orderType}{" "}
                              {order.price && `@ $${order.price}`}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const { BybitAPI } = await import("@/lib/bybit");
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
                          className="btn btn-outline btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ))
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
    setPlacingOrders(false);

    // Show success/error summary
    const successCount = results.filter((r) => r.success).length;
    if (successCount === results.length) {
      // All successful - auto-hide after 3 seconds
      setTimeout(() => setOrderResults([]), 3000);
    }
  };

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Header />

        <div className="main-layout">
          <div className="content-container">
            <div className="page-content">
              {keysLoading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>Loading API keys...</span>
                </div>
              )}

              {!keysLoading && apiKeys.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div className="empty-state-title">No API Keys Connected</div>
                  <div className="empty-state-text">
                    Connect your Bybit API keys to start multi-account trading
                  </div>
                  <button
                    onClick={() => router.push("/api-keys")}
                    className="btn btn-primary btn-lg"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Connect API Keys
                  </button>
                </div>
              )}

              {!keysLoading && apiKeys.length > 0 && (
                <div className="flex flex-col gap-xl">
                  {/* Order Form */}
                  <OrderForm />

                  {/* Order Results */}
                  {orderResults.length > 0 && (
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Order Results</h3>
                        <button
                          onClick={() => setOrderResults([])}
                          className="btn btn-ghost btn-sm"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="card-body">
                        <div className="flex flex-col gap-sm">
                          {orderResults.map((result, index) => (
                            <div
                              key={index}
                              className={`alert ${
                                result.success ? "success" : "error"
                              }`}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                {result.success ? (
                                  <path d="M20 6L9 17l-5-5" />
                                ) : (
                                  <path d="M18 6L6 18M6 6l12 12" />
                                )}
                              </svg>
                              <div>
                                <div className="font-semibold">
                                  {result.accountName}
                                </div>
                                <div className="text-sm">
                                  {result.success
                                    ? `${result.side} ${result.qty} ${
                                        result.symbol
                                      } - Order ID: ${result.orderId?.slice(
                                        0,
                                        8
                                      )}...`
                                    : `Failed: ${result.error}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Overview */}
                  <div className="account-overview">
                    <div className="flex items-center justify-between mb-lg">
                      <h2 className="text-xl font-semibold">
                        Account Overview
                      </h2>
                      <span className="text-sm text-secondary">
                        {apiKeys.length} account
                        {apiKeys.length !== 1 ? "s" : ""} connected
                      </span>
                    </div>

                    {apiKeys.map((apiKey) => (
                      <AccountOverview key={apiKey.id} apiKey={apiKey} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .text-success {
          color: var(--status-success);
        }

        .text-error {
          color: var(--status-error);
        }

        .text-sm {
          font-size: 0.875rem;
        }

        .text-secondary {
          color: var(--text-secondary);
        }

        .text-xl {
          font-size: 1.25rem;
        }

        .ml-sm {
          margin-left: var(--space-sm);
        }

        .mt-xs {
          margin-top: var(--space-xs);
        }

        .tab-content {
          margin-top: var(--space-lg);
        }
      `}</style>
    </ProtectedRoute>
  );
}
