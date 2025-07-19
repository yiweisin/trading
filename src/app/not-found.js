"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="brand-logo">
            <div className="logo-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="brand-text">TradeLux</span>
          </div>

          <div className="error-info">
            <h1 className="error-code">404</h1>
            <h2 className="error-title">Page Not Found</h2>
            <p className="error-description">
              The page you&apos;re looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="error-actions">
            <Link href="/" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="9,22 9,12 15,12 15,22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Go Home
            </Link>
            <Link href="/api-keys" className="btn btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              API Keys
            </Link>
          </div>
        </div>

        <div className="error-animation">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .not-found-container {
          text-align: center;
          max-width: 600px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .not-found-content {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-lg);
          padding: 4rem 3rem;
          box-shadow: var(--shadow-large);
        }

        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .logo-icon {
          background: var(--gradient-primary);
          border-radius: 12px;
          padding: 1rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text {
          font-size: 2rem;
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .error-info {
          margin-bottom: 3rem;
        }

        .error-code {
          font-size: 6rem;
          font-weight: 900;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          line-height: 1;
        }

        .error-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .error-description {
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: white;
          border: 1px solid var(--accent-gold);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-medium);
        }

        .btn-outline {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-primary);
        }

        .btn-outline:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--accent-gold);
        }

        .error-animation {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .floating-shapes {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          background: var(--gradient-primary);
          opacity: 0.1;
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 120px;
          height: 120px;
          top: 20%;
          left: 10%;
          animation-delay: -2s;
        }

        .shape-2 {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 15%;
          animation-delay: -4s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: -1s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @media (max-width: 768px) {
          .not-found-content {
            padding: 3rem 2rem;
          }

          .error-code {
            font-size: 4rem;
          }

          .error-title {
            font-size: 2rem;
          }

          .brand-text {
            font-size: 1.5rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 200px;
          }
        }

        @media (max-width: 480px) {
          .not-found-page {
            padding: 1rem;
          }

          .not-found-content {
            padding: 2rem 1.5rem;
          }

          .error-code {
            font-size: 3rem;
          }

          .error-title {
            font-size: 1.75rem;
          }

          .brand-text {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
