export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  industry?: string;
  description?: string;
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  averagePurchasePrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  holdings: PortfolioItem[];
}

export interface Transaction {
  id: string;
  stockSymbol: string;
  stockName: string;
  type: string;
  pricePerShare: number;
  quantity: number;
  totalAmount: number;
  transactionDate: string;
}

export interface PortfolioWithTransactions {
  summary: PortfolioSummary;
  transactions: Transaction[];
}

export interface CreateTransactionRequest {
  stockSymbol: string;
  transactionType: "Buy" | "Sell";
  quantity: number;
}
