import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { addQuestion } from "@/lib/actions/questions";

export default function CreateQuestionPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/surveys/questions" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah Pertanyaan Baru</h1>
          <p className="text-slate-500 text-sm">Tambahkan unsur kuesioner baru ke dalam formulir survei tamu.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form action={addQuestion} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Kode Unsur <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="unsurCode" 
                required 
                placeholder="Contoh: U10" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nomor Urut Tampil <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="displayOrder" 
                required 
                placeholder="Contoh: 10" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Isi Pertanyaan <span className="text-red-500">*</span></label>
            <textarea 
              name="question" 
              required 
              rows={3}
              placeholder="Contoh: Bagaimana pendapat Anda tentang kebersihan ruang tunggu?" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" /> Simpan Pertanyaan
          </button>
        </form>
      </div>
    </div>
  );
}