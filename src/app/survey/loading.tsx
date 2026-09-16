import { Loader2, ClipboardCheck } from "lucide-react";

export default function LoadingSurvey() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="flex flex-col items-center gap-4 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm max-w-sm w-full text-center">
        
        <div className="relative flex items-center justify-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <ClipboardCheck className="w-4 h-4 text-blue-600 absolute" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900">
            Memuat Kuesioner
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Menyiapkan daftar pertanyaan survei Indeks Kepuasan Masyarakat...
          </p>
        </div>

      </div>
    </div>
  );
}