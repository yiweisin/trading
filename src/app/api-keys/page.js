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
      <div className="api-keys-page">
        <Header />

        <main className="main-content">
          <div className="container">
            {/* Back Navigation */}
            <div className="back-navigation">
              <button onClick={() => router.push("/")} className="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Trading
              </button>
            </div>

            <div className="page-header">
              <div className="page-header-content">
                <div className="page-header-text">
                  <h1 className="page-title">API Key Management</h1>
                  <p className="page-subtitle">
                    Manage your Bybit API keys for multi-account trading
                  </p>
                </div>
                <div className="page-header-actions">
                  <button
                    onClick={() => router.push("/")}
                    className="btn btn-secondary"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back to Trading
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 4v16m8-8H4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Add API Key
                  </button>
                </div>
              </div>
            </div>

            <div className="api-keys-content">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading API keys...</p>
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="empty-state-title">No API Keys</h3>
                  <p className="empty-state-description">
                    Add your first Bybit API key to start trading across
                    multiple accounts
                  </p>
                  <div className="empty-state-actions">
                    <button
                      onClick={() => setShowModal(true)}
                      className="btn btn-primary btn-lg"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 4v16m8-8H4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Add Your First API Key
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="btn btn-outline"
                    >
                      Back to Trading
                    </button>
                  </div>
                </div>
              ) : (
                <div className="api-keys-grid">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="api-key-card">
                      <div className="api-key-header">
                        <div className="api-key-info">
                          <h3 className="api-key-name">{key.name}</h3>
                          <div className="api-key-badges">
                            <span
                              className={`badge ${
                                key.testnet ? "badge-warning" : "badge-danger"
                              }`}
                            >
                              {key.testnet ? "Testnet" : "Mainnet"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(key.id)}
                          className="delete-btn"
                          title="Delete API Key"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="api-key-details">
                        <div className="api-key-detail">
                          <span className="detail-label">API Key:</span>
                          <span className="detail-value">
                            {key.apiKey?.slice(0, 8)}...
                          </span>
                        </div>
                        <div className="api-key-detail">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">
                            {new Date(key.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="api-key-detail">
                          <span className="detail-label">Status:</span>
                          <span className="detail-value status-active">
                            <div className="status-indicator"></div>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Success Button */}
              {apiKeys.length > 0 && (
                <div className="success-actions">
                  <button
                    onClick={() => router.push("/")}
                    className="btn btn-success btn-lg"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Done - Start Trading
                  </button>
                </div>
              )}
            </div>

            {/* Modal */}
            {showModal && (
              <div className="modal-backdrop">
                <div className="modal">
                  <div className="modal-header">
                    <h3 className="modal-title">Add API Key</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="modal-close-btn"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Account Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Main Account, Trading Bot"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="form-input"
                        required
                      />
                      <div className="form-help">
                        Give your API key a memorable name
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">API Key</label>
                      <input
                        type="text"
                        placeholder="Your Bybit API Key"
                        value={formData.apiKey}
                        onChange={(e) =>
                          setFormData({ ...formData, apiKey: e.target.value })
                        }
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">API Secret</label>
                      <input
                        type="password"
                        placeholder="Your Bybit API Secret"
                        value={formData.apiSecret}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apiSecret: e.target.value,
                          })
                        }
                        className="form-input"
                        required
                      />
                      <div className="form-help">
                        Your API secret is encrypted and stored securely
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.testnet}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              testnet: e.target.checked,
                            })
                          }
                          className="form-checkbox"
                        />
                        <div className="checkbox-content">
                          <div className="checkbox-title">Use Testnet</div>
                          <div className="checkbox-description">
                            Recommended for testing. Uncheck to use live
                            trading.
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="modal-actions">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        {submitting ? (
                          <>
                            <div className="loading-spinner btn-spinner"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M12 4v16m8-8H4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Add API Key
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="btn btn-secondary"
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

      <style jsx>{`
        .api-keys-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .main-content {
          padding: 2rem 0;
        }

        .back-navigation {
          margin-bottom: 1.5rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }

        .back-btn:hover {
          color: var(--text-primary);
        }

        .page-header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .page-header-text {
          flex: 1;
        }

        .page-header-actions {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .api-keys-content {
          margin-top: 2rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: var(--text-secondary);
        }

        .loading-state .loading-spinner {
          width: 3rem;
          height: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state {
          background: var(--gradient-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 4rem 2rem;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-state-icon {
          margin-bottom: 2rem;
          opacity: 0.5;
          color: var(--text-muted);
        }

        .empty-state-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .empty-state-description {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-size: 1.125rem;
          line-height: 1.6;
        }

        .empty-state-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .api-keys-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .api-key-card {
          background: var(--gradient-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          transition: var(--transition);
        }

        .api-key-card:hover {
          box-shadow: var(--shadow-medium);
          transform: translateY(-2px);
        }

        .api-key-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .api-key-info {
          flex: 1;
        }

        .api-key-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .api-key-badges {
          display: flex;
          gap: 0.5rem;
        }

        .delete-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent-red);
        }

        .api-key-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .api-key-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .detail-value {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
        }

        .status-active {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-green) !important;
          font-family: inherit !important;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: var(--accent-green);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .success-actions {
          text-align: center;
          padding: 2rem 0;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .modal-close-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .form-help {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.375rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .checkbox-label:hover {
          background: var(--bg-hover);
        }

        .checkbox-content {
          flex: 1;
        }

        .checkbox-title {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .checkbox-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .modal-actions .btn {
          flex: 1;
        }

        .btn-spinner {
          width: 1rem;
          height: 1rem;
        }

        @media (max-width: 768px) {
          .page-header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }

          .page-header-actions {
            flex-direction: column;
            width: 100%;
          }

          .api-keys-grid {
            grid-template-columns: 1fr;
          }

          .empty-state {
            padding: 3rem 1.5rem;
          }

          .empty-state-actions {
            flex-direction: column;
            width: 100%;
          }

          .modal {
            margin: 1rem;
            max-width: calc(100vw - 2rem);
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </ProtectedRoute>
  );
}
