import { User, Portfolio, PortfolioItem, Stock } from "./types";

// API base URL - update with your AWS API URL
const API_URL = "http://localhost:5046/api";

// Helper function for better error handling
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `${errorData.message || response.statusText} (${response.status})`
    );
  }
  return response.json();
};

// Simple API client for fetching data
export const api = {
  // User endpoints
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    return handleResponse(response);
  },

  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`);
    return handleResponse(response);
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return handleResponse(response);
  },

  updateUser: async (id: string, user: Partial<User>): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...user }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to update user: ${errorData.message || response.statusText}`
      );
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to delete user: ${errorData.message || response.statusText}`
      );
    }
  },

  // Portfolio endpoints
  getPortfolios: async (): Promise<Portfolio[]> => {
    const response = await fetch(`${API_URL}/Portfolios`);
    const data = await handleResponse(response);
    // Extract the array from the response that uses ReferenceHandler.Preserve
    return Array.isArray(data) ? data : data.value || [];
  },
  getUserPortfolios: async (userId: string): Promise<Portfolio[]> => {
    const response = await fetch(`${API_URL}/portfolios/user/${userId}`);
    return handleResponse(response);
  },

  getPortfolio: async (id: string): Promise<Portfolio> => {
    const response = await fetch(`${API_URL}/portfolios/${id}`);
    return handleResponse(response);
  },

  createPortfolio: async (
    portfolio: Partial<Portfolio>
  ): Promise<Portfolio> => {
    const response = await fetch(`${API_URL}/portfolios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(portfolio),
    });
    return handleResponse(response);
  },

  updatePortfolio: async (
    id: string,
    portfolio: Partial<Portfolio>
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/portfolios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...portfolio }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to update portfolio: ${
          errorData.message || response.statusText
        }`
      );
    }
  },

  deletePortfolio: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/portfolios/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to delete portfolio: ${
          errorData.message || response.statusText
        }`
      );
    }
  },

  addStockToPortfolio: async (
    portfolioId: string,
    item: Partial<PortfolioItem>
  ): Promise<PortfolioItem> => {
    const response = await fetch(
      `${API_URL}/portfolios/${portfolioId}/stocks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }
    );
    return handleResponse(response);
  },

  removeStockFromPortfolio: async (
    portfolioId: string,
    itemId: string
  ): Promise<void> => {
    const response = await fetch(
      `${API_URL}/portfolios/${portfolioId}/stocks/${itemId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to remove stock from portfolio: ${
          errorData.message || response.statusText
        }`
      );
    }
  },

  getPortfolioStocks: async (portfolioId: string): Promise<PortfolioItem[]> => {
    const response = await fetch(`${API_URL}/portfolios/${portfolioId}/stocks`);
    return handleResponse(response);
  },

  // Stock endpoints
  getStocks: async (): Promise<Stock[]> => {
    const response = await fetch(`${API_URL}/stocks`);
    return handleResponse(response);
  },

  getStock: async (symbol: string): Promise<Stock> => {
    const response = await fetch(`${API_URL}/stocks/${symbol}`);
    return handleResponse(response);
  },

  getTopStocks: async (count: number = 5): Promise<Stock[]> => {
    const response = await fetch(`${API_URL}/stocks/top/${count}`);
    return handleResponse(response);
  },

  createStock: async (stock: Stock): Promise<Stock> => {
    const response = await fetch(`${API_URL}/stocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stock),
    });
    return handleResponse(response);
  },

  updateStock: async (symbol: string, stock: Partial<Stock>): Promise<void> => {
    const response = await fetch(`${API_URL}/stocks/${symbol}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, ...stock }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to update stock: ${errorData.message || response.statusText}`
      );
    }
  },

  deleteStock: async (symbol: string): Promise<void> => {
    const response = await fetch(`${API_URL}/stocks/${symbol}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to delete stock: ${errorData.message || response.statusText}`
      );
    }
  },
};
