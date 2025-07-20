"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useApiKeys } from "./useApiKeys";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BybitAPI } from "@/lib/bybit";

export const useAutoTrading = () => {
  const [strategies, setStrategies] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { apiKeys } = useApiKeys();

  const fetchStrategies = async () => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setStrategies(data.strategies || []);
      }
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  };

  const fetchAlerts = async () => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    try {
      const alertsRef = collection(db, "tradingAlerts");
      const q = query(alertsRef, orderBy("timestamp", "desc"), limit(50));
      const querySnapshot = await getDocs(q);

      const alertsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          alertsData.push({ id: doc.id, ...data });
        }
      });

      setAlerts(alertsData);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const addStrategy = async (strategyData) => {
    if (!user || !db) {
      throw new Error("Database not available");
    }

    // Ensure all apiKeys have accounts configured
    const allAccounts = apiKeys.map((key) => ({
      apiKeyId: key.id,
      enabled: false,
      damageCost: "50", // Default damage cost
    }));

    // Merge with provided accounts
    const accounts =
      strategyData.accounts.length > 0 ? strategyData.accounts : allAccounts;

    const newStrategy = {
      id: Date.now().toString(),
      ...strategyData,
      accounts,
      createdAt: new Date().toISOString(),
      alertsCount: 0,
    };

    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        await updateDoc(docRef, {
          strategies: [...(currentData.strategies || []), newStrategy],
        });
      } else {
        await setDoc(docRef, {
          strategies: [newStrategy],
        });
      }

      await fetchStrategies();
      return true;
    } catch (error) {
      console.error("Error adding strategy:", error);
      throw error;
    }
  };

  const updateStrategy = async (strategyId, updatedData) => {
    if (!user || !db) {
      throw new Error("Database not available");
    }

    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedStrategies = currentData.strategies.map((strategy) =>
          strategy.id === strategyId
            ? {
                ...strategy,
                ...updatedData,
                updatedAt: new Date().toISOString(),
              }
            : strategy
        );

        await updateDoc(docRef, {
          strategies: updatedStrategies,
        });

        await fetchStrategies();
      }
      return true;
    } catch (error) {
      console.error("Error updating strategy:", error);
      throw error;
    }
  };

  const deleteStrategy = async (strategyId) => {
    if (!user || !db) {
      throw new Error("Database not available");
    }

    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedStrategies = currentData.strategies.filter(
          (strategy) => strategy.id !== strategyId
        );

        await updateDoc(docRef, {
          strategies: updatedStrategies,
        });

        await fetchStrategies();
      }
      return true;
    } catch (error) {
      console.error("Error deleting strategy:", error);
      throw error;
    }
  };

  const toggleStrategy = async (strategyId) => {
    if (!user || !db) {
      throw new Error("Database not available");
    }

    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedStrategies = currentData.strategies.map((strategy) =>
          strategy.id === strategyId
            ? {
                ...strategy,
                enabled: !strategy.enabled,
                updatedAt: new Date().toISOString(),
              }
            : strategy
        );

        await updateDoc(docRef, {
          strategies: updatedStrategies,
        });

        await fetchStrategies();
      }
      return true;
    } catch (error) {
      console.error("Error toggling strategy:", error);
      throw error;
    }
  };

  const logAlert = async (alertData) => {
    if (!user || !db) {
      return;
    }

    try {
      await addDoc(collection(db, "tradingAlerts"), {
        ...alertData,
        userId: user.uid,
        timestamp: new Date().toISOString(),
      });

      // Increment alert count for the strategy
      if (alertData.strategyId) {
        await incrementStrategyAlertCount(alertData.strategyId);
      }

      await fetchAlerts();
    } catch (error) {
      console.error("Error logging alert:", error);
    }
  };

  const incrementStrategyAlertCount = async (strategyId) => {
    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedStrategies = currentData.strategies.map((strategy) =>
          strategy.id === strategyId
            ? { ...strategy, alertsCount: (strategy.alertsCount || 0) + 1 }
            : strategy
        );

        await updateDoc(docRef, {
          strategies: updatedStrategies,
        });

        await fetchStrategies();
      }
    } catch (error) {
      console.error("Error incrementing alert count:", error);
    }
  };

  const clearAlerts = async () => {
    setAlerts([]);
  };

  // Calculate position size based on damage cost and stop loss
  const calculatePositionSize = (damageCost, entryPrice, stopLossPrice) => {
    const damage = parseFloat(damageCost);
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLossPrice);

    if (
      isNaN(damage) ||
      isNaN(entry) ||
      isNaN(sl) ||
      damage <= 0 ||
      entry <= 0 ||
      sl <= 0
    ) {
      throw new Error("Invalid price or damage cost values");
    }

    // Calculate the difference between entry and stop loss
    const priceDifference = Math.abs(entry - sl);

    if (priceDifference === 0) {
      throw new Error("Entry price and stop loss cannot be the same");
    }

    // Position size = Damage Cost / Price Difference
    const positionSize = damage / priceDifference;

    return positionSize;
  };

  const executeOrderForAccount = async (apiKey, orderData) => {
    try {
      const api = new BybitAPI(apiKey.apiKey, apiKey.apiSecret, apiKey.testnet);

      // Validate required data
      const { symbol, action, entry, sl, tp, damageCost } = orderData;

      if (!symbol || !action || !entry || !sl || !damageCost) {
        throw new Error(
          "Missing required order data: symbol, action, entry, sl, damageCost"
        );
      }

      // Calculate position size based on damage cost
      const positionSize = calculatePositionSize(damageCost, entry, sl);

      // Determine order side
      let side;
      const actionLower = action.toLowerCase();

      if (actionLower.includes("buy") || actionLower.includes("long")) {
        side = "Buy";
      } else if (
        actionLower.includes("sell") ||
        actionLower.includes("short")
      ) {
        side = "Sell";
      } else {
        throw new Error(`Unknown action: ${action}`);
      }

      // Format quantity according to symbol requirements
      const formattedQty = await api.formatQuantity(
        symbol,
        positionSize.toString()
      );

      // Place the main order (limit order at entry price)
      const mainOrderParams = {
        symbol: symbol.toUpperCase(),
        side,
        orderType: "Limit",
        qty: formattedQty,
        price: parseFloat(entry).toString(),
        timeInForce: "GTC",
      };

      const mainOrderResult = await api.placeOrder(mainOrderParams);

      if (!mainOrderResult.result?.orderId) {
        throw new Error("Failed to place main order");
      }

      const orderId = mainOrderResult.result.orderId;

      // Wait a moment for the order to be processed
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set stop loss
      try {
        await api.placeOrder({
          symbol: symbol.toUpperCase(),
          side: side === "Buy" ? "Sell" : "Buy", // Opposite side for stop loss
          orderType: "StopMarket",
          qty: formattedQty,
          stopPrice: parseFloat(sl).toString(),
          timeInForce: "GTC",
          reduceOnly: true,
        });
      } catch (slError) {
        console.warn("Failed to set stop loss:", slError.message);
      }

      // Set take profit if provided
      if (tp && parseFloat(tp) > 0) {
        try {
          await api.placeOrder({
            symbol: symbol.toUpperCase(),
            side: side === "Buy" ? "Sell" : "Buy", // Opposite side for take profit
            orderType: "Limit",
            qty: formattedQty,
            price: parseFloat(tp).toString(),
            timeInForce: "GTC",
            reduceOnly: true,
          });
        } catch (tpError) {
          console.warn("Failed to set take profit:", tpError.message);
        }
      }

      return {
        success: true,
        orderId,
        symbol: symbol.toUpperCase(),
        side,
        qty: formattedQty,
        entry: parseFloat(entry),
        sl: parseFloat(sl),
        tp: tp ? parseFloat(tp) : null,
        damageCost: parseFloat(damageCost),
        positionValue: positionSize * parseFloat(entry),
      };
    } catch (error) {
      console.error("Error executing order:", error);
      throw error;
    }
  };

  const processWebhookAlert = async (webhookData) => {
    if (!user || !db) {
      console.error("User not authenticated or database not available");
      return { success: false, message: "Authentication required" };
    }

    try {
      // Parse the webhook data
      const {
        strategy: strategyName,
        symbol,
        action,
        entry,
        sl,
        tp,
      } = webhookData;

      if (!strategyName || !symbol || !action || !entry || !sl) {
        throw new Error(
          "Missing required fields: strategy, symbol, action, entry, sl"
        );
      }

      // Find matching strategy
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("No strategies found");
      }

      const data = docSnap.data();
      const strategy = data.strategies?.find(
        (s) => s.enabled && s.name === strategyName
      );

      if (!strategy) {
        throw new Error(`No active strategy found with name: ${strategyName}`);
      }

      // Check direction compatibility
      const actionLower = action.toLowerCase();
      const isLong =
        actionLower.includes("buy") || actionLower.includes("long");
      const isShort =
        actionLower.includes("sell") || actionLower.includes("short");

      if (strategy.direction === "long" && !isLong) {
        throw new Error(
          `Strategy "${strategyName}" is long-only but received ${action} signal`
        );
      }

      if (strategy.direction === "short" && !isShort) {
        throw new Error(
          `Strategy "${strategyName}" is short-only but received ${action} signal`
        );
      }

      // Get enabled accounts for this strategy
      const enabledAccounts = strategy.accounts.filter((acc) => acc.enabled);

      if (enabledAccounts.length === 0) {
        throw new Error("No accounts enabled for this strategy");
      }

      // Process orders for each enabled account
      const results = [];

      for (const account of enabledAccounts) {
        try {
          const apiKey = apiKeys.find((k) => k.id === account.apiKeyId);

          if (!apiKey) {
            results.push({
              account: account.apiKeyId,
              success: false,
              error: "API key not found",
            });
            continue;
          }

          const orderResult = await executeOrderForAccount(apiKey, {
            symbol,
            action,
            entry,
            sl,
            tp,
            damageCost: account.damageCost,
          });

          results.push({
            account: apiKey.name,
            accountId: account.apiKeyId,
            success: true,
            orderId: orderResult.orderId,
            symbol: orderResult.symbol,
            side: orderResult.side,
            qty: orderResult.qty,
            entry: orderResult.entry,
            sl: orderResult.sl,
            tp: orderResult.tp,
            damageCost: orderResult.damageCost,
            positionValue: orderResult.positionValue,
          });

          // Add delay between orders to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(
            `Error executing order for account ${account.apiKeyId}:`,
            error
          );
          results.push({
            account: account.apiKeyId,
            success: false,
            error: error.message,
          });
        }
      }

      // Determine overall status
      const successCount = results.filter((r) => r.success).length;
      const status =
        successCount === results.length
          ? "success"
          : successCount > 0
          ? "partial"
          : "error";

      // Log the alert
      await logAlert({
        strategyId: strategy.id,
        strategyName: strategy.name,
        symbol,
        action,
        status,
        message: `Processed ${action} signal for ${symbol} - ${successCount}/${results.length} orders successful`,
        tradeDetails: {
          entry: parseFloat(entry),
          sl: parseFloat(sl),
          tp: tp ? parseFloat(tp) : null,
        },
        results,
        originalData: webhookData,
      });

      return {
        success: successCount > 0,
        message: `${successCount}/${results.length} orders executed successfully`,
        results,
        strategy: {
          id: strategy.id,
          name: strategy.name,
          direction: strategy.direction,
        },
        tradeDetails: {
          entry: parseFloat(entry),
          sl: parseFloat(sl),
          tp: tp ? parseFloat(tp) : null,
        },
      };
    } catch (error) {
      console.error("Error processing webhook:", error);

      // Log failed alert
      await logAlert({
        strategyName: webhookData.strategy || "UNKNOWN",
        symbol: webhookData.symbol || "UNKNOWN",
        action: webhookData.action || "UNKNOWN",
        status: "error",
        message: error.message,
        originalData: webhookData,
      });

      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Test strategy execution with mock data
  const testStrategy = async (strategyId, testData = {}) => {
    try {
      const strategy = strategies.find((s) => s.id === strategyId);
      if (!strategy) {
        throw new Error("Strategy not found");
      }

      // Create mock webhook data
      const mockWebhookData = {
        strategy: strategy.name,
        symbol: testData.symbol || "BTCUSDT",
        action: testData.action || "buy",
        entry: testData.entry || "45000",
        sl: testData.sl || "44000",
        tp: testData.tp || "46000",
        userId: user?.uid,
        test: true,
      };

      // Process as if it was a real webhook
      const result = await processWebhookAlert(mockWebhookData);
      return result;
    } catch (error) {
      console.error("Error testing strategy:", error);
      throw error;
    }
  };

  // Get strategy performance summary
  const getStrategyStats = async (strategyId) => {
    try {
      const alertsRef = collection(db, "tradingAlerts");
      const q = query(alertsRef, orderBy("timestamp", "desc"), limit(100));
      const querySnapshot = await getDocs(q);

      const strategyAlerts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid && data.strategyId === strategyId) {
          strategyAlerts.push({ id: doc.id, ...data });
        }
      });

      const totalAlerts = strategyAlerts.length;
      const successfulAlerts = strategyAlerts.filter(
        (a) => a.status === "success"
      ).length;
      const failedAlerts = strategyAlerts.filter(
        (a) => a.status === "error"
      ).length;
      const partialAlerts = strategyAlerts.filter(
        (a) => a.status === "partial"
      ).length;

      // Calculate total damage cost and potential profits
      let totalDamageCost = 0;
      let totalPositionValue = 0;

      strategyAlerts.forEach((alert) => {
        if (alert.results) {
          alert.results.forEach((result) => {
            if (result.success && result.damageCost) {
              totalDamageCost += parseFloat(result.damageCost) || 0;
              totalPositionValue += parseFloat(result.positionValue) || 0;
            }
          });
        }
      });

      return {
        totalAlerts,
        successfulAlerts,
        failedAlerts,
        partialAlerts,
        successRate:
          totalAlerts > 0
            ? ((successfulAlerts / totalAlerts) * 100).toFixed(1)
            : 0,
        totalDamageCost: totalDamageCost.toFixed(2),
        totalPositionValue: totalPositionValue.toFixed(2),
        recentAlerts: strategyAlerts.slice(0, 10),
      };
    } catch (error) {
      console.error("Error getting strategy stats:", error);
      return {
        totalAlerts: 0,
        successfulAlerts: 0,
        failedAlerts: 0,
        partialAlerts: 0,
        successRate: 0,
        totalDamageCost: "0.00",
        totalPositionValue: "0.00",
        recentAlerts: [],
      };
    }
  };

  // Validate strategy configuration
  const validateStrategy = async (strategyData) => {
    const errors = [];

    if (!strategyData.name || strategyData.name.trim().length < 3) {
      errors.push("Strategy name must be at least 3 characters long");
    }

    if (
      !strategyData.direction ||
      !["both", "long", "short"].includes(strategyData.direction)
    ) {
      errors.push("Valid trading direction is required");
    }

    const enabledAccounts =
      strategyData.accounts?.filter((acc) => acc.enabled) || [];
    if (enabledAccounts.length === 0) {
      errors.push("At least one account must be enabled");
    }

    // Validate account configurations
    for (const account of enabledAccounts) {
      const apiKey = apiKeys.find((k) => k.id === account.apiKeyId);
      if (!apiKey) {
        errors.push(`API key not found for account ${account.apiKeyId}`);
        continue;
      }

      const damageCost = parseFloat(account.damageCost);
      if (isNaN(damageCost) || damageCost <= 0) {
        errors.push(
          `Invalid damage cost for ${apiKey.name} - must be greater than 0`
        );
      }

      if (damageCost < 1) {
        errors.push(`Damage cost for ${apiKey.name} is too small - minimum $1`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Get webhook URL for user
  const getWebhookUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/api/webhook/tradingview?userId=${user?.uid}`;
    }
    return null;
  };

  // Generate TradingView alert template
  const generateAlertTemplate = (strategy) => {
    return {
      message: JSON.stringify(
        {
          strategy: strategy.name,
          symbol: "{{ticker}}",
          action: "{{strategy.order.action}}", // TradingView placeholder
          entry: "{{close}}", // Entry price
          sl: "{{strategy.position_size}}", // Stop loss price placeholder
          tp: "{{strategy.position_avg_price}}", // Take profit price placeholder
          userId: user?.uid,
          timestamp: "{{time}}",
        },
        null,
        2
      ),
      webhookUrl: getWebhookUrl(),
      notes: [
        "Replace placeholders with actual TradingView variables",
        "Ensure entry, sl, and tp are valid price values",
        "Action should be 'buy' for long or 'sell' for short",
        `Strategy name must match exactly: "${strategy.name}"`,
      ],
    };
  };

  // Calculate potential position details for preview
  const calculatePositionPreview = (damageCost, entryPrice, stopLossPrice) => {
    try {
      const damage = parseFloat(damageCost);
      const entry = parseFloat(entryPrice);
      const sl = parseFloat(stopLossPrice);

      if (isNaN(damage) || isNaN(entry) || isNaN(sl)) {
        return null;
      }

      const positionSize = calculatePositionSize(damage, entry, sl);
      const positionValue = positionSize * entry;
      const riskPercentage = (damage / positionValue) * 100;

      return {
        positionSize: positionSize.toFixed(6),
        positionValue: positionValue.toFixed(2),
        riskPercentage: riskPercentage.toFixed(2),
        maxLoss: damage.toFixed(2),
      };
    } catch (error) {
      return null;
    }
  };

  // Bulk operations
  const enableAllStrategies = async () => {
    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedStrategies = currentData.strategies.map((strategy) => ({
          ...strategy,
          enabled: true,
          updatedAt: new Date().toISOString(),
        }));

        await updateDoc(docRef, {
          strategies: updatedStrategies,
        });

        await fetchStrategies();
      }
      return true;
    } catch (error) {
      console.error("Error enabling all strategies:", error);
      throw error;
    }
  };

  const disableAllStrategies = async () => {
    try {
      const docRef = doc(db, "autoTradingStrategies", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedStrategies = currentData.strategies.map((strategy) => ({
          ...strategy,
          enabled: false,
          updatedAt: new Date().toISOString(),
        }));

        await updateDoc(docRef, {
          strategies: updatedStrategies,
        });

        await fetchStrategies();
      }
      return true;
    } catch (error) {
      console.error("Error disabling all strategies:", error);
      throw error;
    }
  };

  // Load data when user or apiKeys change
  useEffect(() => {
    const loadData = async () => {
      if (user && apiKeys.length >= 0) {
        await Promise.all([fetchStrategies(), fetchAlerts()]);
      }
    };

    loadData();
  }, [user, apiKeys]);

  return {
    strategies,
    alerts,
    loading,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    toggleStrategy,
    clearAlerts,
    processWebhookAlert,
    logAlert,
    testStrategy,
    getStrategyStats,
    validateStrategy,
    getWebhookUrl,
    generateAlertTemplate,
    calculatePositionSize,
    calculatePositionPreview,
    enableAllStrategies,
    disableAllStrategies,
    refetch: () => Promise.all([fetchStrategies(), fetchAlerts()]),
  };
};
