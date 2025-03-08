import Link from "next/link";
import MarketOverview from "@/components/dashboard/market-overview";
import PortfolioSummary from "@/components/dashboard/portfolio-summary";
import Watchlist from "@/components/dashboard/watchlist";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center h-32">
          <div className="rounded-full bg-yellow-100 p-4 mr-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Alerts</p>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-blue-600">2 triggered today</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
        <div>
          <Watchlist />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Trading View Charts</h2>
          <Link
            href="/dashboard/chart/AAPL/D"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All Charts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/chart/AAPL/D"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">AAPL</span>
              <span className="text-green-600">+3.10%</span>
            </div>
            <p className="text-sm text-gray-500">Apple Inc.</p>
            <div className="h-20 bg-gray-100 mt-2 rounded flex items-center justify-center">
              <svg
                className="w-full h-12 text-blue-500"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,15 L10,12 C20,10 25,20 30,15 C35,10 40,5 50,10 C60,15 65,5 70,10 C75,15 80,20 90,15 L100,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/dashboard/chart/MSFT/D"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">MSFT</span>
              <span className="text-green-600">+2.47%</span>
            </div>
            <p className="text-sm text-gray-500">Microsoft Corp</p>
            <div className="h-20 bg-gray-100 mt-2 rounded flex items-center justify-center">
              <svg
                className="w-full h-12 text-blue-500"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,20 L10,18 C20,15 25,25 30,20 C35,15 40,10 50,15 C60,20 65,10 70,15 C75,10 80,15 90,10 L100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/dashboard/chart/GOOGL/D"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">GOOGL</span>
              <span className="text-green-600">+1.73%</span>
            </div>
            <p className="text-sm text-gray-500">Alphabet Inc.</p>
            <div className="h-20 bg-gray-100 mt-2 rounded flex items-center justify-center">
              <svg
                className="w-full h-12 text-blue-500"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,10 L10,15 C20,20 25,15 30,10 C35,5 40,10 50,15 C60,10 65,15 70,10 C75,15 80,10 90,15 L100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PortfolioSummary />
      </div>
    </div>
  );
}
