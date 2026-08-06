"use server";

import { prisma } from "@/lib/prisma";

export async function getExportData(startDateStr: string, endDateStr: string) {
  try {
    const startDate = new Date(startDateStr);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);

    // Hanya ambil Data Tamu (GuestBook)
    const guestBooks = await prisma.guestBook.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // FORMATTING: Merapikan data untuk Excel
    const formattedGuests = guestBooks.map((g) => ({
      "Tanggal Kunjungan": g.createdAt.toLocaleDateString("id-ID"),
      "Waktu": g.createdAt.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
      "Nama Lengkap": g.fullName,
      "No. WhatsApp": g.whatsapp,
      "Umur": g.age,
      "Jenis Kelamin": g.gender,
      "Pendidikan": g.education,
      "Pekerjaan": g.occupation,
      "Layanan Dituju": g.service === "LAINNYA" ? g.customService : g.service,
    }));

    return { 
      success: true, 
      data: { guests: formattedGuests } 
    };

  } catch (error) {
    console.error("Gagal mengambil data laporan:", error);
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}