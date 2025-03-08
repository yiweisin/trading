import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  // In a real application, we would check the authentication state here
  // For now, we'll just provide links to login and registration

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-2 mr-3">
              <div className="text-2xl font-bold text-blue-600">FC</div>
            </div>
            <div className="text-white text-2xl font-bold">Finance Cloud</div>
          </div>

          <div className="space-x-4">
            <Link
              href="/login"
              className="px-5 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Register
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Monitor your investments in real-time
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Track stocks, manage your portfolio, and get price alerts with our
              comprehensive trading platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium text-center hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-blue-700 text-white rounded-lg font-medium text-center hover:bg-blue-800 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Market Overview</h3>
                <div className="text-sm text-gray-500">Live</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium">S&P 500</div>
                  <div className="flex items-center text-green-600">
                    <span>5,234.31</span>
                    <span className="ml-2">+0.84%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">NASDAQ</div>
                  <div className="flex items-center text-green-600">
                    <span>16,432.72</span>
                    <span className="ml-2">+1.12%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Dow Jones</div>
                  <div className="flex items-center text-green-600">
                    <span>38,754.23</span>
                    <span className="ml-2">+0.66%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Your Portfolio</h3>
                <div className="text-sm text-gray-500">Demo</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium">AAPL</div>
                  <div className="flex items-center text-green-600">
                    <span>$192.53</span>
                    <span className="ml-2">+3.10%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">MSFT</div>
                  <div className="flex items-center text-green-600">
                    <span>$425.22</span>
                    <span className="ml-2">+2.47%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">TSLA</div>
                  <div className="flex items-center text-red-600">
                    <span>$174.48</span>
                    <span className="ml-2">-4.65%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Total Value</div>
                  <div className="text-lg font-bold">$124,567.89</div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-sm text-gray-500">Daily Change</div>
                  <div className="text-sm text-green-600">
                    +$1,234.56 (1.02%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="bg-blue-700 rounded-full p-3 inline-block mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Real-time Tracking
              </h3>
              <p className="text-blue-100">
                Monitor stocks in real-time with live price updates and market
                data.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="bg-blue-700 rounded-full p-3 inline-block mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Portfolio Management
              </h3>
              <p className="text-blue-100">
                Track your investments, analyze performance, and manage your
                portfolio efficiently.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="bg-blue-700 rounded-full p-3 inline-block mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Price Alerts
              </h3>
              <p className="text-blue-100">
                Set custom price alerts and get notified when stocks hit your
                target.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-blue-700 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-white text-lg font-bold flex items-center">
                <div className="bg-white rounded-lg p-1 mr-2">
                  <div className="text-sm font-bold text-blue-600">FC</div>
                </div>
                Finance Cloud
              </div>
              <p className="text-blue-200 mt-1">
                © {new Date().getFullYear()} Finance Cloud. All rights reserved.
              </p>
            </div>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
