"use client";

import { useState } from "react";

export default function SettingsPage() {
  // User settings
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: "light",
    defaultChart: "candlestick",
    timeZone: "America/New_York",
    currency: "USD",
  });

  // Mock user data
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joined: "2024-11-15T10:30:00Z",
    subscription: "Premium",
    expiresAt: "2025-11-15T10:30:00Z",
  });

  const handleNotificationChange = (
    type: "email" | "push" | "sms",
    checked: boolean
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: checked,
      },
    });
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSettings({
      ...settings,
      theme,
    });
  };

  const handleChartTypeChange = (chartType: "candlestick" | "line" | "bar") => {
    setSettings({
      ...settings,
      defaultChart: chartType,
    });
  };

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      timeZone: e.target.value,
    });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      currency: e.target.value,
    });
  };

  const saveSettings = () => {
    // In a real app, save settings to backend/database
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="space-y-8">
          {/* Profile Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Profile Information
            </h2>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(userData.joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <button className="text-blue-600 font-medium hover:text-blue-800 text-sm">
              Edit profile
            </button>
          </div>

          {/* Subscription Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Subscription
            </h2>
            <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">
                    {userData.subscription} Plan
                  </p>
                  <p className="text-sm text-gray-600">
                    Renews on{" "}
                    {new Date(userData.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
            <button className="text-blue-600 font-medium hover:text-blue-800 text-sm">
              Manage subscription
            </button>
          </div>

          {/* Notification Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive price alerts and market updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      handleNotificationChange("email", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive real-time alerts on your device
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications.push}
                    onChange={(e) =>
                      handleNotificationChange("push", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive text messages for critical alerts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications.sms}
                    onChange={(e) =>
                      handleNotificationChange("sms", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Display Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex space-x-4">
                  <div
                    onClick={() => handleThemeChange("light")}
                    className={`flex items-center justify-center w-16 h-16 border rounded-md cursor-pointer ${
                      settings.theme === "light"
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="w-12 h-12 bg-white border border-gray-300 rounded-md shadow-sm"></div>
                  </div>
                  <div
                    onClick={() => handleThemeChange("dark")}
                    className={`flex items-center justify-center w-16 h-16 border rounded-md cursor-pointer ${
                      settings.theme === "dark"
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-md shadow-sm"></div>
                  </div>
                  <div
                    onClick={() => handleThemeChange("system")}
                    className={`flex items-center justify-center w-16 h-16 border rounded-md cursor-pointer ${
                      settings.theme === "system"
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-800 border border-gray-300 rounded-md shadow-sm"></div>
                  </div>
                </div>
                <div className="mt-2 flex text-sm text-gray-500 space-x-4">
                  <span
                    className={
                      settings.theme === "light"
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Light
                  </span>
                  <span
                    className={
                      settings.theme === "dark"
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Dark
                  </span>
                  <span
                    className={
                      settings.theme === "system"
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    System
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Chart Type
                </label>
                <div className="flex space-x-4">
                  <div
                    onClick={() => handleChartTypeChange("candlestick")}
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      settings.defaultChart === "candlestick"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <svg
                      className="w-8 h-8 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span className="mt-1 text-sm font-medium">
                      Candlestick
                    </span>
                  </div>
                  <div
                    onClick={() => handleChartTypeChange("line")}
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      settings.defaultChart === "line"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <svg
                      className="w-8 h-8 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                    <span className="mt-1 text-sm font-medium">Line</span>
                  </div>
                  <div
                    onClick={() => handleChartTypeChange("bar")}
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${
                      settings.defaultChart === "bar"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <svg
                      className="w-8 h-8 text-gray-700"
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
                    <span className="mt-1 text-sm font-medium">Bar</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Time Zone
                  </label>
                  <select
                    id="timezone"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={settings.timeZone}
                    onChange={handleTimeZoneChange}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="UTC">
                      Coordinated Universal Time (UTC)
                    </option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={settings.currency}
                    onChange={handleCurrencyChange}
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="JPY">Japanese Yen (¥)</option>
                    <option value="CAD">Canadian Dollar (C$)</option>
                    <option value="AUD">Australian Dollar (A$)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
            <div className="space-y-4">
              <button className="text-blue-600 font-medium hover:text-blue-800 text-sm block">
                Change password
              </button>
              <button className="text-blue-600 font-medium hover:text-blue-800 text-sm block">
                Enable two-factor authentication
              </button>
              <button className="text-blue-600 font-medium hover:text-blue-800 text-sm block">
                View login history
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
