"use client";

import { useState } from "react";
import { Edit, EyeOff, CheckCircle, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { updateQuestion, seedDefaultQuestions, deleteQuestion } from "@/lib/actions/questions";
import { SKMCategory } from "@prisma/client";

type Question = {
  id: string;
  unsurCode: string;
  question: string;
  displayOrder: number;
  isActive: boolean;
  category: string; 
};

export default function QuestionClient({ initialData }: { initialData: Question[] }) {
  const [questions, setQuestions] = useState(initialData);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State untuk loading hapus
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [editForm, setEditForm] = useState<Question | null>(null);

  // Fungsi memanggil Auto-Generate
  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedDefaultQuestions();
    alert(result.message);
    if (result.success) window.location.reload();
    setIsSeeding(false);
  };

  const handleEditClick = (q: Question) => {
    setEditForm(q);
    setIsSheetOpen(true);
  };

  // Fungsi Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setIsUpdating(true);
    const result = await updateQuestion(editForm.id, {
      question: editForm.question,
      displayOrder: editForm.displayOrder,
      isActive: editForm.isActive,
      category: editForm.category as SKMCategory,
    });
    
    setIsUpdating(false);
    alert(result.message);
    
    if (result.success) {
      setQuestions((prev) => prev.map((q) => q.id === editForm.id ? editForm : q));
      setIsSheetOpen(false);
    }
  };

  // 1. TAMBAHAN: Fungsi Hapus yang dipanggil dari dalam Sheet
  const handleDelete = async () => {
    if (!editForm) return;
    
    // Konfirmasi sebelum menghapus
    if (!confirm(`Apakah Anda yakin ingin menghapus permanen pertanyaan ${editForm.unsurCode}?`)) {
      return;
    }

    setIsDeleting(true);
    await deleteQuestion(editForm.id);
    
    // Hapus dari state lokal agar UI langsung update tanpa refresh
    setQuestions((prev) => prev.filter((q) => q.id !== editForm.id));
    
    setIsDeleting(false);
    setIsSheetOpen(false);
    alert("Pertanyaan berhasil dihapus!");
  };

  return (
    <div className="space-y-6">
      
      {/* Tampilan Jika Database Kosong */}
      {questions.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-4">
          <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Database Pertanyaan Kosong</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Klik tombol di bawah ini untuk otomatis memasukkan 9 Pertanyaan Standar PermenPANRB No.14 Thn 2017 ke dalam database.
          </p>
          <Button onClick={handleSeed} disabled={isSeeding} className="bg-emerald-600 hover:bg-emerald-700 mt-2">
            {isSeeding ? "Memproses..." : "Generate 9 Pertanyaan Standar"}
          </Button>
        </div>
      ) : (
        /* Tampilan Tabel Pertanyaan */
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Kategori SKM</th>
                  <th className="px-6 py-4">Teks Pertanyaan</th>
                  <th className="px-6 py-4 text-center">Urutan</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{q.unsurCode}</td>
                    
                    <td className="px-6 py-4 text-xs font-semibold text-blue-600">
                      {q.category ? q.category.replace("_", " ") : "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-700 min-w-[300px]">{q.question}</td>
                    <td className="px-6 py-4 text-center font-medium">{q.displayOrder}</td>
                    <td className="px-6 py-4 text-center">
                      {q.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 mr-1" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <EyeOff className="w-3 h-3 mr-1" /> Disembunyikan
                        </span>
                      )}
                    </td>
                    
                    {/* 2. TABEL LEBIH BERSIH: Hanya ada tombol Edit */}
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(q)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sheet Modal Untuk Form Edit */}
      {/* Sheet Modal Untuk Form Edit */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-white sm:max-w-lg w-full overflow-y-auto flex flex-col p-6 sm:p-8">
          <SheetHeader className="mb-6 space-y-1 text-left">
            <SheetTitle className="text-xl font-bold text-slate-900">
              Edit Pertanyaan <span className="text-blue-600 font-mono">({editForm?.unsurCode})</span>
            </SheetTitle>
            <SheetDescription className="text-slate-500 text-sm">
              Ubah teks pertanyaan, atur kategori pelaporan, atau kelola status aktifnya.
            </SheetDescription>
          </SheetHeader>
          
          {editForm && (
            <form onSubmit={handleUpdate} className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Teks Pertanyaan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Teks Pertanyaan</label>
                <textarea
                  required
                  rows={4}
                  value={editForm.question}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800 bg-slate-50/50 resize-none"
                />
              </div>

              {/* Kategori Unsur */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Kategori Unsur (Keranjang Rapor SKM)</label>
                <select 
                  required
                  value={editForm.category || ""}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-800 font-medium"
                >
                  <option value="" disabled>-- Pilih Kategori --</option>
                  <option value="U1_PERSYARATAN">U1 - Persyaratan</option>
                  <option value="U2_PROSEDUR">U2 - Prosedur</option>
                  <option value="U3_WAKTU_PELAYANAN">U3 - Waktu Pelayanan</option>
                  <option value="U4_BIAYA_TARIF">U4 - Biaya/Tarif</option>
                  <option value="U5_PRODUK_SPESIFIKASI">U5 - Produk Spesifikasi (Hasil)</option>
                  <option value="U6_KOMPETENSI_PELAKSANA">U6 - Kompetensi Pelaksana</option>
                  <option value="U7_PERILAKU_PELAKSANA">U7 - Perilaku Pelaksana</option>
                  <option value="U8_PENANGANAN_PENGADUAN">U8 - Penanganan Pengaduan</option>
                  <option value="U9_SARANA_PRASARANA">U9 - Sarana dan Prasarana</option>
                </select>
              </div>

              {/* Status Aktif (Urutan Tampil dihapus, otomatis disesuaikan dengan kode Q) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Status Aktif</label>
                <select 
                  value={editForm.isActive ? "true" : "false"}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-800 font-medium"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Disembunyikan</option>
                </select>
              </div>

              </div>

              {/* Tombol Aksi di Bawah */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                
                {/* Tombol Hapus */}
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleDelete}
                  disabled={isDeleting || isUpdating}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-4"
                >
                  {isDeleting ? "Menghapus..." : <><Trash2 className="w-4 h-4 mr-2" /> Hapus</>}
                </Button>

                {/* Tombol Batal & Simpan */}
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSheetOpen(false)}
                    className="rounded-xl px-4 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isUpdating || isDeleting} 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 shadow-sm"
                  >
                    {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
                
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}