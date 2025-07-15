"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApiKeys } from "@/hooks/useApiKeys";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const { apiKeys, loading } = useApiKeys();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.displayName || "Trader"}!
                </h1>
                <p className="text-gray-600">
                  Manage your Bybit trading accounts and monitor your positions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card title="API Keys">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {loading ? "..." : apiKeys.length}
                  </div>
                  <p className="text-gray-600 mb-4">Connected accounts</p>
                  <Button onClick={() => router.push("/api-keys")}>
                    Manage Keys
                  </Button>
                </Card>

                <Card title="Quick Actions">
                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      onClick={() => router.push("/trading")}
                    >
                      Start Trading
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/api-keys")}
                    >
                      Add New Account
                    </Button>
                  </div>
                </Card>

                <Card title="Account Info">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">User ID:</span>
                      <span className="ml-2 font-mono text-xs">
                        {user?.uid?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {apiKeys.length === 0 && !loading && (
                <Card>
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No API Keys Connected
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Connect your first Bybit API key to start trading
                    </p>
                    <Button onClick={() => router.push("/api-keys")}>
                      Add API Key
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
