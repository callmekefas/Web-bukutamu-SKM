"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { 
  MoreHorizontal, Eye, Edit, Trash, User, Phone, Hash, AppWindow, Calendar, Info,
  GraduationCap, Briefcase, UserCircle
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { deleteGuest, updateGuest } from "@/lib/actions/guests";

export type Guest = {
  id: string;
  name: string;
  whatsapp: string;
  age?: number | null;
  gender?: string | null;
  education?: string | null;
  occupation?: string | null;
  service: string;
  rawService: string;
  customService?: string | null;
  createdAt: string;
};

// 1. TAMBAHKAN INTERFACE TEGAS UNTUK FORM
type FormState = {
  fullName: string;
  whatsapp: string;
  age: string;
  gender: string;
  education: string;
  occupation: string;
  service: string;
  customService: string;
};

const ActionCell = ({ guest }: { guest: Guest }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"detail" | "edit">("detail");
  const [isUpdating, setIsUpdating] = useState(false);

  // 2. STATE DEFAULT YANG AMAN DARI NULL
  const [formData, setFormData] = useState<FormState>({
    fullName: guest.name || "",
    whatsapp: guest.whatsapp || "",
    age: guest.age ? guest.age.toString() : "",
    gender: guest.gender || "LAKI_LAKI",
    education: guest.education || "S1",
    occupation: guest.occupation || "PNS",
    service: guest.rawService || "LAINNYA",
    customService: guest.customService || "",
  });

  const handleDelete = async () => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus data ${guest.name}?`);
    if (isConfirmed) {
      const result = await deleteGuest(guest.id);
      alert(result.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const result = await updateGuest(guest.id, formData);
    setIsUpdating(false);
    alert(result.message);
    if (result.success) setIsSheetOpen(false);
  };

  const openSheet = (mode: "detail" | "edit") => {
    setSheetMode(mode);
    setIsSheetOpen(true);
    if (mode === "edit") {
      setFormData({
        fullName: guest.name || "",
        whatsapp: guest.whatsapp || "",
        age: guest.age ? guest.age.toString() : "",
        gender: guest.gender || "LAKI_LAKI",
        education: guest.education || "S1",
        occupation: guest.occupation || "PNS",
        service: guest.rawService || "LAINNYA",
        customService: guest.customService || "",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400">
          <MoreHorizontal className="h-4 w-4 text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openSheet("detail")}>
              <Eye className="mr-2 h-4 w-4 text-slate-500" /> Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openSheet("edit")}>
              <Edit className="mr-2 h-4 w-4 text-blue-600" /> Edit Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
              <Trash className="mr-2 h-4 w-4" /> Hapus Data
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-white sm:max-w-md overflow-y-auto w-full">
          <SheetHeader className="mb-6">
            <SheetTitle>{sheetMode === "detail" ? "Detail Pengunjung" : "Edit Data Pengunjung"}</SheetTitle>
            <SheetDescription>
              {sheetMode === "detail" ? "Informasi lengkap dari pengunjung." : "Ubah informasi pengunjung di bawah ini."}
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "detail" ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-lg font-semibold text-slate-800 truncate">{guest.name}</h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <Phone className="w-3 h-3 mr-1.5" /> {guest.whatsapp}
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 mb-1 sm:mb-0 flex items-center"><Hash className="w-4 h-4 mr-2 text-slate-400" /> ID Tiket</span>
                    <span className="text-sm font-medium text-slate-900 truncate max-w-[150px] sm:max-w-[200px]" title={guest.id}>{guest.id}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 mb-2 sm:mb-0 flex items-center"><AppWindow className="w-4 h-4 mr-2 text-slate-400" /> Layanan</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">{guest.service}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 mb-1 sm:mb-0 flex items-center"><UserCircle className="w-4 h-4 mr-2 text-slate-400" /> Profil</span>
                    <span className="text-sm font-medium text-slate-900">{guest.age || "-"} Tahun • {guest.gender === "PEREMPUAN" ? "Perempuan" : "Laki-Laki"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 mb-1 sm:mb-0 flex items-center"><GraduationCap className="w-4 h-4 mr-2 text-slate-400" /> Pendidikan</span>
                    <span className="text-sm font-medium text-slate-900">{guest.education ? guest.education.replace(/_/g, " ") : "-"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 mb-1 sm:mb-0 flex items-center"><Briefcase className="w-4 h-4 mr-2 text-slate-400" /> Pekerjaan</span>
                    <span className="text-sm font-medium text-slate-900">{guest.occupation ? guest.occupation.replace(/_/g, " ") : "-"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 mb-1 sm:mb-0 flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> Berkunjung</span>
                    <span className="text-sm font-medium text-slate-900">{guest.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6 pb-6">
              <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-lg p-3 text-sm flex items-start">
                <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                <p>Edit data diri pengunjung dengan valid.</p>
              </div>

              {/* Data Diri */}
              <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">Nama Lengkap</label>
                  <Input required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center">WhatsApp</label>
                    <Input required type="tel" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center">Usia</label>
                    <Input required type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="bg-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Gender</label>
                    {/* PERBAIKAN: val || "LAKI_LAKI" */}
                    <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val || "LAKI_LAKI" })}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LAKI_LAKI">Laki-Laki</SelectItem>
                        <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Pendidikan</label>
                    {/* PERBAIKAN: val || "S1" */}
                    <Select value={formData.education} onValueChange={(val) => setFormData({ ...formData, education: val || "S1" })}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SD">SD</SelectItem>
                        <SelectItem value="SMP">SMP</SelectItem>
                        <SelectItem value="SMA">SMA</SelectItem>
                        <SelectItem value="DIPLOMA">Diploma</SelectItem>
                        <SelectItem value="S1">S1</SelectItem>
                        <SelectItem value="S2_S3">S2/S3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Pekerjaan</label>
                  {/* PERBAIKAN: val || "PNS" */}
                  <Select value={formData.occupation} onValueChange={(val) => setFormData({ ...formData, occupation: val || "PNS" })}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PNS">ASN / TNI / Polri</SelectItem>
                      <SelectItem value="SWASTA">Swasta</SelectItem>
                      <SelectItem value="WIRASWASTA">Wiraswasta</SelectItem>
                      <SelectItem value="MAHASISWA">Pelajar / Mahasiswa</SelectItem>
                      <SelectItem value="LAINNYA">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Layanan */}
              <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">Layanan Tujuan</label>
                  {/* PERBAIKAN: val || "LAINNYA" */}
                  <Select 
                    value={formData.service} 
                    onValueChange={(val) => 
                      setFormData({ 
                        ...formData, 
                        service: val || "LAINNYA", 
                        customService: val !== "LAINNYA" ? "" : formData.customService 
                      })
                    }
                  >
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DOMAIN_SUBDOMAIN">Domain & Subdomain</SelectItem>
                      <SelectItem value="E_GOVERNMENT">E-Government</SelectItem>
                      <SelectItem value="COMMAND_CENTER">Command Center</SelectItem>
                      <SelectItem value="INFORMASI_KOMUNIKASI">Informasi & Komunikasi</SelectItem>
                      <SelectItem value="LAINNYA">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.service === "LAINNYA" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Detail Tujuan</label>
                    <Input required value={formData.customService} onChange={(e) => setFormData({ ...formData, customService: e.target.value })} className="bg-white" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export const columns: ColumnDef<Guest>[] = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "whatsapp", header: "WhatsApp" },
  { accessorKey: "service", header: "Layanan" },
  { accessorKey: "createdAt", header: "Tanggal" },
  { id: "actions", header: "Aksi", cell: ({ row }) => <ActionCell guest={row.original} /> },
];