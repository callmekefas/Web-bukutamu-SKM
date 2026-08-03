import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BarChart3, Users, Award, ListChecks, Activity } from "lucide-react";

export const revalidate = 0;

export default async function StatistikPage() {
  // 1. Ambil data
  const totalRespondents = await prisma.surveyResponse.count();
  const aggregate = await prisma.surveyAnswer.aggregate({
    _avg: { score: true },
  });

  const averageScore = aggregate._avg.score || 0;
  const ikmScore = (averageScore * 25).toFixed(2);
  const numericScore = parseFloat(ikmScore);

  // 2. Penentuan Mutu dan Kinerja
  let mutu = "-";
  let predikat = "Belum Ada Data";
  let badgeColor = "bg-slate-800 text-slate-300 border-slate-700"; // Default dark
  let glowColor = "shadow-slate-500/20";

  if (totalRespondents > 0) {
    if (numericScore >= 88.31) {
      mutu = "A";
      predikat = "Sangat Baik";
      badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      glowColor = "shadow-emerald-500/20";
    } else if (numericScore >= 76.61) {
      mutu = "B";
      predikat = "Baik";
      badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      glowColor = "shadow-blue-500/20";
    } else if (numericScore >= 65.00) {
      mutu = "C";
      predikat = "Kurang Baik";
      badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      glowColor = "shadow-amber-500/20";
    } else {
      mutu = "D";
      predikat = "Tidak Baik";
      badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
      glowColor = "shadow-red-500/20";
    }
  }

  // 3. Ambil Rincian per Unsur
  const questions = await prisma.surveyQuestion.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  const answerStats = await prisma.surveyAnswer.groupBy({
    by: ['questionId'],
    _avg: { score: true },
  });

  const detailedStats = questions.map((q) => {
    const stat = answerStats.find((a) => a.questionId === q.id);
    const avg = stat?._avg.score || 0;
    const konversiNum = avg * 25;
    
    // Tentukan warna progress bar masing-masing unsur
    let barColor = "bg-slate-200";
    if (konversiNum >= 88.31) barColor = "bg-emerald-500";
    else if (konversiNum >= 76.61) barColor = "bg-blue-500";
    else if (konversiNum >= 65.00) barColor = "bg-amber-500";
    else if (konversiNum > 0) barColor = "bg-red-500";

    return {
      unsurCode: q.unsurCode,
      question: q.question,
      nrr: avg.toFixed(2),
      konversi: konversiNum.toFixed(2),
      numericKonversi: konversiNum,
      barColor,
    };
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* --- HEADER NAV --- */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group p-3 bg-white shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl transition-all duration-300">
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-blue-600 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Statistik Layanan Publik</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Transparansi Indeks Kepuasan Masyarakat (IKM)</p>
          </div>
        </div>

        {/* --- BAGIAN 1: TOTAL IKM (PREMIUM DARK CARD) --- */}
        <div className={`relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl ${glowColor} transition-shadow duration-500 border border-slate-800`}>
          {/* Efek Latar Belakang Abstrak */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <div className="w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 opacity-10">
            <div className="w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
          </div>
          <BarChart3 className="absolute -bottom-6 -right-6 w-64 h-64 text-white opacity-5 rotate-12" />

          <div className="relative z-10 p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Skor IKM Saat Ini</span>
            </div>
            
            {/* Teks Gradasi untuk Angka */}
            <div className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 tracking-tighter drop-shadow-sm">
              {ikmScore}
            </div>

            <div className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl border ${badgeColor} backdrop-blur-md font-bold text-base sm:text-lg shadow-inner`}>
              <Award className="w-5 h-5" />
              Mutu {mutu} — {predikat}
            </div>
          </div>
        </div>

        {/* --- WIDGET INFO TAMBAHAN --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Responden</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{totalRespondents} <span className="text-sm font-medium text-slate-400">Pengunjung</span></p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Skala Penilaian</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">100.00 <span className="text-sm font-medium text-slate-400">Maksimal</span></p>
            </div>
          </div>
        </div>

        {/* --- BAGIAN 2: RINCIAN PER UNSUR (DENGAN PROGRESS BAR) --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-extrabold text-slate-900">Rincian Per Unsur</h2>
          </div>
          
          <div className="grid gap-4">
            {detailedStats.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm text-slate-500 font-medium">
                Belum ada data survei yang masuk.
              </div>
            ) : (
              detailedStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Dekorasi nomor transparan di background */}
                  <div className="absolute -right-4 -bottom-6 text-9xl font-black text-slate-50 opacity-50 pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500">
                    {stat.unsurCode.replace('U', '')}
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-5">
                      
                      {/* Judul Pertanyaan */}
                      <div className="flex-1 space-y-2">
                        <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg tracking-wider">
                          {stat.unsurCode}
                        </span>
                        <p className="text-base font-semibold text-slate-800 leading-relaxed pr-4">
                          {stat.question}
                        </p>
                      </div>
                      
                      {/* Nilai Angka */}
                      <div className="flex items-end gap-6 shrink-0">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Skor NRR</p>
                          <p className="text-xl font-bold text-slate-700">{stat.nrr} <span className="text-sm font-normal text-slate-400">/ 4</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1">Konversi</p>
                          <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.konversi}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stat.barColor} transition-all duration-1000 ease-out`}
                        style={{ width: `${stat.numericKonversi}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}