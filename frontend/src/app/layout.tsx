import "./globals.css";
import Navigation from "@/components/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
