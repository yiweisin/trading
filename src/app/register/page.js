"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signup(email, password, displayName);
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
              <h2>Create Account</h2>
              <p>Join thousands of successful traders</p>
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
              <label className="form-label">Display Name</label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="password-requirements">
                <small className="form-help">
                  Password must be at least 6 characters long
                </small>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
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
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="terms-agreement">
              <label className="checkbox-label">
                <input type="checkbox" className="form-checkbox" required />
                <div className="checkbox-content">
                  <div className="checkbox-text">
                    I agree to the{" "}
                    <a href="#" className="auth-link">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="auth-link">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg auth-submit"
            >
              {loading ? (
                <>
                  <div className="loading-spinner btn-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="8.5"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="20"
                      y1="8"
                      x2="20"
                      y2="14"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="23"
                      y1="11"
                      x2="17"
                      y2="11"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-text">
              Already have an account?{" "}
              <Link href="/login" className="auth-link primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-benefits">
          <div className="benefits-header">
            <h3>Why Choose TradePro?</h3>
            <p>Everything you need for professional trading</p>
          </div>

          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Multi-Account Trading</h4>
                <p>
                  Execute orders across multiple Bybit accounts simultaneously
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
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
              <div className="benefit-content">
                <h4>Bank-Level Security</h4>
                <p>
                  Your API keys are encrypted with industry-standard security
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Lightning Fast</h4>
                <p>Real-time order execution and portfolio monitoring</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 19c-5 0-8-3-8-7s3-7 8-7h2l1 4h4l1-4h2c5 0 8 3 8 7s-3 7-8 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="benefit-content">
                <h4>Risk Management</h4>
                <p>Advanced position monitoring and risk controls</p>
              </div>
            </div>
          </div>

          <div className="signup-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Traders</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$50M+</div>
              <div className="stat-label">Volume Traded</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
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

        .password-requirements {
          margin-top: 0.5rem;
        }

        .terms-agreement {
          margin: 0.5rem 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }

        .checkbox-content {
          flex: 1;
        }

        .checkbox-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
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
        }

        .auth-link {
          color: var(--accent-blue);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
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

        .auth-benefits {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .benefits-header {
          text-align: center;
        }

        .benefits-header h3 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .benefits-header p {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--gradient-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .benefit-item:hover {
          transform: translateX(8px);
          box-shadow: var(--shadow-medium);
        }

        .benefit-icon {
          background: var(--gradient-primary);
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .benefit-content h4 {
          color: var(--text-primary);
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .benefit-content p {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
          font-size: 0.875rem;
        }

        .signup-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding: 2rem;
          background: var(--gradient-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-blue);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.025em;
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

          .benefits-header h3 {
            font-size: 1.75rem;
          }

          .signup-stats {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .auth-page {
            padding: 1rem;
          }

          .auth-card {
            padding: 1.5rem;
          }

          .benefit-item {
            padding: 1rem;
          }

          .benefit-icon {
            width: 2.5rem;
            height: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
