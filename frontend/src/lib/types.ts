// Essential type definitions
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Portfolio {
  id: string;
  name: string;
  userId: string;
  items?: PortfolioItem[];
  createdAt: string;
  lastUpdated: string;
}

export interface PortfolioItem {
  id: string;
  portfolioId: string;
  stockSymbol: string;
  stock?: Stock;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface Stock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  dayChange: number;
  percentChange: number;
}
