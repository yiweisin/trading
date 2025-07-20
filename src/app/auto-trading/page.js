"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useAutoTrading } from "@/hooks/useAutoTrading";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";

export default function AutoTradingPage() {
  const { apiKeys } = useApiKeys();
  const {
    strategies,
    alerts,
    loading,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    toggleStrategy,
    clearAlerts,
    getWebhookUrl,
    calculatePositionPreview,
  } = useAutoTrading();

  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [activeTab, setActiveTab] = useState("strategies");

  const StrategyModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      enabled: true,
      direction: "both", // both, long, short
      accounts: [],
    });

    const [positionPreviews, setPositionPreviews] = useState({});

    useEffect(() => {
      if (editingStrategy) {
        setFormData(editingStrategy);
      } else {
        setFormData({
          name: "",
          enabled: true,
          direction: "both",
          accounts: apiKeys.map((key) => ({
            apiKeyId: key.id,
            enabled: false,
            damageCost: "50", // Fixed loss amount from entry to SL
          })),
        });
      }
    }, [editingStrategy]);

    // Update position preview when damage cost changes
    useEffect(() => {
      const previews = {};
      formData.accounts.forEach((account) => {
        if (account.enabled && account.damageCost) {
          // Example calculation with sample prices
          const preview = calculatePositionPreview(
            account.damageCost,
            "45000", // Sample entry price
            "44000" // Sample stop loss
          );
          if (preview) {
            previews[account.apiKeyId] = preview;
          }
        }
      });
      setPositionPreviews(previews);
    }, [formData.accounts]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (editingStrategy) {
          await updateStrategy(editingStrategy.id, formData);
        } else {
          await addStrategy(formData);
        }
        setShowStrategyModal(false);
        setEditingStrategy(null);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    };

    const updateAccount = (apiKeyId, field, value) => {
      setFormData((prev) => ({
        ...prev,
        accounts: prev.accounts.map((acc) =>
          acc.apiKeyId === apiKeyId ? { ...acc, [field]: value } : acc
        ),
      }));
    };

    return (
      <div className="modal-backdrop">
        <div className="modal large">
          <div className="modal-header">
            <h3 className="modal-title">
              {editingStrategy ? "Edit Strategy" : "Create Strategy"}
            </h3>
            <button
              onClick={() => {
                setShowStrategyModal(false);
                setEditingStrategy(null);
              }}
              className="modal-close-btn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label className="form-label">Strategy Name</label>
              <input
                type="text"
                placeholder="e.g., RSI Reversal Strategy"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="form-input"
                required
              />
              <div className="form-help">
                This should match the "strategy" field in your TradingView
                alerts
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Trading Direction</label>
              <select
                value={formData.direction}
                onChange={(e) =>
                  setFormData({ ...formData, direction: e.target.value })
                }
                className="form-select"
              >
                <option value="both">Both Long & Short</option>
                <option value="long">Long Only</option>
                <option value="short">Short Only</option>
              </select>
              <div className="form-help">
                Choose which directions this strategy can trade
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) =>
                    setFormData({ ...formData, enabled: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <div className="checkbox-content">
                  <div className="checkbox-title">Enable Strategy</div>
                  <div className="checkbox-description">
                    Strategy will respond to TradingView alerts when enabled
                  </div>
                </div>
              </label>
            </div>

            <div className="account-configuration">
              <h4 className="section-title">Account Configuration</h4>
              <p className="section-description">
                Configure damage cost (maximum loss from entry to stop loss) for
                each account
              </p>

              <div className="accounts-grid">
                {formData.accounts.map((account) => {
                  const apiKey = apiKeys.find((k) => k.id === account.apiKeyId);
                  if (!apiKey) return null;

                  const preview = positionPreviews[account.apiKeyId];

                  return (
                    <div
                      key={account.apiKeyId}
                      className={`account-config-card ${
                        account.enabled ? "enabled" : "disabled"
                      }`}
                    >
                      <div className="account-config-header">
                        <div className="account-info">
                          <h5 className="account-name">{apiKey.name}</h5>
                          <span
                            className={`status-badge ${
                              apiKey.testnet ? "testnet" : "mainnet"
                            }`}
                          >
                            {apiKey.testnet ? "Testnet" : "Live"}
                          </span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={account.enabled}
                            onChange={(e) =>
                              updateAccount(
                                account.apiKeyId,
                                "enabled",
                                e.target.checked
                              )
                            }
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      {account.enabled && (
                        <div className="account-config-body">
                          <div className="damage-cost-group">
                            <label className="form-label">
                              Maximum Damage Cost
                            </label>
                            <div className="input-group">
                              <span className="input-prefix">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="1"
                                placeholder="50.00"
                                value={account.damageCost}
                                onChange={(e) =>
                                  updateAccount(
                                    account.apiKeyId,
                                    "damageCost",
                                    e.target.value
                                  )
                                }
                                className="form-input"
                                required
                              />
                              <span className="input-suffix">USD</span>
                            </div>
                            <div className="form-help">
                              Maximum amount you're willing to lose if price
                              hits stop loss
                            </div>
                          </div>

                          {preview && (
                            <div className="position-preview">
                              <h6>
                                Position Preview (Example: BTC $45,000 →
                                $44,000)
                              </h6>
                              <div className="preview-grid">
                                <div className="preview-item">
                                  <span className="preview-label">
                                    Position Size:
                                  </span>
                                  <span className="preview-value">
                                    {preview.positionSize} BTC
                                  </span>
                                </div>
                                <div className="preview-item">
                                  <span className="preview-label">
                                    Position Value:
                                  </span>
                                  <span className="preview-value">
                                    ${preview.positionValue}
                                  </span>
                                </div>
                                <div className="preview-item">
                                  <span className="preview-label">Risk %:</span>
                                  <span className="preview-value">
                                    {preview.riskPercentage}%
                                  </span>
                                </div>
                                <div className="preview-item">
                                  <span className="preview-label">
                                    Max Loss:
                                  </span>
                                  <span className="preview-value risk">
                                    ${preview.maxLoss}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="risk-info">
                            <div className="risk-item">
                              <span className="risk-label">Position Size:</span>
                              <span className="risk-value">
                                Calculated automatically
                              </span>
                            </div>
                            <div className="risk-item">
                              <span className="risk-label">
                                Risk Management:
                              </span>
                              <span className="risk-value">
                                Entry to SL = ${account.damageCost || "0"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="alert-format-info">
              <h4 className="section-title">TradingView Alert Format</h4>
              <p className="section-description">
                Your TradingView alerts should include these fields:
              </p>
              <div className="alert-format-example">
                <pre>
                  <code>{`{
  "strategy": "${formData.name || "Your Strategy Name"}",
  "symbol": "{{ticker}}",
  "action": "buy", // or "sell"
  "entry": {{close}},
  "sl": 44000, // stop loss price
  "tp": 46000, // take profit price (optional)
  "userId": "your-user-id"
}`}</code>
                </pre>
              </div>
              <div className="alert-format-notes">
                <h6>Important Notes:</h6>
                <ul>
                  <li>Strategy name must match exactly: "{formData.name}"</li>
                  <li>Entry, SL, and TP should be actual price values</li>
                  <li>Action should be "buy" for long or "sell" for short</li>
                  <li>
                    Position size is calculated automatically from damage cost
                  </li>
                  <li>SL and TP orders are placed automatically</li>
                </ul>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary">
                {editingStrategy ? "Update Strategy" : "Create Strategy"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStrategyModal(false);
                  setEditingStrategy(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Header />

        <div className="main-layout">
          <div className="content-container">
            <div className="page-content">
              {/* Page Header */}
              <div className="page-header">
                <div className="page-header-content">
                  <div className="page-header-text">
                    <h1 className="page-title">Auto Trading Manager</h1>
                    <p className="page-subtitle">
                      Manage TradingView strategies with automatic position
                      sizing based on damage cost
                    </p>
                  </div>
                  <div className="page-header-actions">
                    <button
                      onClick={() => setShowStrategyModal(true)}
                      className="btn btn-primary"
                      disabled={apiKeys.length === 0}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 4v16m8-8H4"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      New Strategy
                    </button>
                  </div>
                </div>
              </div>

              {/* API Keys Warning */}
              {apiKeys.length === 0 && (
                <div className="warning-card">
                  <div className="warning-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>No API Keys Configured</h3>
                    <p>
                      You need to add at least one Bybit API key before creating
                      auto trading strategies.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/api-keys")}
                      className="btn btn-primary btn-sm"
                    >
                      Add API Keys
                    </button>
                  </div>
                </div>
              )}

              {/* Webhook URL Info */}
              {apiKeys.length > 0 && (
                <div className="webhook-info-card">
                  <div className="webhook-header">
                    <div className="webhook-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3>TradingView Webhook URL</h3>
                      <p>
                        Use this URL in your TradingView alert webhook settings
                      </p>
                    </div>
                  </div>
                  <div className="webhook-url">
                    <code>{getWebhookUrl()}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getWebhookUrl());
                        alert("Webhook URL copied!");
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* How It Works */}
              <div className="info-section">
                <h3>How Damage Cost Works</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>Set Maximum Loss</h4>
                      <p>
                        Define exactly how much you're willing to lose per trade
                        (damage cost)
                      </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 11H3v8h6v-8zM15 7h-6v12h6V7zM21 3h-6v16h6V3z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>Auto Position Sizing</h4>
                      <p>
                        System calculates position size: Damage Cost ÷ (Entry
                        Price - Stop Loss)
                      </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M22 12h-4l-3 9L9 3l-3 9H2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>Risk Management</h4>
                      <p>
                        Never risk more than your damage cost, regardless of
                        market volatility
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs">
                <button
                  className={`tab ${
                    activeTab === "strategies" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("strategies")}
                >
                  Strategies
                  {strategies.length > 0 && (
                    <span className="tab-badge">{strategies.length}</span>
                  )}
                </button>
                <button
                  className={`tab ${activeTab === "alerts" ? "active" : ""}`}
                  onClick={() => setActiveTab("alerts")}
                >
                  Recent Alerts
                  {alerts.length > 0 && (
                    <span className="tab-badge">{alerts.length}</span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "strategies" && (
                  <div className="strategies-section">
                    {loading ? (
                      <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <span>Loading strategies...</span>
                      </div>
                    ) : strategies.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                        <div className="empty-state-title">
                          No Auto Trading Strategies
                        </div>
                        <div className="empty-state-text">
                          Create your first strategy to automatically execute
                          trades with proper risk management
                        </div>
                        {apiKeys.length > 0 ? (
                          <button
                            onClick={() => setShowStrategyModal(true)}
                            className="btn btn-primary btn-lg"
                          >
                            Create First Strategy
                          </button>
                        ) : (
                          <button
                            onClick={() => (window.location.href = "/api-keys")}
                            className="btn btn-primary btn-lg"
                          >
                            Add API Keys First
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="strategies-grid">
                        {strategies.map((strategy) => (
                          <div key={strategy.id} className="strategy-card">
                            <div className="strategy-header">
                              <div className="strategy-info">
                                <h3 className="strategy-name">
                                  {strategy.name}
                                </h3>
                                <div className="strategy-meta">
                                  <span
                                    className={`direction-badge ${strategy.direction}`}
                                  >
                                    {strategy.direction === "both"
                                      ? "Long & Short"
                                      : strategy.direction === "long"
                                      ? "Long Only"
                                      : "Short Only"}
                                  </span>
                                  <span
                                    className={`status-badge ${
                                      strategy.enabled ? "success" : "warning"
                                    }`}
                                  >
                                    {strategy.enabled ? "Active" : "Disabled"}
                                  </span>
                                </div>
                              </div>
                              <div className="strategy-actions">
                                <label className="toggle-switch">
                                  <input
                                    type="checkbox"
                                    checked={strategy.enabled}
                                    onChange={() => toggleStrategy(strategy.id)}
                                  />
                                  <span className="toggle-slider"></span>
                                </label>
                                <button
                                  onClick={() => {
                                    setEditingStrategy(strategy);
                                    setShowStrategyModal(true);
                                  }}
                                  className="btn btn-ghost btn-sm"
                                  title="Edit Strategy"
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Delete strategy "${strategy.name}"?`
                                      )
                                    ) {
                                      deleteStrategy(strategy.id);
                                    }
                                  }}
                                  className="btn btn-ghost btn-sm danger"
                                  title="Delete Strategy"
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="strategy-accounts">
                              <h4>Active Accounts</h4>
                              <div className="accounts-list">
                                {strategy.accounts
                                  .filter((acc) => acc.enabled)
                                  .map((account) => {
                                    const apiKey = apiKeys.find(
                                      (k) => k.id === account.apiKeyId
                                    );
                                    return (
                                      <div
                                        key={account.apiKeyId}
                                        className="account-item-small"
                                      >
                                        <span className="account-name">
                                          {apiKey?.name}
                                        </span>
                                        <span className="account-config">
                                          Max Loss: ${account.damageCost}
                                        </span>
                                      </div>
                                    );
                                  })}
                              </div>
                              {strategy.accounts.filter((acc) => acc.enabled)
                                .length === 0 && (
                                <p className="no-accounts">
                                  No accounts enabled
                                </p>
                              )}
                            </div>

                            <div className="strategy-stats">
                              <div className="stat">
                                <span className="stat-label">Created</span>
                                <span className="stat-value">
                                  {new Date(
                                    strategy.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Alerts</span>
                                <span className="stat-value">
                                  {strategy.alertsCount || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "alerts" && (
                  <div className="alerts-section">
                    <div className="alerts-header">
                      <h3>Recent Alert Activity</h3>
                      {alerts.length > 0 && (
                        <button
                          onClick={clearAlerts}
                          className="btn btn-outline btn-sm"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {alerts.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M15 17h5l-5 5v-5zM4 19h6v2H4v-2zM4 15h8v2H4v-2zM4 11h8v2H4v-2zM4 7h8v2H4V7zM4 3h8v2H4V3z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                        <div className="empty-state-title">
                          No Recent Alerts
                        </div>
                        <div className="empty-state-text">
                          Alert activity will appear here when TradingView sends
                          webhooks
                        </div>
                      </div>
                    ) : (
                      <div className="alerts-list">
                        {alerts.map((alert, index) => (
                          <div
                            key={index}
                            className={`alert-item ${alert.status}`}
                          >
                            <div className="alert-header">
                              <div className="alert-info">
                                <span className="alert-symbol">
                                  {alert.symbol}
                                </span>
                                <span className="alert-action">
                                  {alert.action}
                                </span>
                                <span
                                  className={`alert-status ${alert.status}`}
                                >
                                  {alert.status}
                                </span>
                              </div>
                              <span className="alert-time">
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="alert-details">
                              <p>{alert.message}</p>
                              {alert.tradeDetails && (
                                <div className="trade-details">
                                  <div className="trade-detail">
                                    <span>
                                      Entry: ${alert.tradeDetails.entry}
                                    </span>
                                    <span>SL: ${alert.tradeDetails.sl}</span>
                                    {alert.tradeDetails.tp && (
                                      <span>TP: ${alert.tradeDetails.tp}</span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {alert.results && (
                                <div className="alert-results">
                                  {alert.results.map((result, i) => (
                                    <div
                                      key={i}
                                      className={`result-item ${
                                        result.success ? "success" : "error"
                                      }`}
                                    >
                                      <span>{result.account}: </span>
                                      <span>
                                        {result.success
                                          ? `Size: ${result.qty}, Risk: $${result.damageCost}`
                                          : result.error}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Strategy Modal */}
              {showStrategyModal && <StrategyModal />}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }

        .page-header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .page-header-text {
          flex: 1;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .page-header-actions {
          flex-shrink: 0;
        }

        .warning-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(224, 122, 95, 0.1);
          border: 1px solid var(--status-error);
          border-radius: var(--border-radius-lg);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .warning-icon {
          color: var(--status-error);
          flex-shrink: 0;
        }

        .warning-card h3 {
          color: var(--status-error);
          margin: 0 0 0.5rem 0;
        }

        .warning-card p {
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
        }

        .webhook-info-card {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-lg);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .webhook-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .webhook-icon {
          background: var(--gradient-primary);
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .webhook-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .webhook-header p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .webhook-url {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--border-radius);
          padding: 1rem;
        }

        .webhook-url code {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-family: "Monaco", "Menlo", monospace;
          font-size: 0.875rem;
          word-break: break-all;
        }

        .info-section {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-lg);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .info-section h3 {
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .info-icon {
          background: var(--gradient-primary);
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .info-item h4 {
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .info-item p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .modal.large {
          max-width: 900px;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .section-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .account-configuration {
          margin-bottom: 2rem;
        }

        .accounts-grid {
          display: grid;
          gap: 1rem;
        }

        .account-config-card {
          border: 1px solid var(--border-secondary);
          border-radius: var(--border-radius);
          padding: 1rem;
          transition: var(--transition);
        }

        .account-config-card.enabled {
          border-color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.05);
        }

        .account-config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .account-name {
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-tertiary);
          transition: var(--transition);
          border-radius: 24px;
          border: 1px solid var(--border-primary);
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 2px;
          background-color: var(--text-muted);
          transition: var(--transition);
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: var(--accent-gold);
          border-color: var(--accent-gold);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(20px);
          background-color: white;
        }

        .account-config-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .damage-cost-group {
          margin-bottom: 1rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .input-prefix {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
          z-index: 1;
        }

        .input-suffix {
          position: absolute;
          right: 0.75rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .input-group .form-input {
          padding-left: 2rem;
          padding-right: 3rem;
        }

        .position-preview {
          background: var(--bg-tertiary);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .position-preview h6 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.5rem;
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .preview-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .preview-value {
          font-size: 0.875rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .preview-value.risk {
          color: var(--status-error);
        }

        .risk-info {
          background: var(--bg-secondary);
          border-radius: var(--border-radius);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .risk-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .risk-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .risk-value {
          color: var(--text-primary);
          font-weight: 600;
        }

        .alert-format-info {
          margin-bottom: 2rem;
        }

        .alert-format-example {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .alert-format-example pre {
          margin: 0;
          font-family: "Monaco", "Menlo", monospace;
          font-size: 0.8rem;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .alert-format-notes {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--accent-gold);
          border-radius: var(--border-radius);
          padding: 1rem;
        }

        .alert-format-notes h6 {
          margin: 0 0 0.75rem 0;
          color: var(--accent-gold);
          font-weight: 600;
        }

        .alert-format-notes ul {
          margin: 0;
          padding-left: 1.25rem;
          color: var(--text-secondary);
        }

        .alert-format-notes li {
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        .strategies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .strategy-card {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-lg);
          padding: 1.5rem;
          transition: var(--transition);
        }

        .strategy-card:hover {
          box-shadow: var(--shadow-medium);
          transform: translateY(-2px);
        }

        .strategy-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .strategy-info {
          flex: 1;
        }

        .strategy-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .strategy-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .direction-badge {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--border-radius);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .direction-badge.both {
          background: var(--gradient-primary);
          color: white;
        }

        .direction-badge.long {
          background: rgba(135, 169, 107, 0.2);
          color: var(--status-success);
        }

        .direction-badge.short {
          background: rgba(224, 122, 95, 0.2);
          color: var(--status-error);
        }

        .strategy-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn.danger:hover {
          color: var(--status-error);
        }

        .strategy-accounts {
          margin-bottom: 1.5rem;
        }

        .strategy-accounts h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .account-item-small {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: var(--bg-tertiary);
          border-radius: var(--border-radius);
          font-size: 0.875rem;
        }

        .account-name {
          color: var(--text-primary);
          font-weight: 500;
        }

        .account-config {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .no-accounts {
          color: var(--text-muted);
          font-style: italic;
          font-size: 0.875rem;
        }

        .strategy-stats {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid var(--border-secondary);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .stat-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid var(--border-secondary);
          margin-bottom: 2rem;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: var(--transition);
          font-weight: 500;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          color: var(--accent-gold);
          border-bottom-color: var(--accent-gold);
        }

        .tab-badge {
          background: var(--accent-gold);
          color: var(--text-inverse);
          padding: 0.125rem 0.375rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .alerts-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .alert-item {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius);
          padding: 1rem;
          transition: var(--transition);
        }

        .alert-item.success {
          border-left: 4px solid var(--status-success);
        }

        .alert-item.error {
          border-left: 4px solid var(--status-error);
        }

        .alert-item.pending {
          border-left: 4px solid var(--status-warning);
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .alert-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .alert-symbol {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--border-radius);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .alert-action {
          color: var(--text-primary);
          font-weight: 500;
        }

        .alert-status {
          padding: 0.25rem 0.5rem;
          border-radius: var(--border-radius);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .alert-status.success {
          background: rgba(135, 169, 107, 0.2);
          color: var(--status-success);
        }

        .alert-status.error {
          background: rgba(224, 122, 95, 0.2);
          color: var(--status-error);
        }

        .alert-status.pending {
          background: rgba(212, 175, 55, 0.2);
          color: var(--status-warning);
        }

        .alert-time {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .alert-details {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .trade-details {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border-radius: var(--border-radius);
        }

        .trade-detail {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .alert-results {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .result-item {
          padding: 0.25rem 0;
          font-size: 0.8rem;
        }

        .result-item.success {
          color: var(--status-success);
        }

        .result-item.error {
          color: var(--status-error);
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .modal-actions .btn {
          flex: 1;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .modal-close-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          padding: 1rem;
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .checkbox-label:hover {
          background: var(--bg-hover);
        }

        .checkbox-content {
          flex: 1;
        }

        .checkbox-title {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .checkbox-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .form-help {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.375rem;
        }

        @media (max-width: 768px) {
          .page-header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .strategies-grid {
            grid-template-columns: 1fr;
          }

          .webhook-url {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .alert-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .alert-info {
            flex-wrap: wrap;
          }

          .strategy-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .strategy-actions {
            justify-content: flex-end;
          }

          .modal.large {
            margin: 1rem;
            max-width: calc(100vw - 2rem);
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .trade-detail {
            flex-direction: column;
            gap: 0.5rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .webhook-header {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .tabs {
            flex-direction: column;
          }

          .tab {
            border-bottom: 1px solid var(--border-secondary);
            border-left: 2px solid transparent;
          }

          .tab.active {
            border-bottom-color: var(--border-secondary);
            border-left-color: var(--accent-gold);
          }

          .strategy-meta {
            flex-direction: column;
            align-items: flex-start;
          }

          .preview-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </ProtectedRoute>
  );
}
