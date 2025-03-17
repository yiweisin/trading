// src/services/api.ts
import { Stock } from "@/types/portfolio";

const API_URL = "http://localhost:5164/api";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// Stock API
export const getStocks = async (): Promise<Stock[]> => {
  return fetchWithAuth(`${API_URL}/Stock`);
};

export const getStockDetails = async (symbol: string): Promise<Stock> => {
  return fetchWithAuth(`${API_URL}/Stock/${symbol}`);
};
