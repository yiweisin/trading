import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col ml-0 md:ml-64 min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-24">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
