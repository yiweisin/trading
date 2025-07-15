import axios from "axios";
import CryptoJS from "crypto-js";

export class BybitAPI {
  constructor(apiKey, apiSecret, testnet = true) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseURL = testnet
      ? "https://api-testnet.bybit.com"
      : "https://api.bybit.com";
  }

  generateSignature(params, timestamp, method = "GET") {
    let queryString =
      method === "GET"
        ? Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join("&")
        : JSON.stringify(params);

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

    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers,
      ...(method === "GET" ? { params } : { data: params }),
    };

    try {
      const response = await axios(config);
      if (response.data.retCode !== 0) {
        throw new Error(
          `API Error ${response.data.retCode}: ${response.data.retMsg}`
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.retMsg || error.message);
    }
  }

  async getAccountBalance() {
    try {
      return await this.makeRequest("/v5/account/wallet-balance", "GET", {
        accountType: "UNIFIED",
      });
    } catch (error) {
      return this.makeRequest("/v5/account/wallet-balance", "GET", {
        accountType: "CONTRACT",
      });
    }
  }

  async getPositions(symbol = "") {
    const params = { category: "linear" };
    if (symbol) params.symbol = symbol;
    else params.settleCoin = "USDT";
    return this.makeRequest("/v5/position/list", "GET", params);
  }

  async getActiveOrders(symbol = "") {
    const params = { category: "linear" };
    if (symbol) params.symbol = symbol;
    else params.settleCoin = "USDT";
    return this.makeRequest("/v5/order/realtime", "GET", params);
  }

  async placeOrder(orderData) {
    const params = {
      category: "linear",
      symbol: orderData.symbol.toUpperCase(),
      side: orderData.side,
      orderType: orderData.orderType,
      qty: orderData.qty.toString(),
      timeInForce: "GTC",
    };

    if (orderData.orderType === "Limit") {
      params.price = orderData.price.toString();
    }
    if (orderData.reduceOnly) {
      params.reduceOnly = true;
    }

    return this.makeRequest("/v5/order/create", "POST", params);
  }

  async cancelOrder(orderId, symbol) {
    return this.makeRequest("/v5/order/cancel", "POST", {
      category: "linear",
      orderId,
      symbol,
    });
  }

  async closePosition(symbol, side, qty) {
    const oppositeSide = side === "Buy" ? "Sell" : "Buy";
    return this.makeRequest("/v5/order/create", "POST", {
      category: "linear",
      symbol: symbol.toUpperCase(),
      side: oppositeSide,
      orderType: "Market",
      qty: qty.toString(),
      timeInForce: "IOC",
      reduceOnly: true,
    });
  }

  async closeAllPositions() {
    const positionsResponse = await this.getPositions();
    const positions =
      positionsResponse?.result?.list?.filter(
        (p) => parseFloat(p.size || 0) > 0
      ) || [];

    if (positions.length === 0) {
      return {
        success: true,
        message: "No positions to close",
        closedPositions: [],
      };
    }

    const results = [];
    for (const position of positions) {
      try {
        const result = await this.closePosition(
          position.symbol,
          position.side,
          position.size
        );
        results.push({
          symbol: position.symbol,
          side: position.side,
          size: position.size,
          success: true,
          orderId: result.result?.orderId,
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        results.push({
          symbol: position.symbol,
          side: position.side,
          size: position.size,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      closedPositions: results,
      successCount: results.filter((r) => r.success).length,
      totalCount: results.length,
    };
  }

  async setLeverage(symbol, buyLeverage, sellLeverage = null) {
    return this.makeRequest("/v5/position/set-leverage", "POST", {
      category: "linear",
      symbol: symbol.toUpperCase(),
      buyLeverage: buyLeverage.toString(),
      sellLeverage: (sellLeverage || buyLeverage).toString(),
    });
  }
}
