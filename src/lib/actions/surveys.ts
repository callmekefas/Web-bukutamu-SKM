"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Mengambil pertanyaan yang aktif untuk ditampilkan di form
export async function getActiveQuestions() {
  try {
    const questions = await prisma.surveyQuestion.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return { success: true, data: questions };
  } catch (error) {
    console.error("Gagal mengambil pertanyaan:", error);
    return { success: false, data: [] };
  }
}

// 2. Menyimpan jawaban survei dari tamu
export async function submitSurvey(data: {
  whatsapp: string;
  feedback: string;
  answers: { questionId: string; score: number }[];
}) {
  console.log("=== 1. DATA DITERIMA DARI FORM ===", data);
  
  try {
    const guest = await prisma.guestBook.findFirst({
      where: { whatsapp: data.whatsapp },
      orderBy: { createdAt: 'desc' },
    });

    console.log("=== 2. TAMU DITEMUKAN ===", guest ? guest.fullName : "TIDAK ADA");

    if (!guest) {
      return { 
        success: false, 
        message: "Nomor WhatsApp tidak ditemukan. Pastikan Anda sudah mengisi Buku Tamu terlebih dahulu." 
      };
    }

    const response = await prisma.surveyResponse.create({
      data: {
        guestBookId: guest.id,
        feedback: data.feedback || null,
        answers: {
          create: data.answers.map((ans) => ({
            questionId: ans.questionId,
            score: ans.score,
          })),
        },
      },
    });

    console.log("=== 3. SUKSES SIMPAN KE DATABASE ===", response.id);

    revalidatePath("/dashboard/reports");
    revalidatePath("/survey");

    return { success: true, message: "Survei berhasil disimpan!" };
  } catch (error) {
    console.error("=== XXX ERROR SAAT MENYIMPAN XXX ===", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan survei." };
  }
}