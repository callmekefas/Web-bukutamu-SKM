import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import QuestionClient from "./question-client"; // Memanggil tabel Client yang sudah kita buat

export default async function SurveyQuestionsPage() {
  // 1. Ambil data pertanyaan dari database (berjalan di Server)
  const questions = await prisma.surveyQuestion.findMany({
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div className="space-y-6">
      
      {/* ========================================== */}
      {/* HEADER HALAMAN */}
      {/* ========================================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Pertanyaan</h1>
          <p className="text-slate-500">Atur kuesioner Indeks Kepuasan Masyarakat (IKM).</p>
        </div>
        
        <div className="flex gap-2">
          {/* Tombol Generate 9 Standar sudah dipindah dan diurus otomatis di dalam QuestionClient */}
          
          <Link href="/dashboard/surveys/questions/create">
            <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <PlusCircle className="w-4 h-4" /> Tambah Manual
            </button>
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* RENDER TABEL & MODAL EDIT (Client Side) */}
      {/* ========================================== */}
      <QuestionClient initialData={questions} />
      
    </div>
  );
}