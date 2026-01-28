import { Header } from "@/components/layout/Header"; // পাথ চেক করুন (আপনার ফোল্ডার অনুযায়ী)
import { Sidebar } from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // ধাপ ১ এর ফাইল

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ১. পুরো লেআউটকে গার্ড দিয়ে মুড়িয়ে দিলাম
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* ২. বাম পাশে সাইডবার */}
        <div className="hidden md:block w-64 h-full fixed inset-y-0 z-50">
          <Sidebar />
        </div>

        {/* ৩. ডান পাশে হেডার এবং কন্টেন্ট */}
        <div className="flex-1 md:pl-64 flex flex-col h-full">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}