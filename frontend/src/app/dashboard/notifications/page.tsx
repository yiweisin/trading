"use client";

import { useState } from "react";
import Link from "next/link";

type NotificationType = "alert" | "price" | "news" | "system" | "trade";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  symbol?: string;
  createdAt: string;
  read: boolean;
  actionLink?: string;
}

export default function NotificationsPage() {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      type: "alert",
      title: "Price Alert: AAPL",
      message: "Apple Inc. has reached your price target of $200.",
      symbol: "AAPL",
      createdAt: "2025-03-08T14:30:00Z",
      read: false,
      actionLink: "/dashboard/chart/AAPL/D",
    },
    {
      id: "notif-2",
      type: "price",
      title: "MSFT Up 2.5% Today",
      message: "Microsoft Corporation is up 2.5% in trading today.",
      symbol: "MSFT",
      createdAt: "2025-03-08T11:15:00Z",
      read: false,
      actionLink: "/dashboard/chart/MSFT/D",
    },
    {
      id: "notif-3",
      type: "news",
      title: "Breaking News: Tesla Recall",
      message:
        "Tesla announces a recall affecting approximately 300,000 vehicles.",
      symbol: "TSLA",
      createdAt: "2025-03-07T22:45:00Z",
      read: true,
      actionLink: "/dashboard/news",
    },
    {
      id: "notif-4",
      type: "system",
      title: "Account Security",
      message: "Your account password was changed successfully.",
      createdAt: "2025-03-07T18:20:00Z",
      read: true,
    },
    {
      id: "notif-5",
      type: "trade",
      title: "Trade Executed: Buy AMZN",
      message:
        "Your order to buy 10 shares of Amazon at $182.41 has been executed.",
      symbol: "AMZN",
      createdAt: "2025-03-07T15:10:00Z",
      read: true,
      actionLink: "/dashboard/portfolio",
    },
    {
      id: "notif-6",
      type: "alert",
      title: "Volume Alert: NVDA",
      message:
        "NVIDIA Corporation has unusual trading volume, 50% above average.",
      symbol: "NVDA",
      createdAt: "2025-03-07T12:30:00Z",
      read: true,
      actionLink: "/dashboard/chart/NVDA/D",
    },
    {
      id: "notif-7",
      type: "news",
      title: "Market News: Fed Statement",
      message:
        "Federal Reserve signals potential interest rate cut in coming months.",
      createdAt: "2025-03-07T09:45:00Z",
      read: true,
      actionLink: "/dashboard/news",
    },
    {
      id: "notif-8",
      type: "system",
      title: "Subscription Renewal",
      message: "Your premium subscription will renew automatically in 7 days.",
      createdAt: "2025-03-06T21:15:00Z",
      read: true,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>(
    "all"
  );

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "alert":
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-600">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      case "price":
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        );
      case "news":
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        );
      case "system":
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        );
      case "trade":
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        );
    }
  };

  // Format date for display
  const formatNotificationDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} min ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-500 mt-1">
              {notifications.filter((n) => !n.read).length} unread notifications
            </p>
          </div>

          <div className="mt-4 md:mt-0 space-x-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md"
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="pb-5 border-b border-gray-200 mb-5 overflow-x-auto">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setFilter("all")}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                filter === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                filter === "unread"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("alert")}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                filter === "alert"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => setFilter("price")}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                filter === "price"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Price Updates
            </button>
            <button
              onClick={() => setFilter("news")}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                filter === "news"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              News
            </button>
            <button
              onClick={() => setFilter("trade")}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                filter === "trade"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Trades
            </button>
            <button
              onClick={() => setFilter("system")}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                filter === "system"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              System
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
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
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any notifications at the moment.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border ${
                  notification.read
                    ? "border-gray-200"
                    : "border-blue-200 bg-blue-50"
                } p-4 shadow-sm`}
              >
                <div className="flex space-x-4">
                  {getNotificationIcon(notification.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p
                        className={`text-sm font-medium ${
                          notification.read ? "text-gray-900" : "text-blue-800"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <div className="flex-shrink-0 flex ml-4">
                        <p className="text-sm text-gray-500">
                          {formatNotificationDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>

                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex space-x-3">
                        {notification.actionLink && (
                          <Link
                            href={notification.actionLink}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
