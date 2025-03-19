import { LoginCredentials, User } from "../types/user";
import { Todo } from "../types/todo";

const API_URL = "http://localhost:5000/api";

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
  console.log("API login function called with:", credentials.username);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("Login response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("Login error response:", error);
      throw new Error(error || "Login failed");
    }

    const user = await response.json();
    console.log("Login successful, user data:", user);

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    console.log("User saved to localStorage");

    return user;
  } catch (error) {
    console.error("API login error:", error);
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

export async function getTodos(): Promise<Todo[]> {
  const response = await fetchWithAuth(`${API_URL}/todos`);

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  return response.json();
}

export async function createTodo(todo: { title: string }): Promise<Todo> {
  const response = await fetchWithAuth(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...todo, isCompleted: false }),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  return response.json();
}

export async function updateTodo(todo: Todo): Promise<void> {
  const response = await fetchWithAuth(`${API_URL}/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error("Failed to update todo");
  }
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}
