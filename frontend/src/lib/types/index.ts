// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

// Portfolio related types
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  createdAt: string;
  updatedAt: string;
  holdings: PortfolioHolding[];
}

export interface PortfolioHolding {
  id: string;
  portfolioId: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sector?: string;
  industry?: string;
  lastUpdated: string;
}

// Stock related types
export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  currentPrice: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
  dividend?: number;
  dividendYield?: number;
  eps?: number;
  week52High: number;
  week52Low: number;
  change: number;
  changePercent: number;
}

export interface StockHistorical {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

// Watchlist related types
export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: WatchlistItem[];
}

export interface WatchlistItem {
  id: string;
  watchlistId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  isFavorite: boolean;
  addedAt: string;
}

// Alert related types
export type AlertType =
  | "price_above"
  | "price_below"
  | "percent_change_up"
  | "percent_change_down"
  | "volume"
  | "news";

export interface Alert {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: AlertType;
  value: number;
  active: boolean;
  triggered: boolean;
  triggeredAt?: string;
  createdAt: string;
  updatedAt: string;
  notificationType: "email" | "push" | "sms" | "all";
}

// Market related types
export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
