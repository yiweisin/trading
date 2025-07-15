"use client";

import { useState, useCallback } from "react";
import { BybitAPI } from "@/lib/bybit";

export const useBybitAPI = (apiKey, apiSecret, testnet = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api =
    apiKey && apiSecret ? new BybitAPI(apiKey, apiSecret, testnet) : null;

  const executeCall = useCallback(
    async (apiCall) => {
      if (!api) {
        setError("API not initialized - please check your API keys");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(api);
        setError(null); // Clear any previous errors
        return result;
      } catch (err) {
        console.error("API call failed:", err);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const getAccountBalance = useCallback(
    () => executeCall((api) => api.getAccountBalance()),
    [executeCall]
  );

  // FIXED: Positions with fallback methods
  const getPositions = useCallback(
    async (symbol = "") => {
      return executeCall(async (api) => {
        try {
          // Try default method first
          return await api.getPositions(symbol);
        } catch (error) {
          if (error.message.includes("10001")) {
            console.log("Trying alternative position fetch method...");
            // Try getting positions for common symbols
            return await api.getPositionsForSymbols();
          }
          throw error;
        }
      });
    },
    [executeCall]
  );

  const placeOrder = useCallback(
    (orderData) => executeCall((api) => api.placeOrder(orderData)),
    [executeCall]
  );

  const getActiveOrders = useCallback(
    (symbol = "") => executeCall((api) => api.getActiveOrders(symbol)),
    [executeCall]
  );

  const cancelOrder = useCallback(
    (orderId, symbol) => executeCall((api) => api.cancelOrder(orderId, symbol)),
    [executeCall]
  );

  const getAccountInfo = useCallback(
    () => executeCall((api) => api.getAccountInfo()),
    [executeCall]
  );

  const getInstruments = useCallback(
    () => executeCall((api) => api.getInstruments()),
    [executeCall]
  );

  return {
    loading,
    error,
    getAccountBalance,
    getPositions,
    placeOrder,
    getActiveOrders,
    cancelOrder,
    getAccountInfo,
    getInstruments,
  };
};
