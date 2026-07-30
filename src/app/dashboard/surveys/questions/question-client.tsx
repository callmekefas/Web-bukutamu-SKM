"use client";

import { useState } from "react";
import { Edit, Eye, EyeOff, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { updateQuestion, seedDefaultQuestions } from "@/lib/actions/questions";

type Question = {
  id: string;
  unsurCode: string;
  question: string;
  displayOrder: number;
  isActive: boolean;
};

export default function QuestionClient({ initialData }: { initialData: Question[] }) {
  const [questions, setQuestions] = useState(initialData);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [editForm, setEditForm] = useState<Question | null>(null);

  // Fungsi memanggil Auto-Generate
  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedDefaultQuestions();
    alert(result.message);
    if (result.success) window.location.reload(); // Refresh untuk melihat hasil
    setIsSeeding(false);
  };

  const handleEditClick = (q: Question) => {
    setEditForm(q);
    setIsSheetOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setIsUpdating(true);
    const result = await updateQuestion(editForm.id, {
      question: editForm.question,
      displayOrder: editForm.displayOrder,
      isActive: editForm.isActive,
    });
    
    setIsUpdating(false);
    alert(result.message);
    
    if (result.success) {
      // Update UI seketika tanpa harus refresh
      setQuestions((prev) => prev.map((q) => q.id === editForm.id ? editForm : q));
      setIsSheetOpen(false);
    }
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
                  <th className="px-6 py-4">Unsur</th>
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
                    <td className="px-6 py-4 text-slate-700 min-w-[300px]">{q.question}</td>
                    <td className="px-6 py-4 text-center font-medium">{q.displayOrder}</td>
                    <td className="px-6 py-4 text-center">
                      {q.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 mr-1" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                          <EyeOff className="w-3 h-3 mr-1" /> Disembunyikan
                        </span>
                      )}
                    </td>
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-white sm:max-w-md w-full">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit Pertanyaan ({editForm?.unsurCode})</SheetTitle>
            <SheetDescription>Ubah teks pertanyaan agar lebih mudah dipahami oleh masyarakat.</SheetDescription>
          </SheetHeader>
          
          {editForm && (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Teks Pertanyaan</label>
                <textarea
                  required
                  rows={4}
                  value={editForm.question}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Urutan Tampil</label>
                  <Input 
                    type="number" 
                    required 
                    value={editForm.displayOrder} 
                    onChange={(e) => setEditForm({ ...editForm, displayOrder: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status Aktif</label>
                  <select 
                    value={editForm.isActive ? "true" : "false"}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="true">Aktif (Ditampilkan)</option>
                    <option value="false">Sembunyikan</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700">
                  {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}