"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(credentials);
    } catch (err) {
      setError((err as Error).message || "Failed to login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-emerald-900">
          Trading App
        </h1>

        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-800">
          Login
        </h2>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded shadow-md"
        >
          <div>
            <label htmlFor="username" className="block mb-1 text-emerald-800">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={credentials.username}
              onChange={handleChange}
              className="w-full p-2 border border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-emerald-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="w-full p-2 border border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-emerald-700">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-emerald-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
