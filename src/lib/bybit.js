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

  async getMarketPrice(symbol) {
    const params = {
      category: "linear",
      symbol: symbol.toUpperCase(),
    };
    return this.makeRequest("/v5/market/tickers", "GET", params);
  }

  async getInstrumentInfo(symbol) {
    const params = {
      category: "linear",
      symbol: symbol.toUpperCase(),
    };
    return this.makeRequest("/v5/market/instruments-info", "GET", params);
  }

  // Helper method to get proper quantity precision for a symbol
  async getQuantityPrecision(symbol) {
    try {
      const instrumentInfo = await this.getInstrumentInfo(symbol);
      const instrument = instrumentInfo?.result?.list?.[0];

      if (instrument && instrument.lotSizeFilter) {
        const minOrderQty = parseFloat(instrument.lotSizeFilter.minOrderQty);
        const qtyStep = parseFloat(instrument.lotSizeFilter.qtyStep);
        const maxOrderQty = parseFloat(instrument.lotSizeFilter.maxOrderQty);

        return {
          minOrderQty: isNaN(minOrderQty) ? 0.001 : minOrderQty,
          qtyStep: isNaN(qtyStep) ? 0.001 : qtyStep,
          maxOrderQty: isNaN(maxOrderQty) ? 1000000 : maxOrderQty,
        };
      }
    } catch (error) {
      console.warn("Could not fetch instrument info:", error.message);
    }

    // Fallback defaults based on common symbols
    const symbolDefaults = {
      BTCUSDT: { minOrderQty: 0.001, qtyStep: 0.001, maxOrderQty: 100 },
      ETHUSDT: { minOrderQty: 0.01, qtyStep: 0.01, maxOrderQty: 1000 },
      BNBUSDT: { minOrderQty: 0.01, qtyStep: 0.01, maxOrderQty: 10000 },
    };

    return (
      symbolDefaults[symbol.toUpperCase()] || {
        minOrderQty: 0.001,
        qtyStep: 0.001,
        maxOrderQty: 1000000,
      }
    );
  }

  // Helper method to round quantity to proper precision
  roundToStep(value, step) {
    if (
      !value ||
      !step ||
      step === 0 ||
      isNaN(parseFloat(value)) ||
      isNaN(parseFloat(step))
    ) {
      return parseFloat(value) || 0;
    }

    const numValue = parseFloat(value);
    const numStep = parseFloat(step);

    const precision = this.getPrecision(numStep);
    return Math.round(numValue / numStep) * numStep;
  }

  // Get decimal precision from step size
  getPrecision(step) {
    if (!step) return 6; // Default precision
    const str = step.toString();
    if (str.indexOf(".") === -1) return 0;
    return str.split(".")[1].length;
  }

  // Format quantity according to symbol requirements
  async formatQuantity(symbol, rawQuantity) {
    const qty = parseFloat(rawQuantity);
    if (isNaN(qty) || qty <= 0) {
      throw new Error("Invalid quantity");
    }

    const precision = await this.getQuantityPrecision(symbol);

    // Round to proper step size
    const roundedQty = this.roundToStep(qty, precision.qtyStep);

    // Check minimum quantity
    if (roundedQty < precision.minOrderQty) {
      throw new Error(
        `Quantity ${roundedQty} is below minimum ${precision.minOrderQty} for ${symbol}`
      );
    }

    // Check maximum quantity
    if (roundedQty > precision.maxOrderQty) {
      throw new Error(
        `Quantity ${roundedQty} exceeds maximum ${precision.maxOrderQty} for ${symbol}`
      );
    }

    // Format to proper decimal places
    const decimalPlaces = this.getPrecision(precision.qtyStep);
    return roundedQty.toFixed(decimalPlaces);
  }

  async placeOrder(orderData) {
    // Format quantity properly before placing order
    const formattedQty = await this.formatQuantity(
      orderData.symbol,
      orderData.qty
    );

    const params = {
      category: "linear",
      symbol: orderData.symbol.toUpperCase(),
      side: orderData.side,
      orderType: orderData.orderType,
      qty: formattedQty,
      timeInForce: "GTC",
    };

    if (orderData.orderType === "Limit") {
      params.price = parseFloat(orderData.price).toString();
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

  // Utility method to calculate order quantity from cost
  async calculateQuantityFromCost(symbol, cost, price) {
    if (
      !cost ||
      !price ||
      isNaN(parseFloat(cost)) ||
      isNaN(parseFloat(price))
    ) {
      return "0";
    }

    const rawCost = parseFloat(cost);
    const rawPrice = parseFloat(price);

    if (rawCost <= 0 || rawPrice <= 0) {
      return "0";
    }

    const rawQuantity = rawCost / rawPrice;

    try {
      // Get precision info for the symbol
      const precision = await this.getQuantityPrecision(symbol);

      // Round to proper step size
      const roundedQty = this.roundToStep(rawQuantity, precision.qtyStep);

      // Check if quantity is valid
      if (roundedQty < precision.minOrderQty) {
        // If below minimum, try to round up to minimum
        const minQty =
          Math.ceil(precision.minOrderQty / precision.qtyStep) *
          precision.qtyStep;
        return minQty.toFixed(this.getPrecision(precision.qtyStep));
      }

      if (roundedQty > precision.maxOrderQty) {
        throw new Error(
          `Cost too high - would exceed maximum quantity for ${symbol}`
        );
      }

      // Format to proper decimal places
      const decimalPlaces = this.getPrecision(precision.qtyStep);
      return roundedQty.toFixed(decimalPlaces);
    } catch (error) {
      console.warn(
        "Could not get precise formatting, using fallback:",
        error.message
      );
      // Fallback to simple calculation with reasonable precision
      return rawQuantity.toFixed(6);
    }
  }

  // Utility method to calculate cost from quantity
  calculateCostFromQuantity(quantity, price) {
    if (!quantity || !price) return "0";
    return (parseFloat(quantity) * parseFloat(price)).toFixed(2);
  }

  // Method to place order using cost instead of quantity
  async placeOrderByCost(orderData) {
    // First get the current market price if it's a market order
    let effectivePrice = orderData.price;

    if (orderData.orderType === "Market") {
      const priceData = await this.getMarketPrice(orderData.symbol);
      effectivePrice = parseFloat(priceData?.result?.list?.[0]?.markPrice || 0);

      if (!effectivePrice) {
        throw new Error("Unable to fetch current market price");
      }
    } else if (!effectivePrice) {
      throw new Error("Price required for limit orders");
    }

    // Calculate and format quantity from cost
    const quantity = await this.calculateQuantityFromCost(
      orderData.symbol,
      orderData.cost,
      effectivePrice
    );

    if (parseFloat(quantity) <= 0) {
      throw new Error("Invalid quantity calculated from cost");
    }

    // Create the order with calculated quantity
    const modifiedOrderData = {
      ...orderData,
      qty: quantity,
    };

    // Remove cost from order data as Bybit API doesn't use it
    delete modifiedOrderData.cost;

    return this.placeOrder(modifiedOrderData);
  }
}
