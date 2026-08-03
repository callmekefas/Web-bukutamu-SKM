import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ClipboardList, PlusCircle, CheckCircle2, XCircle, Trash2, Power } from "lucide-react";
import { toggleQuestionStatus, deleteQuestion } from "@/lib/actions/questions";

// Server Action untuk tombol Generate 9 Standar
async function generateDefaultQuestions() {
  "use server";
  
  const defaultQuestions = [
    { unsurCode: 'U1', question: 'Bagaimana pendapat Anda tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?', displayOrder: 1 },
    { unsurCode: 'U2', question: 'Bagaimana pemahaman Anda tentang kemudahan prosedur pelayanan di unit ini?', displayOrder: 2 },
    { unsurCode: 'U3', question: 'Bagaimana pendapat Anda tentang kecepatan waktu dalam memberikan pelayanan?', displayOrder: 3 },
    { unsurCode: 'U4', question: 'Bagaimana pendapat Anda tentang kewajaran biaya/tarif dalam pelayanan?', displayOrder: 4 },
    { unsurCode: 'U5', question: 'Bagaimana pendapat Anda tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?', displayOrder: 5 },
    { unsurCode: 'U6', question: 'Bagaimana pendapat Anda tentang kompetensi/kemampuan petugas dalam pelayanan?', displayOrder: 6 },
    { unsurCode: 'U7', question: 'Bagaimana pendapat Anda tentang perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?', displayOrder: 7 },
    { unsurCode: 'U8', question: 'Bagaimana pendapat Anda tentang kualitas sarana dan prasarana?', displayOrder: 8 },
    { unsurCode: 'U9', question: 'Bagaimana pendapat Anda tentang penanganan pengaduan pengguna layanan?', displayOrder: 9 },
  ];

  for (const q of defaultQuestions) {
    await prisma.surveyQuestion.upsert({
      where: { unsurCode: q.unsurCode },
      update: {},
      create: q,
    });
  }
  revalidatePath("/dashboard/surveys/questions");
}

export default async function SurveyQuestionsPage() {
  const questions = await prisma.surveyQuestion.findMany({
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Pertanyaan</h1>
          <p className="text-slate-500">Atur kuesioner Indeks Kepuasan Masyarakat (IKM).</p>
        </div>
        
        <div className="flex gap-2">
          {questions.length === 0 && (
            <form action={generateDefaultQuestions}>
              <button type="submit" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Generate 9 Standar
              </button>
            </form>
          )}
          
          <Link href="/dashboard/surveys/questions/create">
            <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <PlusCircle className="w-4 h-4" /> Tambah Manual
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {questions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <ClipboardList className="w-12 h-12 mb-3 text-slate-300" />
            <p>Belum ada pertanyaan survei.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">No</th>
                  <th className="px-6 py-4 w-20">Unsur</th>
                  <th className="px-6 py-4">Pertanyaan</th>
                  <th className="px-6 py-4 w-24 text-center">Status</th>
                  <th className="px-6 py-4 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-center font-medium text-slate-900">{q.displayOrder}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{q.unsurCode}</td>
                    <td className="px-6 py-4 text-slate-700">{q.question}</td>
                    <td className="px-6 py-4 text-center">
                      {q.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> AKTIF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                          <XCircle className="w-3 h-3" /> MATI
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol ON/OFF */}
                        <form action={toggleQuestionStatus.bind(null, q.id, q.isActive)}>
                          <button type="submit" title={q.isActive ? "Matikan Pertanyaan" : "Aktifkan Pertanyaan"} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors">
                            <Power className="w-4 h-4" />
                          </button>
                        </form>
                        
                        {/* Tombol Hapus */}
                        <form action={deleteQuestion.bind(null, q.id)}>
                          <button type="submit" title="Hapus Permanen" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}