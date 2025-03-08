"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Add TypeScript declaration for the TradingView global
declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  theme?: "light" | "dark";
  autosize?: boolean;
  height?: number;
  initialPrice?: number;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = "NASDAQ:AAPL",
  interval = "1D",
  theme = "light",
  autosize = true,
  height = 500,
  initialPrice,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [currentPrice, setCurrentPrice] = useState(initialPrice || 0);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | null>(
    null
  );
  const [priceUpdateTime, setPriceUpdateTime] = useState(new Date());

  // Function to fetch the current price
  const fetchCurrentPrice = async () => {
    try {
      // In a production environment, replace this with an actual API call
      // Example: const response = await fetch(`/api/stock-price/${symbol}`);

      // For now, we'll simulate price changes with random fluctuations
      const stockSymbol = symbol.split(":")[1];
      let basePrice = 0;

      switch (stockSymbol) {
        case "AAPL":
          basePrice = 192.53;
          break;
        case "MSFT":
          basePrice = 425.22;
          break;
        case "GOOGL":
          basePrice = 145.23;
          break;
        default:
          basePrice = 100.0;
      }

      // Random fluctuation between -1% and +1%
      const fluctuation = basePrice * (Math.random() * 0.02 - 0.01);
      const newPrice = basePrice + fluctuation;

      // Determine price direction for visual indicator
      if (newPrice > currentPrice) {
        setPriceDirection("up");
      } else if (newPrice < currentPrice) {
        setPriceDirection("down");
      }

      setCurrentPrice(newPrice);
      setPriceUpdateTime(new Date());

      // Reset direction indicator after 1 second
      setTimeout(() => {
        setPriceDirection(null);
      }, 1000);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  // Initialize TradingView widget
  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== "undefined" && containerRef.current) {
        setIsLoading(false);
        widgetRef.current = new window.TradingView.widget({
          autosize,
          symbol,
          interval,
          container_id: containerRef.current.id,
          library_path: "https://s3.tradingview.com/charting_library/",
          locale: "en",
          timezone: "exchange",
          theme: theme,
          style: "1",
          toolbar_bg: theme === "light" ? "#f1f5f9" : "#1e293b",
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          studies: ["MASimple@tv-basicstudies"],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          withdateranges: true,
          hide_side_toolbar: false,
        });

        // Initial price fetch
        fetchCurrentPrice();
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, theme, autosize]);

  // Set up periodic price updates
  useEffect(() => {
    // Update price every 5 seconds
    const priceUpdateInterval = setInterval(() => {
      fetchCurrentPrice();
    }, 5000);

    return () => {
      clearInterval(priceUpdateInterval);
    };
  }, [currentPrice]);

  const handleTrade = (type: "buy" | "sell") => {
    setTradeType(type);
    setShowTradeModal(true);
    // Get fresh price when opening trade modal
    fetchCurrentPrice();
  };

  const executeOrder = () => {
    // In a real app, this would call your API to execute the trade
    const orderDetails = {
      symbol: symbol.split(":")[1],
      type: tradeType,
      quantity,
      price: currentPrice,
      total: quantity * currentPrice,
      timestamp: new Date().toISOString(),
    };

    console.log("Order executed:", orderDetails);

    // Show success message and close modal
    alert(
      `${tradeType.toUpperCase()} order executed successfully! Total: $${orderDetails.total.toFixed(
        2
      )}`
    );
    setShowTradeModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold">
            {symbol.replace("NASDAQ:", "")} Chart
          </h2>
          <div className="flex items-center mt-1">
            <span
              className={`text-lg font-medium ${
                priceDirection === "up"
                  ? "text-green-600"
                  : priceDirection === "down"
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              ${currentPrice.toFixed(2)}
            </span>
            {priceDirection === "up" && (
              <svg
                className="w-4 h-4 ml-1 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            )}
            {priceDirection === "down" && (
              <svg
                className="w-4 h-4 ml-1 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            <span className="text-xs text-gray-500 ml-2">
              Last updated: {priceUpdateTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            value={interval}
            onChange={(e) =>
              router.push(
                `/dashboard/chart/${symbol.split(":")[1]}/${e.target.value}`
              )
            }
          >
            <option value="1">1 min</option>
            <option value="5">5 min</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">1 hour</option>
            <option value="D">1 day</option>
            <option value="W">1 week</option>
            <option value="M">1 month</option>
          </select>
          <button
            onClick={fetchCurrentPrice}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            title="Refresh price"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {isLoading && (
        <div
          className="flex justify-center items-center"
          style={{ height: `${height}px` }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div
        id={`tradingview_${symbol.replace(":", "_")}`}
        ref={containerRef}
        style={{ height: `${height}px` }}
      />

      <div className="flex p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={() => handleTrade("buy")}
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Buy
          </button>
          <button
            onClick={() => handleTrade("sell")}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sell
          </button>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {tradeType === "buy" ? "Buy" : "Sell"}{" "}
                {symbol.replace("NASDAQ:", "")}
              </h3>
              <button
                onClick={() => setShowTradeModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Current Price:</span>
                <span className="font-medium">${currentPrice.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Price updates automatically every 5 seconds
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-gray-100 p-3 rounded-md mb-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Total:</span>
                <span className="font-bold">
                  ${(quantity * currentPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTradeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={executeOrder}
                className={`px-4 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  tradeType === "buy"
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
              >
                Confirm {tradeType === "buy" ? "Purchase" : "Sale"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingViewChart;
