"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="brand-text">TradePro</span>
            </div>
            <div className="auth-title">
              <h2>Welcome Back</h2>
              <p>Sign in to your trading account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                  <path
                    d="M7 11V7a5 5 0 0110 0v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg auth-submit"
            >
              {loading ? (
                <>
                  <div className="loading-spinner btn-spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m-5-4l4-4-4-4m5 4H3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <Link href="/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
            <p className="auth-text">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="auth-link primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4>Secure Trading</h4>
            <p>Your API keys are encrypted and stored securely</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4>Multi-Account</h4>
            <p>Trade across multiple Bybit accounts simultaneously</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4>Real-time</h4>
            <p>Monitor positions and orders in real-time</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-container {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .auth-card {
          background: var(--gradient-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 3rem;
          box-shadow: var(--shadow-large);
          max-width: 480px;
          width: 100%;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .logo-icon {
          background: var(--gradient-primary);
          border-radius: 12px;
          padding: 0.75rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text {
          font-size: 1.75rem;
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-title h2 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .auth-title p {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-wrapper .form-input {
          padding-left: 3rem;
        }

        .auth-submit {
          margin-top: 1rem;
        }

        .btn-spinner {
          width: 1rem;
          height: 1rem;
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-link {
          color: var(--accent-blue);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          font-size: 0.875rem;
        }

        .auth-link:hover {
          color: var(--accent-blue-hover);
          text-decoration: underline;
        }

        .auth-link.primary {
          font-weight: 600;
        }

        .auth-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem 0;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: center;
          padding: 2rem;
          background: var(--gradient-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .feature-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-medium);
        }

        .feature-icon {
          background: var(--gradient-primary);
          border-radius: 50%;
          width: 4rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto;
        }

        .feature-item h4 {
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .feature-item p {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1rem;
          }

          .auth-card {
            padding: 2rem;
            max-width: 100%;
          }

          .auth-title h2 {
            font-size: 1.75rem;
          }

          .brand-text {
            font-size: 1.5rem;
          }

          .auth-features {
            order: -1;
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .feature-item {
            padding: 1.5rem;
            text-align: left;
            flex-direction: row;
            align-items: center;
          }

          .feature-icon {
            width: 3rem;
            height: 3rem;
            flex-shrink: 0;
            margin: 0;
          }

          .feature-item h4 {
            font-size: 1.125rem;
          }

          .feature-item p {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 480px) {
          .auth-page {
            padding: 1rem;
          }

          .auth-card {
            padding: 1.5rem;
          }

          .feature-item {
            flex-direction: column;
            text-align: center;
          }

          .feature-icon {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
