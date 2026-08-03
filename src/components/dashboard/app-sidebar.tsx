"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react"; // <-- Tambahan useState
import { logoutAction } from "@/lib/actions/auth";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Settings,
  UserCog,
  LogOut,
  LogOutIcon, // <-- Tambahan Icon untuk popup
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menus = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Guest Management", href: "/dashboard/guests", icon: Users },
  { title: "Survey Management", href: "/dashboard/surveys/questions", icon: ClipboardList },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
  { title: "User Management", href: "/dashboard/users", icon: UserCog },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // <-- State untuk popup

  return (
    <Sidebar className="border-r bg-slate-50 flex flex-col justify-between">
      
      {/* --- BAGIAN ATAS: Header dan Menu --- */}
      <div>
        <SidebarHeader className="border-b shadow-md bg-[linear-gradient(135deg,#0E4C92_0%,#1976D2_55%,#4FC3F7_100%)]">
          <div className="flex items-center gap-3 px-4 py-5">
            <Image src="/logo.png" alt="Digital Guest Book" width={42} height={42} priority className="rounded-lg w-auto h-auto" />
            <div className="flex flex-col">
              <span className="font-semibold leading-none text-white">Digital Guest Book</span>
              <span className="text-xs text-blue-100">Diskominfo</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menus.map((menu) => (
              <SidebarMenuItem key={menu.href}>
                <SidebarMenuButton
                  render={
                    <Link href={menu.href}>
                      <menu.icon className="size-4" />
                      <span>{menu.title}</span>
                    </Link>
                  }
                  isActive={pathname === menu.href}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </div>

      {/* --- BAGIAN BAWAH: Tombol Logout --- */}
      <SidebarFooter className="p-3 border-t border-slate-200">
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="size-4" />
          <span>Keluar (Logout)</span>
        </button>
      </SidebarFooter>

      {/* --- POPUP LOGOUT MODERN --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <LogOutIcon className="w-8 h-8 ml-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Konfirmasi Keluar</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Apakah Anda yakin ingin keluar dari sistem E-Bukutamu & SKM?
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-semibold text-sm"
              >
                Batal
              </button>
              
              {/* Form Logout tersembunyi */}
              <form action={logoutAction} className="flex-1">
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Ya, Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </Sidebar>
  );
}