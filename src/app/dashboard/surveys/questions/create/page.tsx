import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { addQuestion } from "@/lib/actions/questions";
import { prisma } from "@/lib/prisma";

export default async function CreateQuestionPage() {
  const totalQuestions = await prisma.surveyQuestion.count();
  const nextCode = `Q${totalQuestions + 1}`;
  const nextOrder = totalQuestions + 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/surveys/questions" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah Pertanyaan Baru</h1>
          <p className="text-slate-500 text-sm">Kode dan urutan pertanyaan akan diatur secara otomatis oleh sistem.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form action={addQuestion} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Kode Pertanyaan</label>
              <input 
                type="text" 
                value={nextCode} 
                disabled 
                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-sm font-bold cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400">Dibuat otomatis oleh sistem.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nomor Urut Tampil</label>
              {/* Input dibuat disabled/readonly agar otomatis berurutan */}
              <input 
                type="number" 
                value={nextOrder} 
                disabled 
                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-sm font-bold cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400">Urutan otomatis menyesuaikan.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Isi Pertanyaan <span className="text-red-500">*</span></label>
            <textarea 
              name="question" 
              required 
              rows={3}
              placeholder="Contoh: Bagaimana pendapat Anda tentang fasilitas disabilitas?" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Kategori Unsur (Keranjang Rapor SKM) <span className="text-red-500">*</span></label>
            <select 
              name="category" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="" disabled selected>-- Pilih Kategori Pelaporan --</option>
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
            <p className="text-xs text-slate-500">Nilai dari pertanyaan ini akan digabungkan ke kategori laporan yang dipilih.</p>
          </div>

          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors mt-2 shadow-sm"
          >
            <Save className="w-5 h-5" /> Simpan Pertanyaan
          </button>
        </form>
      </div>
    </div>
  );
}