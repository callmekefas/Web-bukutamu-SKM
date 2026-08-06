"use client";

import { useState } from "react";
import { Download, Calendar, Loader2, X } from "lucide-react";
import * as XLSX from "xlsx";
// Pastikan file ini sudah kamu buat dari instruksiku sebelumnya
import { getExportData } from "@/lib/actions/reports"; 

export default function ExportGuestButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Pilih tanggal awal dan akhir!");
    
    setIsLoading(true);

    try {
      const result = await getExportData(startDate, endDate);

      if (!result.success || !result.data) {
        alert("Gagal menarik data dari server.");
        setIsLoading(false);
        return;
      }

      const { guests } = result.data;

      if (guests.length === 0) {
        alert("Tidak ada data kunjungan tamu pada rentang tanggal tersebut.");
        setIsLoading(false);
        return;
      }

      const wb = XLSX.utils.book_new();
      const wsGuests = XLSX.utils.json_to_sheet(guests);
      
      const colWidths = [
        { wch: 18 }, { wch: 10 }, { wch: 30 }, { wch: 18 }, 
        { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 25 }
      ];
      wsGuests["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, wsGuests, "Daftar Tamu");
      XLSX.writeFile(wb, `Rekap_Tamu_Diskominfo_${startDate}_sd_${endDate}.xlsx`);
      
      setIsOpen(false); // Tutup popup setelah berhasil

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membuat file Excel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Pemicu di Tabel */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
      >
        <Download className="w-4 h-4" /> Export
      </button>

      {/* Popup Modal Pilih Tanggal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" /> Export Data Tamu
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExport} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Tanggal Mulai
                </label>
                <input 
                  type="date" 
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Tanggal Akhir
                </label>
                <input 
                  type="date" 
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isLoading ? "Mengunduh..." : "Download Excel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}