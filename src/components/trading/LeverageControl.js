"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Settings, AlertTriangle } from "lucide-react";

export default function LeverageControl({
  selectedKey,
  symbol,
  currentLeverage,
  onLeverageUpdate,
}) {
  const [showModal, setShowModal] = useState(false);
  const [leverage, setLeverage] = useState({
    buyLeverage: currentLeverage || "1",
    sellLeverage: currentLeverage || "1",
    marginMode: "0",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const leverageOptions = [1, 2, 3, 5, 10, 20, 25, 50, 75, 100];

  useEffect(() => {
    if (currentLeverage) {
      setLeverage((prev) => ({
        ...prev,
        buyLeverage: currentLeverage,
        sellLeverage: currentLeverage,
      }));
    }
  }, [currentLeverage]);

  const handleSetLeverage = async () => {
    if (!selectedKey?.apiKey || !symbol) {
      alert("Please select an API key and symbol first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { BybitAPI } = await import("@/lib/bybit");
      const api = new BybitAPI(
        selectedKey.apiKey,
        selectedKey.apiSecret,
        selectedKey.testnet
      );

      const leverageResult = await api.setLeverage(
        symbol,
        leverage.buyLeverage,
        leverage.sellLeverage
      );

      if (leverageResult.result?.leverageAlreadySet) {
        setError("Leverage is already set to this value");
      } else {
        try {
          await api.switchMarginMode(
            symbol,
            parseInt(leverage.marginMode),
            leverage.buyLeverage,
            leverage.sellLeverage
          );
        } catch (marginError) {
          // Don't fail if margin mode switch fails
          console.warn("Margin mode switch failed:", marginError.message);
        }

        setShowModal(false);
        onLeverageUpdate && onLeverageUpdate(leverage.buyLeverage);
        alert("Leverage updated successfully!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMaxLeverage = (symbol) => {
    const maxLeverageMap = {
      BTCUSDT: 100,
      ETHUSDT: 100,
      BNBUSDT: 75,
      SOLUSDT: 50,
      ADAUSDT: 75,
      DOGEUSDT: 75,
      XRPUSDT: 75,
    };
    return maxLeverageMap[symbol] || 50;
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="text-sm">
          <span className="text-gray-600">Leverage: </span>
          <span className="font-medium">{currentLeverage || "1"}x</span>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowModal(true)}
          className="p-2"
          disabled={!selectedKey || !symbol}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Set Leverage - ${symbol}`}
      >
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-red-700 text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800">
                Leverage Warning
              </span>
            </div>
            <p className="text-yellow-700 text-sm">
              Higher leverage increases both potential profits and losses. You
              can lose your entire position with small price movements.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin Mode
            </label>
            <select
              value={leverage.marginMode}
              onChange={(e) =>
                setLeverage({ ...leverage, marginMode: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Cross Margin</option>
              <option value="1">Isolated Margin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select Leverage
            </label>
            <div className="grid grid-cols-5 gap-2">
              {leverageOptions
                .filter((lev) => lev <= getMaxLeverage(symbol))
                .map((lev) => (
                  <button
                    key={lev}
                    type="button"
                    onClick={() =>
                      setLeverage({
                        ...leverage,
                        buyLeverage: lev.toString(),
                        sellLeverage: lev.toString(),
                      })
                    }
                    className={`p-2 text-sm rounded border ${
                      leverage.buyLeverage === lev.toString()
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {lev}x
                  </button>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Leverage
              </label>
              <Input
                type="number"
                min="1"
                max={getMaxLeverage(symbol)}
                step="0.01"
                value={leverage.buyLeverage}
                onChange={(e) =>
                  setLeverage({ ...leverage, buyLeverage: e.target.value })
                }
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sell Leverage
              </label>
              <Input
                type="number"
                min="1"
                max={getMaxLeverage(symbol)}
                step="0.01"
                value={leverage.sellLeverage}
                onChange={(e) =>
                  setLeverage({ ...leverage, sellLeverage: e.target.value })
                }
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleSetLeverage}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Setting Leverage..." : "Set Leverage"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
