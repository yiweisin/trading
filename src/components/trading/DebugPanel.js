"use client";

import { useState } from "react";
import { useBybitAPI } from "@/hooks/useBybitAPI";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function DebugPanel({ selectedKey }) {
  const [debugData, setDebugData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    getAccountBalance,
    getPositions,
    getActiveOrders,
    getAccountInfo,
    getInstruments,
  } = useBybitAPI(
    selectedKey?.apiKey,
    selectedKey?.apiSecret,
    selectedKey?.testnet
  );

  const runDebugTest = async (testName, apiCall) => {
    setLoading(true);
    try {
      console.log(`🔍 Running debug test: ${testName}`);
      const result = await apiCall();
      setDebugData((prev) => ({
        ...prev,
        [testName]: { success: true, data: result },
      }));
    } catch (error) {
      console.error(`❌ Debug test failed: ${testName}`, error);
      setDebugData((prev) => ({
        ...prev,
        [testName]: { success: false, error: error.message },
      }));
    }
    setLoading(false);
  };

  const runAllTests = async () => {
    if (!selectedKey) {
      alert("Please select an API key first");
      return;
    }

    await runDebugTest("Account Info", getAccountInfo);
    await runDebugTest("Account Balance", getAccountBalance);
    await runDebugTest("All Positions", getPositions);
    await runDebugTest("Active Orders", getActiveOrders);
    await runDebugTest("Available Instruments", getInstruments);
  };

  return (
    <Card title="🔧 Debug Panel">
      <div className="space-y-4">
        <Button onClick={runAllTests} disabled={loading || !selectedKey}>
          {loading ? "Running Tests..." : "Run Debug Tests"}
        </Button>

        {Object.entries(debugData).map(([testName, result]) => (
          <div key={testName} className="border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{testName}</h4>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  result.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {result.success ? "Success" : "Failed"}
              </span>
            </div>

            {result.success ? (
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <div className="text-red-600 text-sm">Error: {result.error}</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
