import { LoginCredentials, User } from "../types/user";
import { Stock } from "../types/stock";
import { Trade, CreateTradeRequest, UpdateTradeRequest } from "../types/trade";

const API_URL = "http://localhost:5141/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = JSON.parse(localStorage.getItem("user") || "{}") as User;

  if (user.token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${user.token}`,
    };
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Login failed");
    }

    const user = await response.json();
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(credentials: LoginCredentials): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Registration failed");
  }

  const user = await response.json();
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  localStorage.removeItem("user");
}

// Stocks API
export async function getStocks(): Promise<Stock[]> {
  const response = await fetchWithAuth(`${API_URL}/stocks`);

  if (!response.ok) {
    throw new Error("Failed to fetch stocks");
  }

  return response.json();
}

export async function getStock(id: number): Promise<Stock> {
  const response = await fetchWithAuth(`${API_URL}/stocks/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch stock");
  }

  return response.json();
}

// Trades API
export async function getTrades(): Promise<Trade[]> {
  const response = await fetchWithAuth(`${API_URL}/trades`);

  if (!response.ok) {
    throw new Error("Failed to fetch trades");
  }

  return response.json();
}

export async function getTrade(id: number): Promise<Trade> {
  const response = await fetchWithAuth(`${API_URL}/trades/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trade");
  }

  return response.json();
}

export async function createTrade(trade: CreateTradeRequest): Promise<Trade> {
  const response = await fetchWithAuth(`${API_URL}/trades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trade),
  });

  if (!response.ok) {
    throw new Error("Failed to create trade");
  }

  return response.json();
}

export async function updateTrade(
  id: number,
  trade: UpdateTradeRequest
): Promise<void> {
  const response = await fetchWithAuth(`${API_URL}/trades/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trade),
  });

  if (!response.ok) {
    throw new Error("Failed to update trade");
  }
}

export async function deleteTrade(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_URL}/trades/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete trade");
  }
}
