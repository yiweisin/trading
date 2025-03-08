"use client";

import { useEffect, useState } from "react";
import TradingViewChart from "@/components/trading/tradingview-chart";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividend: number;
  yield: number;
  high52: number;
  low52: number;
}

interface StockDetailsPageProps {
  params: {
    symbol: string;
    interval: string;
  };
}

export default function StockDetailsPage({ params }: StockDetailsPageProps) {
  const { symbol, interval } = params;
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Decode the symbol from the URL
  const decodedSymbol = decodeURIComponent(symbol);
  const formattedSymbol = `NASDAQ:${decodedSymbol}`;

  useEffect(() => {
    // In a real app, this would be an API call to get stock data
    const fetchStockData = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data based on the symbol
      const mockData: Record<string, StockData> = {
        AAPL: {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 192.53,
          change: 5.78,
          changePercent: 3.1,
          volume: 67423901,
          marketCap: 2998450000000,
          peRatio: 32.09,
          dividend: 0.96,
          yield: 0.5,
          high52: 205.35,
          low52: 143.9,
        },
        MSFT: {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          price: 425.22,
          change: 10.25,
          changePercent: 2.47,
          volume: 23541228,
          marketCap: 3156700000000,
          peRatio: 37.52,
          dividend: 2.72,
          yield: 0.64,
          high52: 430.82,
          low52: 310.32,
        },
        GOOGL: {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          price: 145.23,
          change: 2.47,
          changePercent: 1.73,
          volume: 22198403,
          marketCap: 1823450000000,
          peRatio: 25.31,
          dividend: 0,
          yield: 0,
          high52: 153.78,
          low52: 102.21,
        },
      };

      if (mockData[decodedSymbol]) {
        setStockData(mockData[decodedSymbol]);
      } else {
        // Default mock data if symbol not found
        setStockData({
          symbol: decodedSymbol,
          name: `${decodedSymbol} Inc.`,
          price: 100.0,
          change: 2.5,
          changePercent: 2.5,
          volume: 10000000,
          marketCap: 500000000000,
          peRatio: 20,
          dividend: 1.0,
          yield: 1.0,
          high52: 120.0,
          low52: 80.0,
        });
      }

      setIsLoading(false);
    };

    fetchStockData();
  }, [decodedSymbol]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stockData) {
    return <div>Error loading stock data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {stockData.name} ({stockData.symbol})
            </h1>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-semibold">
                ${stockData.price.toFixed(2)}
              </span>
              <span
                className={`ml-2 ${
                  stockData.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stockData.change >= 0 ? "+" : ""}
                {stockData.change.toFixed(2)} (
                {stockData.change >= 0 ? "+" : ""}
                {stockData.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              NASDAQ
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Volume</p>
            <p className="font-medium">{stockData.volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Market Cap</p>
            <p className="font-medium">
              ${(stockData.marketCap / 1000000000).toFixed(2)}B
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">P/E Ratio</p>
            <p className="font-medium">{stockData.peRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dividend Yield</p>
            <p className="font-medium">{stockData.yield.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">52 Week High</p>
            <p className="font-medium">${stockData.high52.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">52 Week Low</p>
            <p className="font-medium">${stockData.low52.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <TradingViewChart
        symbol={formattedSymbol}
        interval={interval}
        height={600}
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">About {stockData.name}</h2>
        <p className="text-gray-700 mb-4">
          {stockData.symbol === "AAPL" && (
            <>
              Apple Inc. designs, manufactures, and markets smartphones,
              personal computers, tablets, wearables, and accessories worldwide.
              The company offers iPhone, a line of smartphones; Mac, a line of
              personal computers; iPad, a line of multi-purpose tablets; and
              wearables, home, and accessories comprising AirPods, Apple TV,
              Apple Watch, Beats products, and HomePod.
            </>
          )}

          {stockData.symbol === "MSFT" && (
            <>
              Microsoft Corporation develops, licenses, and supports software,
              services, devices, and solutions worldwide. The company operates
              in three segments: Productivity and Business Processes,
              Intelligent Cloud, and More Personal Computing. The company offers
              Office, Exchange, SharePoint, Microsoft Teams, and Office 365
              Security and Compliance.
            </>
          )}

          {stockData.symbol === "GOOGL" && (
            <>
              Alphabet Inc. provides various products and platforms in the
              United States, Europe, the Middle East, Africa, the Asia-Pacific,
              Canada, and Latin America. It operates through Google Services,
              Google Cloud, and Other Bets segments. The Google Services segment
              offers products and services, including ads, Android, Chrome,
              hardware, Gmail, Google Drive, Google Maps, Google Photos, Google
              Play, Search, and YouTube.
            </>
          )}

          {!["AAPL", "MSFT", "GOOGL"].includes(stockData.symbol) && (
            <>
              {stockData.name} is a publicly traded company listed on the NASDAQ
              stock exchange under the ticker symbol {stockData.symbol}. The
              company operates in various sectors and offers a range of products
              and services to its customers.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
