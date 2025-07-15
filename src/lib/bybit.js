import axios from "axios";
import CryptoJS from "crypto-js";

export class BybitAPI {
  constructor(apiKey, apiSecret, testnet = true) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseURL = testnet
      ? "https://api-testnet.bybit.com"
      : "https://api.bybit.com";
    this.isTestnet = testnet;
  }

  generateSignature(params, timestamp, method = "GET") {
    let queryString = "";

    if (method === "GET") {
      queryString = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");
    } else {
      queryString = JSON.stringify(params);
    }

    const signString = timestamp + this.apiKey + "5000" + queryString;
    return CryptoJS.HmacSHA256(signString, this.apiSecret).toString();
  }

  async makeRequest(endpoint, method = "GET", params = {}) {
    const timestamp = Date.now().toString();
    const signature = this.generateSignature(params, timestamp, method);

    const headers = {
      "X-BAPI-API-KEY": this.apiKey,
      "X-BAPI-SIGN": signature,
      "X-BAPI-SIGN-TYPE": "2",
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": "5000",
      "Content-Type": "application/json",
    };

    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers,
      };

      if (method === "GET") {
        config.params = params;
      } else {
        config.data = params;
      }

      console.log(`🔄 API Call: ${method} ${endpoint}`, {
        params,
        isTestnet: this.isTestnet,
      });

      const response = await axios(config);

      console.log(`✅ API Response:`, response.data);

      if (response.data.retCode !== 0) {
        throw new Error(
          `API Error ${response.data.retCode}: ${response.data.retMsg}`
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        `❌ API Error for ${endpoint}:`,
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.retMsg || error.message);
    }
  }

  // Account balance
  async getAccountBalance() {
    try {
      return await this.makeRequest("/v5/account/wallet-balance", "GET", {
        accountType: "UNIFIED",
      });
    } catch (error) {
      console.log("Unified account failed, trying Contract account...");
      return this.makeRequest("/v5/account/wallet-balance", "GET", {
        accountType: "CONTRACT",
      });
    }
  }

  // Positions
  async getPositions(symbol = "") {
    const params = {
      category: "linear",
    };

    if (symbol) {
      params.symbol = symbol;
    } else {
      params.settleCoin = "USDT";
    }

    return this.makeRequest("/v5/position/list", "GET", params);
  }

  // Order placement
  async placeOrder(orderData) {
    const required = ["symbol", "side", "orderType", "qty"];
    for (const field of required) {
      if (!orderData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const params = {
      category: "linear",
      symbol: orderData.symbol.toUpperCase(),
      side: orderData.side,
      orderType: orderData.orderType,
      qty: orderData.qty.toString(),
      timeInForce: "GTC",
    };

    if (orderData.orderType === "Limit") {
      if (!orderData.price) {
        throw new Error("Price is required for Limit orders");
      }
      params.price = orderData.price.toString();
    }

    if (orderData.reduceOnly) {
      params.reduceOnly = true;
    }

    return this.makeRequest("/v5/order/create", "POST", params);
  }

  // Active orders
  async getActiveOrders(symbol = "") {
    const params = {
      category: "linear",
    };

    if (symbol) {
      params.symbol = symbol;
    } else {
      params.settleCoin = "USDT";
    }

    return this.makeRequest("/v5/order/realtime", "GET", params);
  }

  // Cancel order
  async cancelOrder(orderId, symbol) {
    return this.makeRequest("/v5/order/cancel", "POST", {
      category: "linear",
      orderId: orderId,
      symbol: symbol,
    });
  }

  // =============================================================================
  // LEVERAGE MANAGEMENT METHODS
  // =============================================================================

  // Get current position info for a symbol
  async getPositionInfo(symbol) {
    try {
      const response = await this.makeRequest("/v5/position/list", "GET", {
        category: "linear",
        symbol: symbol.toUpperCase(),
      });

      if (response.result?.list?.length > 0) {
        return response.result.list[0];
      }

      return {
        symbol: symbol.toUpperCase(),
        leverage: "1",
        tradeMode: 0,
        size: "0",
      };
    } catch (error) {
      throw error;
    }
  }

  // Check if leverage can be changed
  async canChangeLeverage(symbol) {
    try {
      const position = await this.getPositionInfo(symbol);
      const hasPosition = parseFloat(position.size || "0") > 0;

      return {
        canChange: !hasPosition,
        currentLeverage: position.leverage || "1",
        currentTradeMode: position.tradeMode || 0,
        hasPosition: hasPosition,
        positionSize: position.size || "0",
      };
    } catch (error) {
      return {
        canChange: false,
        error: error.message,
      };
    }
  }

  // Set leverage for a symbol
  async setLeverage(symbol, buyLeverage, sellLeverage = null) {
    const symbolUpper = symbol.toUpperCase();
    const targetBuyLeverage = buyLeverage.toString();
    const targetSellLeverage = (sellLeverage || buyLeverage).toString();

    try {
      const leverageCheck = await this.canChangeLeverage(symbolUpper);

      if (!leverageCheck.canChange && leverageCheck.hasPosition) {
        throw new Error(
          "Cannot change leverage while you have an open position. Close your position first."
        );
      }

      if (leverageCheck.currentLeverage === targetBuyLeverage) {
        return {
          retCode: 0,
          retMsg: "Leverage already set to target value",
          result: { leverageAlreadySet: true },
        };
      }

      const leverageParams = {
        category: "linear",
        symbol: symbolUpper,
        buyLeverage: targetBuyLeverage,
        sellLeverage: targetSellLeverage,
      };

      return await this.makeRequest(
        "/v5/position/set-leverage",
        "POST",
        leverageParams
      );
    } catch (error) {
      if (error.message.includes("110043")) {
        try {
          const currentInfo = await this.getPositionInfo(symbolUpper);
          throw new Error(
            `Leverage is already ${currentInfo.leverage}x for ${symbolUpper}`
          );
        } catch {
          throw new Error("Leverage is already set to the requested value");
        }
      } else if (error.message.includes("110025")) {
        throw new Error(
          "Cannot change leverage while you have an open position."
        );
      }
      throw error;
    }
  }

  // Switch margin mode
  async switchMarginMode(symbol, tradeMode, buyLeverage, sellLeverage = null) {
    const symbolUpper = symbol.toUpperCase();

    try {
      const leverageCheck = await this.canChangeLeverage(symbolUpper);

      if (!leverageCheck.canChange && leverageCheck.hasPosition) {
        throw new Error(
          "Cannot change margin mode while you have an open position."
        );
      }

      if (leverageCheck.currentTradeMode === tradeMode) {
        return {
          retCode: 0,
          retMsg: "Margin mode already set to target value",
          result: { marginModeAlreadySet: true },
        };
      }

      const params = {
        category: "linear",
        symbol: symbolUpper,
        tradeMode: tradeMode,
        buyLeverage: buyLeverage.toString(),
        sellLeverage: (sellLeverage || buyLeverage).toString(),
      };

      return await this.makeRequest("/v5/position/switch-mode", "POST", params);
    } catch (error) {
      if (error.message.includes("110043")) {
        throw new Error("Margin mode is already set to the requested value");
      }
      throw error;
    }
  }

  // Get account info
  async getAccountInfo() {
    return this.makeRequest("/v5/account/info", "GET", {});
  }

  // Get available trading symbols
  async getInstruments() {
    return this.makeRequest("/v5/market/instruments-info", "GET", {
      category: "linear",
      status: "Trading",
      limit: 50,
    });
  }
}
