import Link from "next/link";
import PortfolioSummary from "@/components/dashboard/portfolio-summary";
import Watchlist from "@/components/dashboard/watchlist";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Portfolio Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center h-32">
          <div className="rounded-full bg-blue-100 p-4 mr-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Portfolio Value</p>
            <p className="text-2xl font-bold">$124,567.89</p>
            <p className="text-sm text-green-600">+$1,234.56 (1.02%) today</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center h-32">
          <div className="rounded-full bg-purple-100 p-4 mr-4">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Top Performer</p>
            <Link
              href="/dashboard/chart/NVDA/D"
              className="text-2xl font-bold hover:text-blue-600"
            >
              NVDA
            </Link>
            <p className="text-sm text-green-600">+$10.25 (2.47%) today</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Stocks Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Active Stocks</h2>
            <Link
              href="/dashboard/trading"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Trade
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <Link
                  href="/dashboard/chart/AAPL/D"
                  className="font-medium hover:text-blue-600"
                >
                  AAPL
                </Link>
                <p className="text-xs text-gray-500">Apple Inc.</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$192.53</p>
                <p className="text-xs text-green-600">+3.10%</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <Link
                  href="/dashboard/chart/MSFT/D"
                  className="font-medium hover:text-blue-600"
                >
                  MSFT
                </Link>
                <p className="text-xs text-gray-500">Microsoft Corp</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$425.22</p>
                <p className="text-xs text-green-600">+2.47%</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <Link
                  href="/dashboard/chart/GOOGL/D"
                  className="font-medium hover:text-blue-600"
                >
                  GOOGL
                </Link>
                <p className="text-xs text-gray-500">Alphabet Inc.</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$145.23</p>
                <p className="text-xs text-green-600">+1.73%</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <Link
                  href="/dashboard/chart/NVDA/D"
                  className="font-medium hover:text-blue-600"
                >
                  NVDA
                </Link>
                <p className="text-xs text-gray-500">NVIDIA Corp</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$435.25</p>
                <p className="text-xs text-green-600">+3.65%</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Link
                  href="/dashboard/chart/TSLA/D"
                  className="font-medium hover:text-blue-600"
                >
                  TSLA
                </Link>
                <p className="text-xs text-gray-500">Tesla Inc.</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$174.48</p>
                <p className="text-xs text-red-600">-4.65%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="lg:col-span-2">
          <Watchlist />
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 gap-6">
        <PortfolioSummary />
      </div>
    </div>
  );
}
