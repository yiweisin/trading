import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata = {
  title: "Bybit Trading App",
  description: "Multi-account trading interface for Bybit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
