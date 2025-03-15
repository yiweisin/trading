"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          FinPortfolio
        </Link>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-white hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/portfolios" className="text-white hover:text-gray-300">
            Portfolios
          </Link>
        </div>
      </div>
    </nav>
  );
}
