"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportGuestButton from "@/components/ExportGuestButton";

export function GuestToolbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Fungsi pencarian
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Fungsi Filter Layanan
  const handleFilter = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset ke halaman 1 saat filter berubah
    
    if (value && value !== "ALL") {
      params.set("service", value);
    } else {
      params.delete("service");
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
      <div className="flex flex-1 items-center space-x-2 w-full sm:w-auto">
        {/* Kolom Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama atau WhatsApp..."
            className="pl-8 bg-white"
            defaultValue={searchParams.get("search")?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        {/* Dropdown Filter Layanan */}
        <Select
          defaultValue={searchParams.get("service")?.toString() || "ALL"}
          onValueChange={handleFilter}
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Semua Layanan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Layanan</SelectItem>
            <SelectItem value="DOMAIN_SUBDOMAIN">Domain & Subdomain</SelectItem>
            <SelectItem value="E_GOVERNMENT">E-Government</SelectItem>
            <SelectItem value="COMMAND_CENTER">Command Center</SelectItem>
            <SelectItem value="INFORMASI_KOMUNIKASI">Informasi & Komunikasi</SelectItem>
            <SelectItem value="LAINNYA">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Tombol Export yang Sudah Diperbaiki */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <ExportGuestButton />
      </div>
    </div>
  );
}