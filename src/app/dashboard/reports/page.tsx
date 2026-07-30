import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Star, MessageSquare, Calendar, UserCircle } from "lucide-react";

export const dynamic = "force-dynamic";

// Server Component: Langsung fetch data dari database
export default async function ReportsPage() {
  // 1. Mengambil semua data survei beserta data tamu dan jawabannya
  const surveyResponses = await prisma.surveyResponse.findMany({
    include: {
      guestBook: true,
      answers: {
        include: {
          question: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalRespondents = surveyResponses.length;

  // 2. Menghitung Rata-rata Skor IKM (Indeks Kepuasan Masyarakat)
  let totalScore = 0;
  let totalAnswersCount = 0;
  let responsesWithFeedback = 0;

  surveyResponses.forEach((response) => {
    if (response.feedback) responsesWithFeedback++;
    
    response.answers.forEach((ans) => {
      totalScore += ans.score;
      totalAnswersCount++;
    });
  });

  // Skala 1 - 4
  const averageIkm = totalAnswersCount > 0 ? (totalScore / totalAnswersCount).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Laporan Hasil Survei</h1>
        <p className="text-slate-500">Ringkasan Indeks Kepuasan Masyarakat (IKM) dan masukan dari pengunjung.</p>
      </div>

      {/* --- KARTU STATISTIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Responden</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalRespondents} <span className="text-sm font-normal text-slate-500">Orang</span></h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Rata-rata IKM (Skala 4)</p>
              <h3 className="text-3xl font-bold text-emerald-600">{averageIkm} <span className="text-sm font-normal text-slate-500">/ 4.00</span></h3>
            </div>
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Masukan/Saran</p>
              <h3 className="text-3xl font-bold text-slate-900">{responsesWithFeedback} <span className="text-sm font-normal text-slate-500">Ulasan</span></h3>
            </div>
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- TABEL DETAIL HASIL SURVEI --- */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle>Riwayat Pengisian Survei</CardTitle>
          <CardDescription>Daftar lengkap hasil penilaian dan saran dari pengunjung terbaru.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {surveyResponses.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              Belum ada data survei yang masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Pengunjung</th>
                    <th className="px-6 py-4">Layanan</th>
                    <th className="px-6 py-4 text-center">Skor Rata-rata</th>
                    <th className="px-6 py-4">Kritik & Saran</th>
                    <th className="px-6 py-4 text-right">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {surveyResponses.map((res) => {
                    // Hitung rata-rata skor pengunjung ini saja
                    const myTotalScore = res.answers.reduce((acc, curr) => acc + curr.score, 0);
                    const myAvg = res.answers.length > 0 ? (myTotalScore / res.answers.length).toFixed(2) : "0";
                    
                    return (
                      <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <UserCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{res.guestBook.fullName}</p>
                              <p className="text-xs text-slate-500">{res.guestBook.whatsapp}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {res.guestBook.service.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-emerald-600 flex items-center justify-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-emerald-500" /> {myAvg}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {res.feedback ? (
                            <p className="text-sm text-slate-700 italic line-clamp-2 max-w-xs" title={res.feedback}>
                              &quot;{res.feedback}&quot;
                            </p>
                          ) : (
                            <span className="text-slate-400 text-xs">- Tidak ada saran -</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500 text-xs">
                          <div className="flex items-center justify-end gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }).format(res.createdAt)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}