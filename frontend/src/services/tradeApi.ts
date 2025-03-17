import { fetchWithAuth } from "./api";
import {
  TradeLog,
  CreateTradeRequest,
  TradeLogSummary,
} from "@/types/tradelog";

const API_URL = "http://localhost:5164/api";

// Trade Log API
export const getUserTrades = async (): Promise<TradeLog[]> => {
  return fetchWithAuth(`${API_URL}/TradeLog`);
};

export const getTradeById = async (id: string): Promise<TradeLog> => {
  return fetchWithAuth(`${API_URL}/TradeLog/${id}`);
};

export const getPortfolioSummary = async (): Promise<TradeLogSummary[]> => {
  return fetchWithAuth(`${API_URL}/TradeLog/portfolio`);
};

export const createTrade = async (
  tradeData: CreateTradeRequest
): Promise<TradeLog> => {
  return fetchWithAuth(`${API_URL}/TradeLog`, {
    method: "POST",
    body: JSON.stringify(tradeData),
  });
};

export const deleteTrade = async (id: string): Promise<void> => {
  return fetchWithAuth(`${API_URL}/TradeLog/${id}`, {
    method: "DELETE",
  });
};
