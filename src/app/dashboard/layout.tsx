import type { ReactNode } from "react";
import { requireAuth } from "@/lib/auth"; // 1. Import fungsi proteksi
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";

// 2. Tambahkan kata 'async' di depan function
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 3. Panggil fungsi proteksi (akan me-redirect ke /login jika tidak ada sesi)
  const session = await requireAuth();

  return (
    <SidebarProvider>
      {/* Jika ke depannya kamu ingin menampilkan nama/role admin, kamu bisa mengirim props: user={session} */}
      <AppSidebar />

      <SidebarInset>
        <SiteHeader />

        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}