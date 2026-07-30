"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
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
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r bg-slate-50">
      <SidebarHeader className="border-b shadow-md bg-[linear-gradient(135deg,#0E4C92_0%,#1976D2_55%,#4FC3F7_100%)]">
        <div className="flex items-center gap-3 px-4 py-5">
          <Image
            src="/logo.png"
            alt="Digital Guest Book"
            width={42}
            height={42}
            priority
            className="rounded-lg"
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
    </Sidebar>
  );
}