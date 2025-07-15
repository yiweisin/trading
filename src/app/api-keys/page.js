"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiKeys } from "@/hooks/useApiKeys";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";

export default function ApiKeysPage() {
  const { apiKeys, loading, addApiKey, removeApiKey } = useApiKeys();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    apiSecret: "",
    testnet: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const success = await addApiKey(formData);
    if (success) {
      setShowModal(false);
      setFormData({ name: "", apiKey: "", apiSecret: "", testnet: true });
    }

    setSubmitting(false);
  };

  const handleDelete = async (keyId) => {
    if (confirm("Are you sure you want to delete this API key?")) {
      await removeApiKey(keyId);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Header />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => router.push("/")}
                className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Trading
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">API Keys</h1>
                <p className="text-gray-400">
                  Manage your Bybit API keys for trading
                </p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                {/* Back to Trading Button */}
                <button
                  onClick={() => router.push("/")}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Trading
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add API Key
                </button>
              </div>
            </div>

            {/* Rest of the component remains the same */}
            {loading ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <svg
                  className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">
                  No API Keys
                </h3>
                <p className="text-gray-400 mb-6">
                  Add your first Bybit API key to start trading
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add API Key
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back to Trading
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-white mr-2">
                            {key.name}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              key.testnet
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-green-900/30 text-green-400"
                            }`}
                          >
                            {key.testnet ? "Testnet" : "Mainnet"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <div>API Key: {key.apiKey?.slice(0, 8)}...</div>
                          <div>
                            Created:{" "}
                            {new Date(key.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Success/Done Button */}
            {apiKeys.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push("/")}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Done - Start Trading
                </button>
              </div>
            )}

            {/* Modal remains the same */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-lg max-w-md w-full">
                  <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">
                      Add API Key
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input
                      type="text"
                      placeholder="Account Name (e.g., Main Account)"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />

                    <input
                      type="text"
                      placeholder="API Key"
                      value={formData.apiKey}
                      onChange={(e) =>
                        setFormData({ ...formData, apiKey: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />

                    <input
                      type="password"
                      placeholder="API Secret"
                      value={formData.apiSecret}
                      onChange={(e) =>
                        setFormData({ ...formData, apiSecret: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="testnet"
                        checked={formData.testnet}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            testnet: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor="testnet"
                        className="text-sm text-gray-300"
                      >
                        Use Testnet (recommended for testing)
                      </label>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submitting ? "Adding..." : "Add API Key"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-gray-700 text-white py-3 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
