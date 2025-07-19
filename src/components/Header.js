"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    router.push("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navigation = [
    {
      name: "Trading",
      href: "/",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      name: "API Keys",
      href: "/api-keys",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="header">
      <div className="header-content">
        {/* Brand */}
        <div className="header-brand">
          <Link href="/" className="brand-logo">
            <div className="logo-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="brand-text">TradeLux</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        {/* User Menu */}
        <div className="user-menu" ref={menuRef}>
          <button
            className="user-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {getInitials(user?.displayName || user?.email)}
            </div>
            <span className="user-name">
              {user?.displayName || user?.email?.split("@")[0]}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">
                    {user?.displayName || "User"}
                  </div>
                  <div className="dropdown-user-email">{user?.email}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-content">
                <button onClick={handleLogout} className="dropdown-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`mobile-nav-item ${
                  pathname === item.href ? "active" : ""
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="mobile-menu-divider"></div>
          <div className="mobile-user-section">
            <div className="mobile-user-info">
              <div className="mobile-user-name">
                {user?.displayName || "User"}
              </div>
              <div className="mobile-user-email">{user?.email}</div>
            </div>
            <button onClick={handleLogout} className="mobile-logout-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-large);
          min-width: 240px;
          z-index: 1000;
          overflow: hidden;
        }

        .dropdown-header {
          padding: var(--space-md);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-secondary);
        }

        .dropdown-user-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .dropdown-user-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .dropdown-user-email {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-secondary);
        }

        .dropdown-content {
          padding: var(--space-sm) 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          padding: var(--space-sm) var(--space-md);
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
          font-size: 0.875rem;
        }

        .dropdown-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .user-name {
          font-weight: 500;
          color: var(--text-primary);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-sm);
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .mobile-menu-button:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .mobile-menu {
          display: none;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-secondary);
          padding: var(--space-md);
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--border-radius);
          transition: var(--transition);
          font-weight: 500;
        }

        .mobile-nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .mobile-nav-item.active {
          background: var(--bg-tertiary);
          color: var(--accent-gold);
        }

        .mobile-menu-divider {
          height: 1px;
          background: var(--border-secondary);
          margin: var(--space-md) 0;
        }

        .mobile-user-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .mobile-user-info {
          padding: var(--space-sm) var(--space-md);
        }

        .mobile-user-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-xs);
        }

        .mobile-user-email {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .mobile-logout-btn {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          border-radius: var(--border-radius);
          font-size: 0.875rem;
        }

        .mobile-logout-btn:hover {
          background: var(--bg-hover);
          color: var(--status-error);
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .mobile-menu {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .brand-text {
            display: none;
          }

          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
