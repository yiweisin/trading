"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { getTrades } from "../../lib/api";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    username: "",
    tradesCount: 0,
    winRate: 0,
    avgPnlPerTrade: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      const fetchTradeStats = async () => {
        try {
          const trades = await getTrades();

          const totalTrades = trades.length;
          const winningTrades = trades.filter(
            (trade) =>
              trade.pnl > 0 ||
              (trade.isHolding &&
                trade.currentPrice &&
                trade.currentPrice > trade.entryPrice)
          );

          const winRate =
            totalTrades > 0
              ? ((winningTrades.length / totalTrades) * 100).toFixed(2)
              : 0;

          const totalPnL = trades.reduce((sum, trade) => {
            // For closed trades, use stored PNL
            if (!trade.isHolding) return sum + trade.pnl;

            // For open trades, calculate potential PNL
            return trade.currentPrice
              ? sum + (trade.currentPrice - trade.entryPrice)
              : sum;
          }, 0);

          const avgPnlPerTrade =
            totalTrades > 0 ? Number((totalPnL / totalTrades).toFixed(2)) : 0;

          setProfileData({
            username: user.username,
            tradesCount: totalTrades,
            winRate: Number(winRate),
            avgPnlPerTrade: avgPnlPerTrade,
          });
        } catch (error) {
          console.error("Failed to fetch trade stats", error);
        }
      };

      fetchTradeStats();
    }
  }, [user, loading, router]);

  if (loading)
    return <div className="text-center py-8 text-emerald-600">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-emerald-800">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-emerald-700 px-6 py-8 text-white">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white text-emerald-700 flex items-center justify-center text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-emerald-100">Trader</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">
                Account Information
              </h3>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-emerald-600">Username</p>
                    <p className="font-medium text-emerald-900">
                      {profileData.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Statistics */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">
                Trading Statistics
              </h3>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-emerald-600">Total Trades</p>
                    <p className="font-medium text-emerald-900">
                      {profileData.tradesCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Win Rate</p>
                    <p className="font-medium text-emerald-600">
                      {profileData.winRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">
                      Avg. PNL per Trade
                    </p>
                    <p
                      className={`font-medium ${
                        profileData.avgPnlPerTrade >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      ${profileData.avgPnlPerTrade.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
