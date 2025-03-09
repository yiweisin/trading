"use client";

import { useState } from "react";
import Link from "next/link";
import StockSearch from "@/components/trading/stock-search";

type AlertType =
  | "price_above"
  | "price_below"
  | "percent_change_up"
  | "percent_change_down"
  | "volume_spike"
  | "news";

interface Alert {
  id: string;
  symbol: string;
  name: string;
  type: AlertType;
  value: number;
  triggered: boolean;
  triggeredAt?: string;
  active: boolean;
  createdAt: string;
  notificationType: "email" | "push" | "sms" | "all";
}

export default function AlertsPage() {
  // Mock alerts data
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert-1",
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "price_above",
      value: 200,
      triggered: false,
      active: true,
      createdAt: "2025-03-05T10:30:00Z",
      notificationType: "all",
    },
    {
      id: "alert-2",
      symbol: "MSFT",
      name: "Microsoft",
      type: "price_below",
      value: 400,
      triggered: true,
      triggeredAt: "2025-03-06T14:22:10Z",
      active: false,
      createdAt: "2025-03-04T15:45:00Z",
      notificationType: "push",
    },
    {
      id: "alert-3",
      symbol: "TSLA",
      name: "Tesla Inc.",
      type: "percent_change_up",
      value: 5,
      triggered: false,
      active: true,
      createdAt: "2025-03-07T08:15:00Z",
      notificationType: "email",
    },
    {
      id: "alert-4",
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      type: "percent_change_down",
      value: 3,
      triggered: false,
      active: true,
      createdAt: "2025-03-07T09:30:00Z",
      notificationType: "push",
    },
    {
      id: "alert-5",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      type: "volume_spike",
      value: 150,
      triggered: true,
      triggeredAt: "2025-03-08T11:45:30Z",
      active: false,
      createdAt: "2025-03-06T16:20:00Z",
      notificationType: "email",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "active" | "triggered">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlertSymbol, setNewAlertSymbol] = useState("");

  // Filter alerts based on selected filter
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "active") return alert.active && !alert.triggered;
    if (filter === "triggered") return alert.triggered;
    return true;
  });

  // Toggle alert active state
  const toggleAlertActive = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  // Delete alert
  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  // Get alert type text for display
  const getAlertTypeText = (alert: Alert) => {
    switch (alert.type) {
      case "price_above":
        return `Price Above $${alert.value}`;
      case "price_below":
        return `Price Below $${alert.value}`;
      case "percent_change_up":
        return `Rises By ${alert.value}%`;
      case "percent_change_down":
        return `Falls By ${alert.value}%`;
      case "volume_spike":
        return `Volume Spike ${alert.value}%`;
      case "news":
        return "News Release";
      default:
        return "Unknown Alert Type";
    }
  };

  // Get alert icon based on type
  const getAlertIcon = (alert: Alert) => {
    switch (alert.type) {
      case "price_above":
      case "percent_change_up":
        return (
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        );
      case "price_below":
      case "percent_change_down":
        return (
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
        );
      case "volume_spike":
        return (
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "news":
        return (
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Price Alerts</h1>

          <div className="mt-4 md:mt-0 space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Create Alert
            </button>
          </div>
        </div>

        <div className="flex flex-wrap space-x-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("triggered")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === "triggered"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Triggered
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Condition
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No alerts found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get notified when your stocks hit specific prices
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg
                          className="-ml-1 mr-2 h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Create an alert
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className={`${
                      alert.triggered ? "bg-yellow-50" : ""
                    } hover:bg-gray-50`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/chart/${alert.symbol}/D`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {alert.symbol}
                      </Link>
                      <div className="text-sm text-gray-500">{alert.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 mr-2">
                          {getAlertIcon(alert)}
                        </span>
                        <span className="text-sm font-medium">
                          {getAlertTypeText(alert)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alert.triggered ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Triggered{" "}
                          {alert.triggeredAt &&
                            `on ${new Date(
                              alert.triggeredAt
                            ).toLocaleDateString()}`}
                        </span>
                      ) : alert.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleAlertActive(alert.id)}
                        className={`${
                          alert.active
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                      >
                        {alert.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Price Alert</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Symbol
                </label>
                <StockSearch
                  onSearch={(symbol) => setNewAlertSymbol(symbol)}
                  placeholder="Enter stock symbol or company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_above">Price Above</option>
                  <option value="price_below">Price Below</option>
                  <option value="percent_change_up">Rises By (%)</option>
                  <option value="percent_change_down">Falls By (%)</option>
                  <option value="volume_spike">Volume Spike</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Method
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="notification-email"
                      name="notification-method"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="notification-email"
                      className="ml-3 block text-sm text-gray-700"
                    >
                      Email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="notification-push"
                      name="notification-method"
                      type="radio"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="notification-push"
                      className="ml-3 block text-sm text-gray-700"
                    >
                      Push Notification
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="notification-both"
                      name="notification-method"
                      type="radio"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="notification-both"
                      className="ml-3 block text-sm text-gray-700"
                    >
                      Both
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Create new alert logic
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
