"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Key, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "API Keys", href: "/api-keys", icon: Key },
  { name: "Trading", href: "/trading", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900">Bybit Trading</h1>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  } group flex items-center px-3 py-2 text-sm font-medium border-l-4`}
                >
                  <item.icon
                    className={`${
                      isActive ? "text-blue-500" : "text-gray-400"
                    } mr-3 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="px-2 pb-4">
            <button
              onClick={logout}
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
            >
              <LogOut className="text-gray-400 mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
