"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">

      <div className="flex items-center gap-3">

        <SidebarTrigger />

        <h1 className="font-semibold">
          Dashboard Admin
        </h1>

      </div>

      <Bell className="size-5 cursor-pointer" />

    </header>
  );
}