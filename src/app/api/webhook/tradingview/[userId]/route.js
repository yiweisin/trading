import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BybitAPI } from "@/lib/bybit";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "your-secret-key-here";

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};

const logAlert = async (userId, alertData) => {
  try {
    const { addDoc, collection } = await import("firebase/firestore");
    await addDoc(collection(db, "tradingAlerts"), {
      ...alertData,
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging alert:", error);
  }
};

const incrementStrategyAlertCount = async (userId, strategyId) => {
  try {
    const { updateDoc } = await import("firebase/firestore");
    const docRef = doc(db, "autoTradingStrategies", userId);
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
    }
  } catch (error) {
    console.error("Error incrementing alert count:", error);
  }
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
    } else if (actionLower.includes("sell") || actionLower.includes("short")) {
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

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    console.log("Received webhook:", body);

    // Extract required fields from webhook
    const {
      strategy: strategyName,
      symbol,
      action,
      entry,
      sl,
      tp,
      userId,
    } = body;

    if (!strategyName || !symbol || !action || !entry || !sl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: strategy, symbol, action, entry, sl",
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User identification required (userId parameter)",
        },
        { status: 400 }
      );
    }

    // Get user's strategies
    const docRef = doc(db, "autoTradingStrategies", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "No strategies found for user" },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    const strategies = data.strategies || [];

    // Find matching active strategy
    const strategy = strategies.find(
      (s) => s.enabled && s.name === strategyName
    );

    if (!strategy) {
      const message = `No active strategy found with name: ${strategyName}`;

      // Log failed alert
      await logAlert(userId, {
        strategyName,
        symbol,
        action,
        status: "error",
        message,
        originalData: body,
      });

      return NextResponse.json({ success: false, message }, { status: 404 });
    }

    // Check direction compatibility
    const actionLower = action.toLowerCase();
    const isLong = actionLower.includes("buy") || actionLower.includes("long");
    const isShort =
      actionLower.includes("sell") || actionLower.includes("short");

    if (strategy.direction === "long" && !isLong) {
      const message = `Strategy "${strategyName}" is long-only but received ${action} signal`;

      await logAlert(userId, {
        strategyId: strategy.id,
        strategyName,
        symbol,
        action,
        status: "error",
        message,
        originalData: body,
      });

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    if (strategy.direction === "short" && !isShort) {
      const message = `Strategy "${strategyName}" is short-only but received ${action} signal`;

      await logAlert(userId, {
        strategyId: strategy.id,
        strategyName,
        symbol,
        action,
        status: "error",
        message,
        originalData: body,
      });

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    // Get enabled accounts for this strategy
    const enabledAccounts = strategy.accounts.filter((acc) => acc.enabled);

    if (enabledAccounts.length === 0) {
      const message = "No accounts enabled for this strategy";

      await logAlert(userId, {
        strategyId: strategy.id,
        strategyName,
        symbol,
        action,
        status: "error",
        message,
        originalData: body,
      });

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    // Get user's API keys
    const apiKeysDocRef = doc(db, "userApiKeys", userId);
    const apiKeysDocSnap = await getDoc(apiKeysDocRef);

    if (!apiKeysDocSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "No API keys found" },
        { status: 404 }
      );
    }

    const apiKeysData = apiKeysDocSnap.data();
    const apiKeys = apiKeysData.apiKeys.map((key) => ({
      ...key,
      apiKey: decryptData(key.encryptedApiKey),
      apiSecret: decryptData(key.encryptedApiSecret),
    }));

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
    await logAlert(userId, {
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
      originalData: body,
    });

    // Increment strategy alert count
    await incrementStrategyAlertCount(userId, strategy.id);

    return NextResponse.json({
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
      summary: {
        totalAccounts: results.length,
        successfulOrders: successCount,
        failedOrders: results.length - successCount,
        totalDamageCost: results
          .filter((r) => r.success)
          .reduce((sum, r) => sum + (r.damageCost || 0), 0)
          .toFixed(2),
      },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook information
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  return NextResponse.json({
    message: "TradingView Webhook Endpoint",
    status: "active",
    timestamp: new Date().toISOString(),
    userId: userId || "not-provided",
    usage: {
      method: "POST",
      contentType: "application/json",
      requiredFields: ["strategy", "symbol", "action", "entry", "sl", "userId"],
      optionalFields: ["tp"],
      example: {
        strategy: "My Trading Strategy",
        symbol: "BTCUSDT",
        action: "buy",
        entry: "45000",
        sl: "44000",
        tp: "46000",
        userId: "your-firebase-user-id",
      },
      notes: [
        "Strategy name must match exactly with your configured strategy",
        "Entry and SL prices are used to calculate position size automatically",
        "Position size = damage_cost / |entry_price - stop_loss_price|",
        "Direction compatibility is checked (long-only strategies reject sell signals)",
        "Multiple accounts can be configured with different damage costs",
      ],
    },
  });
}
