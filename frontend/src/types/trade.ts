export interface Trade {
  id: number;
  stockId: number;
  stockSymbol: string;
  stockName: string;
  entryPrice: number;
  pnl: number;
  date: string;
  isHolding: boolean;
  currentPrice?: number; // Added to track current price for calculations
}

export interface CreateTradeRequest {
  stockId: number;
  entryPrice: number;
  isHolding: boolean;
}

export interface UpdateTradeRequest {
  pnl: number;
  isHolding: boolean;
}

export interface SellTradeRequest {
  pnl: number;
  isHolding: false;
}
