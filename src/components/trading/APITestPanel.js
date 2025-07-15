"use client";

import { useState } from "react";
import { useBybitAPI } from "@/hooks/useBybitAPI";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function APITestPanel({ selectedKey }) {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const api =
    selectedKey?.apiKey && selectedKey?.apiSecret
      ? new (require("@/lib/bybit").BybitAPI)(
          selectedKey.apiKey,
          selectedKey.apiSecret,
          selectedKey.testnet
        )
      : null;

  const runTest = async (testName, testFunction) => {
    if (!api) {
      alert("Please select an API key first");
      return;
    }

    setLoading(true);
    try {
      console.log(`🧪 Running test: ${testName}`);
      const result = await testFunction();
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          success: true,
          data: result,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } catch (error) {
      console.error(`❌ Test failed: ${testName}`, error);
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    }
    setLoading(false);
  };

  const tests = [
    {
      name: "Connection Test",
      action: () => api.testConnection(),
    },
    {
      name: "Account Info",
      action: () => api.getAccountInfo(),
    },
    {
      name: "Account Balance",
      action: () => api.getAccountBalance(),
    },
    {
      name: "Small Test Order",
      action: () =>
        api.placeOrder({
          symbol: "BTCUSDT",
          side: "Buy",
          orderType: "Limit",
          qty: "0.001",
          price: "30000", // Very low price, won't fill
        }),
    },
  ];

  return (
    <Card title="🧪 API Test Panel">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {tests.map((test) => (
            <Button
              key={test.name}
              variant="secondary"
              onClick={() => runTest(test.name, test.action)}
              disabled={loading || !selectedKey}
              className="text-sm"
            >
              {test.name}
            </Button>
          ))}
        </div>

        {Object.entries(testResults).map(([testName, result]) => (
          <div key={testName} className="border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{testName}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {result.timestamp}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    result.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {result.success ? "Pass" : "Fail"}
                </span>
              </div>
            </div>

            {result.success ? (
              <div className="text-green-600 text-xs">
                ✅ Success: {JSON.stringify(result.data?.retMsg || "OK")}
              </div>
            ) : (
              <div className="text-red-600 text-xs">
                ❌ Error: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
