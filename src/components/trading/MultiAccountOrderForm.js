"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { Plus, Minus, TrendingUp } from "lucide-react";

export default function MultiAccountOrderForm({
  apiKeys,
  onSubmitOrders,
  loading,
  onLeverageUpdate,
}) {
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
    "DOTUSDT",
    "LINKUSDT",
    "LTCUSDT",
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

  const addAccountOrder = () => {
    const availableKey = apiKeys.find(
      (key) => !accountOrders.some((order) => order.apiKeyId === key.id)
    );

    if (availableKey) {
      setAccountOrders([
        ...accountOrders,
        {
          id: Date.now(),
          apiKeyId: availableKey.id,
          qty: "0.001",
          enabled: true,
        },
      ]);
    }
  };

  const removeAccountOrder = (id) => {
    setAccountOrders(accountOrders.filter((order) => order.id !== id));
  };

  const updateAccountOrder = (id, field, value) => {
    setAccountOrders(
      accountOrders.map((order) =>
        order.id === id ? { ...order, [field]: value } : order
      )
    );
  };

  const toggleAccountOrder = (id) => {
    setAccountOrders(
      accountOrders.map((order) =>
        order.id === id ? { ...order, enabled: !order.enabled } : order
      )
    );
  };

  const validateOrders = () => {
    if (!orderData.symbol) return "Please select a symbol";

    const enabledOrders = accountOrders.filter((order) => order.enabled);
    if (enabledOrders.length === 0) return "Please enable at least one account";

    for (const order of enabledOrders) {
      if (!order.qty || parseFloat(order.qty) <= 0) {
        const keyName = apiKeys.find((k) => k.id === order.apiKeyId)?.name;
        return `Invalid quantity for ${keyName}`;
      }
    }

    if (orderData.orderType === "Limit" && !orderData.price) {
      return "Price is required for Limit orders";
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateOrders();
    if (validationError) {
      alert(validationError);
      return;
    }

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

    onSubmitOrders(ordersToPlace);
    setShowConfirmation(false);
  };

  const calculateTotalValue = () => {
    const enabledOrders = accountOrders.filter((order) => order.enabled);
    const totalQty = enabledOrders.reduce(
      (sum, order) => sum + parseFloat(order.qty || 0),
      0
    );
    const price =
      orderData.orderType === "Limit"
        ? parseFloat(orderData.price || 0)
        : 50000;
    return (totalQty * price).toFixed(2);
  };

  const getAvailableKeys = () => {
    return apiKeys.filter(
      (key) => !accountOrders.some((order) => order.apiKeyId === key.id)
    );
  };

  return (
    <Card className="mb-6 bg-gray-800 border-gray-700">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Multi-Account Order Placement
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Symbol and Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Symbol Selection */}
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
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  {popularSymbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type="text"
                  placeholder="BTCUSDT"
                  value={orderData.symbol}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  className="text-sm bg-gray-700 border-gray-600 text-white"
                  required
                />
              )}
            </div>

            {/* Side */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Side
              </label>
              <select
                value={orderData.side}
                onChange={(e) =>
                  setOrderData({ ...orderData, side: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="Buy">Buy / Long</option>
                <option value="Sell">Sell / Short</option>
              </select>
            </div>

            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Order Type
              </label>
              <select
                value={orderData.orderType}
                onChange={(e) =>
                  setOrderData({ ...orderData, orderType: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="Market">Market</option>
                <option value="Limit">Limit</option>
              </select>
            </div>

            {/* Price (for Limit orders) */}
            {orderData.orderType === "Limit" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price (USDT)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={orderData.price}
                  onChange={(e) =>
                    setOrderData({ ...orderData, price: e.target.value })
                  }
                  className="text-sm bg-gray-700 border-gray-600 text-white"
                  required={orderData.orderType === "Limit"}
                />
              </div>
            )}
          </div>

          {/* Reduce Only Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reduceOnly"
              checked={orderData.reduceOnly}
              onChange={(e) =>
                setOrderData({ ...orderData, reduceOnly: e.target.checked })
              }
              className="mr-2 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="reduceOnly" className="text-sm text-gray-300">
              Reduce Only (Close positions only)
            </label>
          </div>

          {/* Account Selection and Quantities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-300">
                Account Quantities
              </h4>
              <Button
                type="button"
                variant="ghost"
                onClick={addAccountOrder}
                disabled={getAvailableKeys().length === 0}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Account
              </Button>
            </div>

            <div className="space-y-3">
              {accountOrders.map((accountOrder, index) => {
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
                      onChange={() => toggleAccountOrder(accountOrder.id)}
                      className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />

                    <select
                      value={accountOrder.apiKeyId}
                      onChange={(e) =>
                        updateAccountOrder(
                          accountOrder.id,
                          "apiKeyId",
                          e.target.value
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

                    <Input
                      type="number"
                      step="0.001"
                      placeholder="Quantity"
                      value={accountOrder.qty}
                      onChange={(e) =>
                        updateAccountOrder(
                          accountOrder.id,
                          "qty",
                          e.target.value
                        )
                      }
                      className="w-20 sm:w-24 text-sm bg-gray-700 border-gray-600 text-white"
                      disabled={!accountOrder.enabled}
                    />

                    {accountOrders.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeAccountOrder(accountOrder.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">Order Summary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Symbol:</span>
                <span className="ml-1 font-medium text-white">
                  {orderData.symbol}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Side:</span>
                <span className="ml-1 font-medium text-white">
                  {orderData.side}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Total Quantity:</span>
                <span className="ml-1 font-medium text-white">
                  {accountOrders
                    .filter((order) => order.enabled)
                    .reduce((sum, order) => sum + parseFloat(order.qty || 0), 0)
                    .toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Est. Total Value:</span>
                <span className="ml-1 font-medium text-white">
                  ${calculateTotalValue()}
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Accounts: {accountOrders.filter((order) => order.enabled).length}{" "}
              enabled
            </div>
          </div>

          {/* Mainnet Confirmation */}
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
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? "Placing Orders..." : "CONFIRM ALL ORDERS"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!showConfirmation && (
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={
                  loading || accountOrders.filter((o) => o.enabled).length === 0
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {loading
                  ? "Placing Orders..."
                  : `Place Orders (${
                      accountOrders.filter((o) => o.enabled).length
                    } accounts)`}
              </Button>
            </div>
          )}
        </form>
      </div>
    </Card>
  );
}
