"use client";

import { useState } from "react";
import { useApiKeys } from "@/hooks/useApiKeys";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Plus, Trash2, Key, Shield } from "lucide-react";

export default function ApiKeys() {
  const { apiKeys, loading, addApiKey, removeApiKey } = useApiKeys();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    apiSecret: "",
    testnet: true,
  });
  const [submitting, setSubmitting] = useState(false);

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
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
                  <p className="text-gray-600">
                    Manage your Bybit API keys for trading
                  </p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add API Key
                </Button>
              </div>

              <div className="grid gap-6">
                {loading ? (
                  <Card>
                    <div className="text-center py-8">Loading...</div>
                  </Card>
                ) : apiKeys.length === 0 ? (
                  <Card>
                    <div className="text-center py-12">
                      <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No API Keys
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Add your first Bybit API key to start trading
                      </p>
                      <Button onClick={() => setShowModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add API Key
                      </Button>
                    </div>
                  </Card>
                ) : (
                  apiKeys.map((key) => (
                    <Card key={key.id}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold mr-2">
                              {key.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                key.testnet
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {key.testnet ? "Testnet" : "Mainnet"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-2" />
                              API Key: {key.apiKey?.slice(0, 8)}...
                            </div>
                            <div>
                              Created:{" "}
                              {new Date(key.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(key.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add API Key"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Account Name (e.g., Main Account)"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />

                  <Input
                    placeholder="API Key"
                    value={formData.apiKey}
                    onChange={(e) =>
                      setFormData({ ...formData, apiKey: e.target.value })
                    }
                    required
                  />

                  <Input
                    placeholder="API Secret"
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) =>
                      setFormData({ ...formData, apiSecret: e.target.value })
                    }
                    required
                  />

                  <div className="space-y-2">
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
                      <label htmlFor="testnet" className="text-sm">
                        Use Testnet (Demo trading with fake money)
                      </label>
                    </div>

                    {!formData.testnet && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <span className="text-red-600 font-semibold">
                            ⚠️ MAINNET WARNING
                          </span>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          You are adding LIVE trading keys. This will use REAL
                          MONEY. Make sure you understand the risks and start
                          with small amounts.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? "Adding..."
                        : formData.testnet
                        ? "Add Testnet Key"
                        : "Add LIVE Key"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Modal>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
