"use client";

import { useState } from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  symbols: string[];
  sentiment: "positive" | "negative" | "neutral";
}

export default function NewsPage() {
  // Mock news data
  const [newsItems] = useState<NewsItem[]>([
    {
      id: "news-1",
      title: "Apple Announces New MacBook Pro with M3 Max Chip",
      summary:
        "Apple unveils the latest MacBook Pro featuring the new M3 Max chip, promising unprecedented performance and battery life.",
      source: "Tech Insider",
      url: "#",
      imageUrl: "/sample-news-1.jpg",
      publishedAt: "2025-03-08T14:30:00Z",
      symbols: ["AAPL"],
      sentiment: "positive",
    },
    {
      id: "news-2",
      title: "Microsoft Surpasses $3 Trillion Market Cap for First Time",
      summary:
        "Microsoft becomes the second company to hit the $3 trillion market capitalization milestone, driven by strong cloud and AI growth.",
      source: "Market Watch",
      url: "#",
      publishedAt: "2025-03-08T10:15:00Z",
      symbols: ["MSFT"],
      sentiment: "positive",
    },
    {
      id: "news-3",
      title: "Tesla Recalls 300,000 Vehicles Due to Software Issue",
      summary:
        "Tesla announces a recall affecting approximately 300,000 vehicles due to a software glitch that could impact braking performance.",
      source: "Auto News",
      url: "#",
      publishedAt: "2025-03-07T22:45:00Z",
      symbols: ["TSLA"],
      sentiment: "negative",
    },
    {
      id: "news-4",
      title: "Fed Signals Potential Interest Rate Cut in Coming Months",
      summary:
        "Federal Reserve chairman indicates the central bank may consider cutting interest rates if inflation continues to moderate.",
      source: "Financial Times",
      url: "#",
      publishedAt: "2025-03-07T18:20:00Z",
      symbols: ["SPY", "QQQ", "DIA"],
      sentiment: "positive",
    },
    {
      id: "news-5",
      title: "Amazon Expands Same-Day Delivery to 15 New Markets",
      summary:
        "Amazon announces expansion of its same-day delivery service to 15 additional metropolitan areas, intensifying competition in rapid delivery.",
      source: "Retail Dive",
      url: "#",
      publishedAt: "2025-03-07T15:10:00Z",
      symbols: ["AMZN"],
      sentiment: "positive",
    },
    {
      id: "news-6",
      title:
        "Google Cloud Partners with Major Healthcare Systems to Enhance AI Solutions",
      summary:
        "Google Cloud announces strategic partnerships with five major healthcare systems to develop and deploy specialized AI solutions for medical diagnostics and patient care.",
      source: "Health Tech Today",
      url: "#",
      publishedAt: "2025-03-07T12:30:00Z",
      symbols: ["GOOGL"],
      sentiment: "positive",
    },
    {
      id: "news-7",
      title: "Nvidia Unveils Next-Generation GPU Architecture",
      summary:
        "Nvidia reveals its next-generation GPU architecture, promising 2x performance gains for AI and graphics applications while reducing power consumption.",
      source: "Tech Report",
      url: "#",
      publishedAt: "2025-03-07T09:45:00Z",
      symbols: ["NVDA"],
      sentiment: "positive",
    },
    {
      id: "news-8",
      title: "Oil Prices Drop 5% on Supply Concerns",
      summary:
        "Global oil prices fall more than 5% as major producers signal increased output and global demand forecasts are revised downward.",
      source: "Energy News",
      url: "#",
      publishedAt: "2025-03-06T21:15:00Z",
      symbols: ["XOM", "CVX", "COP"],
      sentiment: "negative",
    },
  ]);

  const [filter, setFilter] = useState<
    "all" | "positive" | "negative" | "neutral"
  >("all");

  // Filter news based on sentiment
  const filteredNews = newsItems.filter((news) => {
    if (filter === "all") return true;
    return news.sentiment === filter;
  });

  // Format date for display
  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Market News</h1>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All News
            </button>
            <button
              onClick={() => setFilter("positive")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "positive"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => setFilter("negative")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "negative"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Negative
            </button>
            <button
              onClick={() => setFilter("neutral")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "neutral"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Neutral
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No news found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your filter settings
              </p>
            </div>
          ) : (
            filteredNews.map((newsItem) => (
              <div
                key={newsItem.id}
                className={`p-6 border rounded-lg ${
                  newsItem.sentiment === "positive"
                    ? "border-green-200 bg-green-50"
                    : newsItem.sentiment === "negative"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:flex-1">
                    <h2 className="text-lg font-semibold mb-2">
                      {newsItem.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{newsItem.summary}</p>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                      <span className="mr-4">{newsItem.source}</span>
                      <span className="mr-4">
                        {formatPublishedDate(newsItem.publishedAt)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          newsItem.sentiment === "positive"
                            ? "bg-green-100 text-green-800"
                            : newsItem.sentiment === "negative"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {newsItem.sentiment.charAt(0).toUpperCase() +
                          newsItem.sentiment.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newsItem.symbols.map((symbol) => (
                        <Link
                          key={`${newsItem.id}-${symbol}`}
                          href={`/dashboard/chart/${symbol}/D`}
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-md"
                        >
                          {symbol}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {newsItem.imageUrl && (
                    <div className="md:ml-6 mt-4 md:mt-0">
                      <div className="bg-gray-200 w-full md:w-48 h-32 rounded-md"></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
