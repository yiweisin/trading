export type TradeType = "Buy" | "Sell";

export interface TradeLog {
  id: string;
  username: string;
  stockSymbol: string;
  stockName: string;
  type: TradeType;
  sharePrice: number;
  quantity: number;
  totalAmount: number;
  tradeDate: string;
}

export interface CreateTradeRequest {
  stockSymbol: string;
  type: TradeType;
  sharePrice: number;
  quantity: number;
  notes?: string;
}

export interface TradeLogSummary {
  stockSymbol: string;
  stockName: string;
  totalShares: number;
  averageBuyPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}
