import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
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