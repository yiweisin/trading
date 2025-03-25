"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "user@example.com", // Placeholder since we don't have this in the model
    joinDate: "",
    tradesCount: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      // Set profile data based on user
      setProfileData({
        username: user.username,
        email: "user@example.com", // Placeholder
        joinDate: new Date().toLocaleDateString(), // Placeholder
        tradesCount: 3, // Placeholder
      });
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-emerald-600">Username</p>
                    <p className="font-medium text-emerald-900">
                      {profileData.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Email</p>
                    <p className="font-medium text-emerald-900">
                      {profileData.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Joined</p>
                    <p className="font-medium text-emerald-900">
                      {profileData.joinDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Status</p>
                    <p className="font-medium text-emerald-600">Active</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-emerald-600">Total Trades</p>
                    <p className="font-medium text-emerald-900">
                      {profileData.tradesCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Active Positions</p>
                    <p className="font-medium text-emerald-900">2</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Win Rate</p>
                    <p className="font-medium text-emerald-600">67%</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">Avg. Return</p>
                    <p className="font-medium text-emerald-600">+8.2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-emerald-800">
              Account Settings
            </h3>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-emerald-900">
                      Change Password
                    </p>
                    <p className="text-sm text-emerald-600">
                      Update your account password
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-emerald-900">
                      Notification Settings
                    </p>
                    <p className="text-sm text-emerald-600">
                      Configure your notification preferences
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-emerald-900">
                      Export Trading Data
                    </p>
                    <p className="text-sm text-emerald-600">
                      Download your trading history
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
