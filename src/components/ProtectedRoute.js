"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="protected-loading">
        <div className="loading-container">
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

          <div className="loading-content">
            <div className="loading-spinner large"></div>
            <div className="loading-text">
              <h3>Loading your dashboard...</h3>
              <p>Setting up your trading environment</p>
            </div>
          </div>

          <div className="loading-steps">
            <div className="step active">
              <div className="step-indicator"></div>
              <span>Authenticating</span>
            </div>
            <div className="step">
              <div className="step-indicator"></div>
              <span>Loading API Keys</span>
            </div>
            <div className="step">
              <div className="step-indicator"></div>
              <span>Initializing Dashboard</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .protected-loading {
            min-height: 100vh;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .loading-container {
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          .brand-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 3rem;
          }

          .logo-icon {
            background: var(--gradient-primary);
            border-radius: 12px;
            padding: 0.75rem;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          }

          .brand-text {
            font-size: 1.75rem;
            font-weight: 700;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .loading-content {
            margin-bottom: 3rem;
          }

          .loading-spinner.large {
            width: 4rem;
            height: 4rem;
            border-width: 3px;
            margin: 0 auto 2rem;
          }

          .loading-text h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }

          .loading-text p {
            color: var(--text-secondary);
            font-size: 1rem;
          }

          .loading-steps {
            display: flex;
            justify-content: center;
            gap: 2rem;
          }

          .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            opacity: 0.4;
            transition: var(--transition);
          }

          .step.active {
            opacity: 1;
          }

          .step-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--text-muted);
            transition: var(--transition);
          }

          .step.active .step-indicator {
            background: var(--accent-blue);
            animation: pulse 2s infinite;
          }

          .step span {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .step.active span {
            color: var(--text-primary);
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }

          @media (max-width: 480px) {
            .protected-loading {
              padding: 1rem;
            }

            .loading-steps {
              flex-direction: column;
              gap: 1rem;
            }

            .step {
              flex-direction: row;
              justify-content: center;
            }

            .brand-text {
              font-size: 1.5rem;
            }

            .loading-text h3 {
              font-size: 1.25rem;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!user) return null;
  return children;
}
