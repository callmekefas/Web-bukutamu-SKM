"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logoutAction } from "@/lib/actions/auth"; // <-- Import fungsi logout

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Settings,
  UserCog,
  LogOut, // <-- Import icon LogOut
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter, // <-- Import SidebarFooter
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Guest Management",
    href: "/dashboard/guests",
    icon: Users,
  },
  {
    title: "Survey Management",
    href: "/dashboard/surveys/questions",
    icon: ClipboardList,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: UserCog,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r bg-slate-50 flex flex-col justify-between">
      
      {/* --- BAGIAN ATAS: Header dan Menu --- */}
      <div>
        <SidebarHeader className="border-b shadow-md bg-[linear-gradient(135deg,#0E4C92_0%,#1976D2_55%,#4FC3F7_100%)]">
          <div className="flex items-center gap-3 px-4 py-5">
            <Image
              src="/logo.png"
              alt="Digital Guest Book"
              width={42}
              height={42}
              priority
              className="rounded-lg w-auto h-auto" 
            />

            <div className="flex flex-col">
              <span className="font-semibold leading-none text-white">
                Digital Guest Book
              </span>

              <span className="text-xs text-blue-100">
                Diskominfo
              </span>
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

      {/* --- BAGIAN BAWAH: Tombol Logout dengan Konfirmasi --- */}
      <SidebarFooter className="p-3 border-t border-slate-200">
        <form 
          action={logoutAction}
          onSubmit={(e) => {
            // Memunculkan popup konfirmasi bawaan browser
            const isConfirmed = window.confirm("Apakah Anda yakin ingin keluar dari sistem?");
            
            // Jika user memilih Cancel, batalkan proses form (tidak jadi logout)
            if (!isConfirmed) {
              e.preventDefault();
            }
          }}
        >
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </SidebarFooter>

    </Sidebar>
  );
}