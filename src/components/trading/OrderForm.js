"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LeverageControl from "./LeverageControl";

export default function OrderForm({
  onSubmit,
  loading,
  isMainnet = false,
  selectedKey,
}) {
  const [orderData, setOrderData] = useState({
    symbol: "BTCUSDT",
    side: "Buy",
    orderType: "Limit",
    qty: "0.001",
    price: "",
    reduceOnly: false,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentLeverage, setCurrentLeverage] = useState("1");
  const [symbolInputMode, setSymbolInputMode] = useState("dropdown"); // 'dropdown' or 'custom'

  // Popular symbols for quick selection
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

  const validateOrder = () => {
    if (!orderData.symbol || !orderData.qty) {
      return "Please fill in all required fields";
    }

    // Validate symbol format
    if (!orderData.symbol.match(/^[A-Z0-9]+USDT?$/)) {
      return "Symbol should be in format like BTCUSDT, ETHUSDT, etc.";
    }

    const qty = parseFloat(orderData.qty);
    if (isNaN(qty) || qty <= 0) {
      return "Quantity must be a positive number";
    }

    if (orderData.orderType === "Limit") {
      if (!orderData.price) {
        return "Price is required for Limit orders";
      }
      const price = parseFloat(orderData.price);
      if (isNaN(price) || price <= 0) {
        return "Price must be a positive number";
      }
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateOrder();
    if (validationError) {
      alert(validationError);
      return;
    }

    if (isMainnet && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    const cleanOrderData = {
      symbol: orderData.symbol.toUpperCase(),
      side: orderData.side,
      orderType: orderData.orderType,
      qty: parseFloat(orderData.qty).toString(),
      ...(orderData.orderType === "Limit" && {
        price: parseFloat(orderData.price).toString(),
      }),
      ...(orderData.reduceOnly && { reduceOnly: true }),
    };

    onSubmit(cleanOrderData);
    setShowConfirmation(false);
  };

  const calculateOrderValue = () => {
    const qty = parseFloat(orderData.qty || 0);
    const price =
      orderData.orderType === "Limit"
        ? parseFloat(orderData.price || 0)
        : 50000;
    return (qty * price).toFixed(2);
  };

  const calculateMarginRequired = () => {
    const orderValue = parseFloat(calculateOrderValue());
    const leverage = parseFloat(currentLeverage);
    return (orderValue / leverage).toFixed(2);
  };

  const getMinimumQuantity = (symbol) => {
    const minimums = {
      BTCUSDT: "0.001",
      ETHUSDT: "0.01",
      BNBUSDT: "0.01",
      SOLUSDT: "0.1",
      ADAUSDT: "1",
      DOGEUSDT: "1",
      XRPUSDT: "1",
    };
    return minimums[symbol] || "0.001";
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Symbol Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trading Symbol
          </label>

          {/* Toggle between dropdown and custom input */}
          <div className="flex space-x-2 mb-2">
            <button
              type="button"
              onClick={() => setSymbolInputMode("dropdown")}
              className={`px-3 py-1 text-xs rounded ${
                symbolInputMode === "dropdown"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Popular
            </button>
            <button
              type="button"
              onClick={() => setSymbolInputMode("custom")}
              className={`px-3 py-1 text-xs rounded ${
                symbolInputMode === "custom"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Custom
            </button>
          </div>

          {symbolInputMode === "dropdown" ? (
            <select
              value={orderData.symbol}
              onChange={(e) => {
                const newSymbol = e.target.value;
                setOrderData({
                  ...orderData,
                  symbol: newSymbol,
                  qty: getMinimumQuantity(newSymbol),
                });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter symbol (e.g., BTCUSDT, ETHUSDT)"
              value={orderData.symbol}
              onChange={(e) =>
                setOrderData({
                  ...orderData,
                  symbol: e.target.value.toUpperCase(),
                })
              }
              required
            />
          )}

          {/* Leverage Control */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Format: BTCUSDT, ETHUSDT, etc.
            </div>
            <LeverageControl
              selectedKey={selectedKey}
              symbol={orderData.symbol}
              currentLeverage={currentLeverage}
              onLeverageUpdate={setCurrentLeverage}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Side
            </label>
            <select
              value={orderData.side}
              onChange={(e) =>
                setOrderData({ ...orderData, side: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Buy">Buy / Long</option>
              <option value="Sell">Sell / Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <select
              value={orderData.orderType}
              onChange={(e) =>
                setOrderData({ ...orderData, orderType: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Market">Market (Instant)</option>
              <option value="Limit">Limit (Set Price)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <Input
              type="number"
              step="0.001"
              min="0"
              value={orderData.qty}
              onChange={(e) =>
                setOrderData({ ...orderData, qty: e.target.value })
              }
              placeholder="0.001"
              required
            />
          </div>

          {orderData.orderType === "Limit" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limit Price (USDT)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={orderData.price}
                onChange={(e) =>
                  setOrderData({ ...orderData, price: e.target.value })
                }
                placeholder="Enter price"
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
          <label htmlFor="reduceOnly" className="text-sm text-gray-700">
            Reduce Only
          </label>
        </div>

        {/* Order Summary */}
        {orderData.qty &&
          (orderData.orderType === "Market" || orderData.price) && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Order:</span>
                  <span className="font-medium">
                    {orderData.side} {orderData.qty} {orderData.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Leverage:</span>
                  <span className="font-medium">{currentLeverage}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Position Value:</span>
                  <span className="font-medium">${calculateOrderValue()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margin Required:</span>
                  <span className="font-medium text-blue-600">
                    ${calculateMarginRequired()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <span
                    className={`font-medium ${
                      isMainnet ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {isMainnet ? "🔴 LIVE" : "🟡 TESTNET"}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* High Leverage Warning */}
        {parseFloat(currentLeverage) > 10 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-red-800 text-sm">
              ⚠️ <strong>High Leverage:</strong> {currentLeverage}x leverage
              increases risk. A {(100 / parseFloat(currentLeverage)).toFixed(1)}
              % price move could liquidate your position.
            </div>
          </div>
        )}

        {/* Mainnet Confirmation */}
        {isMainnet && showConfirmation && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">
              ⚠️ Confirm Live Order
            </h4>
            <p className="text-red-700 text-sm mb-3">
              You are about to place a REAL order with REAL money:
            </p>
            <ul className="text-red-700 text-sm space-y-1 mb-4">
              <li>
                • {orderData.side} {orderData.qty} {orderData.symbol}
              </li>
              <li>• Leverage: {currentLeverage}x</li>
              <li>• Type: {orderData.orderType}</li>
              {orderData.price && <li>• Price: ${orderData.price}</li>}
              <li>• Position Value: ${calculateOrderValue()}</li>
              <li>• Margin Required: ${calculateMarginRequired()}</li>
            </ul>
            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? "Placing..." : "CONFIRM LIVE ORDER"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Regular Submit Button */}
        {!(isMainnet && showConfirmation) && (
          <Button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : `Place ${orderData.side} Order`}
          </Button>
        )}
      </form>
    </div>
  );
}
