"use server";

import { prisma } from "@/lib/prisma";

export async function getIKMStats() {
  try {
    // 1. Hitung total responden berdasarkan jumlah baris surveyResponse yang masuk
    const totalRespondents = await prisma.surveyResponse.count();

    // 2. Ambil semua jawaban survei beserta kategorinya dari pertanyaan
    const surveyAnswers = await prisma.surveyAnswer.findMany({
      include: {
        question: true, // Untuk mendapatkan info 'category' (misal: U1_PERSYARATAN)
      }
    });

    // 3. Kelompokkan dan hitung rata-rata berdasarkan kategori SKM (U1 - U9)
    const categoryMap: Record<string, { totalScore: number; count: number; label: string }> = {
      U1_PERSYARATAN: { totalScore: 0, count: 0, label: "U1 - Persyaratan" },
      U2_PROSEDUR: { totalScore: 0, count: 0, label: "U2 - Prosedur" },
      U3_WAKTU_PELAYANAN: { totalScore: 0, count: 0, label: "U3 - Waktu Pelayanan" },
      U4_BIAYA_TARIF: { totalScore: 0, count: 0, label: "U4 - Biaya/Tarif" },
      U5_PRODUK_SPESIFIKASI: { totalScore: 0, count: 0, label: "U5 - Produk Spesifikasi" },
      U6_KOMPETENSI_PELAKSANA: { totalScore: 0, count: 0, label: "U6 - Kompetensi Pelaksana" },
      U7_PERILAKU_PELAKSANA: { totalScore: 0, count: 0, label: "U7 - Perilaku Pelaksana" },
      U8_PENANGANAN_PENGADUAN: { totalScore: 0, count: 0, label: "U8 - Penanganan Pengaduan" },
      U9_SARANA_PRASARANA: { totalScore: 0, count: 0, label: "U9 - Sarana & Prasarana" },
    };

    surveyAnswers.forEach((ans) => {
      const cat = ans.question?.category;
      if (cat && categoryMap[cat]) {
        categoryMap[cat].totalScore += ans.score;
        categoryMap[cat].count += 1;
      }
    });

    // 4. Format data untuk Grafik Recharts & hitung nilai akhir IKM
    let grandTotalAverage = 0;
    let activeCategoriesCount = 0;

    const chartData = Object.keys(categoryMap).map((key) => {
      const item = categoryMap[key];
      const avg = item.count > 0 ? Number((item.totalScore / item.count).toFixed(2)) : 0;
      
      if (item.count > 0) {
        grandTotalAverage += avg;
        activeCategoriesCount += 1;
      }

      return {
        category: item.label,
        nilai: avg,
        // Konversi ke skala 100 standar PermenPANRB (Nilai Rata-rata * 25)
        nilaiKonversi: Number((avg * 25).toFixed(2)), 
      };
    });

    // Nilai IKM Akhir skala 1-4 (Gabungan rata-rata seluruh unsur)
    const finalIKMScore = activeCategoriesCount > 0 ? Number((grandTotalAverage / activeCategoriesCount).toFixed(2)) : 0;
    // Nilai IKM konversi skala 100
    const finalIKMScale100 = Number((finalIKMScore * 25).toFixed(2));

    // Menentukan Mutu Pelayanan (A / B / C / D) berdasarkan PermenPANRB No. 14 Tahun 2017
    let mutu = "C";
    if (finalIKMScale100 >= 88.31) mutu = "A (Sangat Baik)";
    else if (finalIKMScale100 >= 76.61) mutu = "B (Baik)";
    else if (finalIKMScale100 >= 65.00) mutu = "C (Kurang Baik)";
    else mutu = "D (Tidak Baik)";

    return {
      success: true,
      totalRespondents,
      finalIKMScore,
      finalIKMScale100,
      mutu,
      chartData,
    };
  } catch (error) {
    console.error("Gagal mengambil statistik IKM:", error);
    return { success: false, message: "Gagal memuat data statistik." };
  }
}