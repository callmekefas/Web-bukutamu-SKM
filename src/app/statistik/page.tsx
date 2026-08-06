import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BarChart3, Users, Award, Activity } from "lucide-react";
import StatsClientChart from "./stats-client";

export const revalidate = 0;

export default async function StatistikPage() {
  const totalRespondents = await prisma.surveyResponse.count();

  const surveyAnswers = await prisma.surveyAnswer.findMany({
    include: {
      question: true,
    },
  });

  // Kamus definisi & penjelasan tujuan per kategori
  const categoryDetails: Record<string, { label: string; code: string; description: string }> = {
    U1_PERSYARATAN: { 
      code: "U1", 
      label: "Persyaratan", 
      description: "Tujuannya untuk mengevaluasi apakah dokumen atau syarat administrasi yang diminta kepada warga masuk akal, tidak berlebihan, dan relevan dengan jenis layanan yang diberikan." 
    },
    U2_PROSEDUR: { 
      code: "U2", 
      label: "Prosedur", 
      description: "Tujuannya untuk menilai apakah alur tahapan pelayanan (birokrasi) ringkas, jelas, dan tidak berbelit-belit bagi masyarakat awam." 
    },
    U3_WAKTU_PELAYANAN: { 
      code: "U3", 
      label: "Waktu Pelayanan", 
      description: "Tujuannya untuk mengukur efisiensi kinerja instansi dalam memastikan masyarakat tidak menunggu terlalu lama dan layanan selesai sesuai target waktu (SOP) yang dijanjikan." 
    },
    U4_BIAYA_TARIF: { 
      code: "U4", 
      label: "Biaya / Tarif", 
      description: "Tujuannya untuk menjamin transparansi biaya pelayanan publik dan memberikan ruang pengawasan agar instansi tetap 100% bersih dari praktik pungutan liar (pungli) atau biaya terselubung." 
    },
    U5_PRODUK_SPESIFIKASI: { 
      code: "U5", 
      label: "Produk Spesifikasi (Hasil)", 
      description: "Tujuannya untuk memverifikasi bahwa produk akhir atau layanan yang diterima warga kualitasnya benar-benar sesuai dengan ketentuan atau janji layanan di awal." 
    },
    U6_KOMPETENSI_PELAKSANA: { 
      code: "U6", 
      label: "Kompetensi Pelaksana", 
      description: "Tujuannya untuk menilai keahlian, pengalaman, dan pemahaman teknis petugas sehingga mereka mampu memberikan solusi yang tepat dan tidak kebingungan saat melayani masyarakat." 
    },
    U7_PERILAKU_PELAKSANA: { 
      code: "U7", 
      label: "Perilaku Pelaksana", 
      description: "Tujuannya untuk mengukur aspek empati layanan, seperti etika, kesopanan, dan keramahan pegawai saat berinteraksi langsung dengan warga." 
    },
    U8_PENANGANAN_PENGADUAN: { 
      code: "U8", 
      label: "Penanganan Pengaduan", 
      description: "Tujuannya untuk mengevaluasi tingkat kepedulian dan kecepatan instansi dalam merespons, menindaklanjuti, dan memberikan jalan keluar ketika ada warga yang komplain." 
    },
    U9_SARANA_PRASARANA: { 
      code: "U9", 
      label: "Sarana dan Prasarana", 
      description: "Tujuannya untuk menilai kenyamanan dan kelayakan fasilitas fisik instansi, seperti ruang tunggu yang sejuk, kebersihan toilet, ketersediaan parkir, hingga kelengkapan fasilitas untuk penyandang disabilitas." 
    },
  };

  const categoryMap: Record<string, { totalScore: number; count: number }> = {
    U1_PERSYARATAN: { totalScore: 0, count: 0 },
    U2_PROSEDUR: { totalScore: 0, count: 0 },
    U3_WAKTU_PELAYANAN: { totalScore: 0, count: 0 },
    U4_BIAYA_TARIF: { totalScore: 0, count: 0 },
    U5_PRODUK_SPESIFIKASI: { totalScore: 0, count: 0 },
    U6_KOMPETENSI_PELAKSANA: { totalScore: 0, count: 0 },
    U7_PERILAKU_PELAKSANA: { totalScore: 0, count: 0 },
    U8_PENANGANAN_PENGADUAN: { totalScore: 0, count: 0 },
    U9_SARANA_PRASARANA: { totalScore: 0, count: 0 },
  };

  surveyAnswers.forEach((ans) => {
    const cat = ans.question?.category;
    if (cat && categoryMap[cat]) {
      categoryMap[cat].totalScore += ans.score;
      categoryMap[cat].count += 1;
    }
  });

  let grandTotalAverage = 0;
  let activeCategoriesCount = 0;

  const detailedStats = Object.keys(categoryDetails).map((key) => {
    const info = categoryDetails[key];
    const stat = categoryMap[key];
    const avg = stat.count > 0 ? stat.totalScore / stat.count : 0;
    const konversiNum = avg * 25;

    if (stat.count > 0) {
      grandTotalAverage += avg;
      activeCategoriesCount += 1;
    }

    let barColor = "bg-slate-200";
    if (konversiNum >= 88.31) barColor = "bg-emerald-500";
    else if (konversiNum >= 76.61) barColor = "bg-blue-500";
    else if (konversiNum >= 65.00) barColor = "bg-amber-500";
    else if (konversiNum > 0) barColor = "bg-red-500";

    return {
      code: info.code,
      label: info.label,
      description: info.description,
      nrr: avg.toFixed(2),
      konversi: konversiNum.toFixed(2),
      numericKonversi: konversiNum,
      barColor,
    };
  });

  const finalIKMScore = activeCategoriesCount > 0 ? Number((grandTotalAverage / activeCategoriesCount).toFixed(2)) : 0;
  const ikmScore = (finalIKMScore * 25).toFixed(2);
  const numericScore = parseFloat(ikmScore);

  let mutu = "-";
  let predikat = "Belum Ada Data";
  let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
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

  // Data khusus untuk dikirim ke komponen grafik Recharts
  const chartData = detailedStats.map((item) => ({
    category: `${item.code} - ${item.label}`,
    nilai: parseFloat(item.nrr),
  }));

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
            <p className="text-slate-500 text-sm font-medium mt-1">Transparansi Indeks Kepuasan Masyarakat (IKM) Berbasis 9 Unsur Kategori</p>
          </div>
        </div>

        {/* --- KARTU UTAMA IKM --- */}
        <div className={`relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl ${glowColor} transition-shadow duration-500 border border-slate-800`}>
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
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Skor IKM Akhir</span>
            </div>
            
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

        {/* --- TAMBAHAN FITUR: GRAFIK DIAGRAM BATANG --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Grafik Nilai Rata-Rata Per Unsur</h2>
              <p className="text-xs text-slate-500">Visualisasi skor perbandingan ke-9 kategori keranjang pelaporan</p>
            </div>
          </div>
          <StatsClientChart data={chartData} />
        </div>

        {/* --- BAGIAN RINCIAN BERDASARKAN KATEGORI (DENGAN PENJELASAN TUJUAN) --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-extrabold text-slate-900">Rincian Per Kategori Unsur (U1 - U9)</h2>
          </div>
          
          <div className="grid gap-4">
            {detailedStats.map((stat, index) => (
              <div 
                key={index} 
                className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-6 text-9xl font-black text-slate-50 opacity-50 pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500">
                  {stat.code.replace('U', '')}
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6">
                    
                    <div className="flex-1 space-y-2">
                      <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg tracking-wider">
                        {stat.code}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {stat.label}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed pr-4 pt-1">
                        {stat.description}
                      </p>
                    </div>
                    
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

                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${stat.barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${stat.numericKonversi}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}