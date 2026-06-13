import { AdminDialogProvider } from "@/components/admin/AdminDialogContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminDialogProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main
          className="flex-1 overflow-y-auto pb-16 lg:pb-0"
          style={{
            background:
              "linear-gradient(135deg, #fafbfc 0%, #f8f9fa 50%, #f0f2f5 100%)",
          }}
        >
          <AdminHeader />
          <div className="relative pt-16 lg:pt-0">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative motion-safe:animate-fade-in-up">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AdminDialogProvider>
  );
}
