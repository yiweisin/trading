"use client";

import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
} from "recharts";

// Type for the backend data format
interface PriceHistoryItem {
  date: string;
  price: number;
}

interface StockCandlestickChartProps {
  data: PriceHistoryItem[];
  stockSymbol: string;
}

export default function StockCandlestickChart({
  data,
  stockSymbol,
}: StockCandlestickChartProps) {
  // Early return if no data
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No price history available</div>;
  }

  // Sort data chronologically if needed (oldest to newest)
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate the percentage change for display
  const firstPrice = sortedData[0]?.price || 0;
  const lastPrice = sortedData[sortedData.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const percentChange = (priceChange / firstPrice) * 100;
  const isPositive = priceChange >= 0;

  // Calculate min/max for Y axis scaling (with some padding)
  const minPrice = Math.min(...sortedData.map((item) => item.price)) * 0.98;
  const maxPrice = Math.max(...sortedData.map((item) => item.price)) * 1.02;

  // Custom candle renderer function using just the price data
  const renderCandles = () => {
    return sortedData.map((entry, index) => {
      // For each data point, we need the previous day's price to determine if it's up or down
      const previousPrice =
        index > 0 ? sortedData[index - 1].price : entry.price;
      const currentPrice = entry.price;
      const isUp = currentPrice >= previousPrice;
      const fill = isUp ? "#16a34a" : "#dc2626"; // Green for up, red for down
      const strokeColor = isUp ? "#16a34a" : "#dc2626";

      // X position calculations
      const totalWidth = 600; // SVG width (approximate)
      const candleSpacing = totalWidth / sortedData.length;
      const x = index * candleSpacing + candleSpacing / 2;
      const candleWidth = candleSpacing * 0.6; // 60% of spacing

      // Y position calculations - invert for SVG coordinate system
      const priceRange = maxPrice - minPrice;
      const currentY = ((maxPrice - currentPrice) / priceRange) * 300; // 300 is chart height
      const previousY = ((maxPrice - previousPrice) / priceRange) * 300;

      // Calculate candle parameters
      const candleY = Math.min(currentY, previousY);
      const candleHeight = Math.abs(currentY - previousY) || 1; // Ensure minimum height

      // Calculate wick parameters (add wicks to create proper candlesticks)
      const wickX = x;
      const wickTop = Math.max(currentY, previousY) - 10; // Extend wick beyond candle
      const wickBottom = Math.min(currentY, previousY) + candleHeight + 10; // Extend wick beyond candle

      return (
        <g key={`candle-${index}`}>
          {/* Wick line */}
          <line
            x1={wickX}
            y1={wickTop}
            x2={wickX}
            y2={wickBottom}
            stroke={strokeColor}
            strokeWidth={1}
          />

          {/* Candle body */}
          <rect
            x={x - candleWidth / 2}
            y={candleY}
            width={candleWidth}
            height={candleHeight}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={1}
          />
        </g>
      );
    });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      const currentPrice = data.price;
      const previousIndex = payload[0].index > 0 ? payload[0].index - 1 : null;
      const previousPrice =
        previousIndex !== null ? sortedData[previousIndex].price : currentPrice;
      const priceChange = currentPrice - previousPrice;
      const percentChange = (priceChange / previousPrice) * 100;
      const isPositive = priceChange >= 0;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-gray-800 font-medium">
            {new Date(data.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <div className="mt-1">
            <div className="text-gray-600">
              Price:{" "}
              <span className="text-gray-800 font-medium">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
            {previousIndex !== null && (
              <div
                className={`mt-1 font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {priceChange.toFixed(2)} ({isPositive ? "+" : ""}
                {percentChange.toFixed(2)}%)
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {stockSymbol} Price History
        </h2>
        <div
          className={`text-lg font-semibold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {priceChange.toFixed(2)} ({isPositive ? "+" : ""}
          {percentChange.toFixed(2)}%)
        </div>
      </div>

      <div className="h-80 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={sortedData}
            margin={{ top: 20, right: 30, bottom: 5, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              height={40}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Only render candles */}
            {renderCandles()}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Starting Price</div>
          <div className="font-semibold">
            ${sortedData[0]?.price.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Current Price</div>
          <div className="font-semibold">
            ${sortedData[sortedData.length - 1]?.price.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Highest Price</div>
          <div className="font-semibold">
            ${Math.max(...sortedData.map((d) => d.price)).toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Lowest Price</div>
          <div className="font-semibold">
            ${Math.min(...sortedData.map((d) => d.price)).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
