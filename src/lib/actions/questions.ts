"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. FUNGSI EDIT PERTANYAAN (Kode asli milikmu)
export async function updateQuestion(
  id: string,
  data: { question: string; isActive: boolean; displayOrder: number }
) {
  try {
    await prisma.surveyQuestion.update({
      where: { id },
      data: {
        question: data.question,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
      },
    });

    revalidatePath("/dashboard/surveys/questions");
    revalidatePath("/survey"); // Refresh halaman depan agar langsung berubah
    return { success: true, message: "Pertanyaan berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal memperbarui pertanyaan:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui." };
  }
}

// 2. FUNGSI AUTO-GENERATE (Kode asli milikmu)
export async function seedDefaultQuestions() {
  const defaults = [
    { code: 'U1', text: 'Bagaimana pendapat Anda tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?' },
    { code: 'U2', text: 'Bagaimana pemahaman Anda tentang kemudahan prosedur pelayanan di unit ini?' },
    { code: 'U3', text: 'Bagaimana pendapat Anda tentang kecepatan waktu dalam memberikan pelayanan?' },
    { code: 'U4', text: 'Bagaimana pendapat Anda tentang kewajaran biaya/tarif dalam pelayanan?' },
    { code: 'U5', text: 'Bagaimana pendapat Anda tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?' },
    { code: 'U6', text: 'Bagaimana pendapat Anda tentang kompetensi/kemampuan petugas dalam pelayanan?' },
    { code: 'U7', text: 'Bagaimana pendapat Anda tentang perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?' },
    { code: 'U8', text: 'Bagaimana pendapat Anda tentang kualitas sarana dan prasarana?' },
    { code: 'U9', text: 'Bagaimana pendapat Anda tentang penanganan pengaduan pengguna layanan?' },
  ];

  try {
    for (let i = 0; i < defaults.length; i++) {
      await prisma.surveyQuestion.upsert({
        where: { unsurCode: defaults[i].code },
        update: {},
        create: {
          unsurCode: defaults[i].code,
          question: defaults[i].text,
          displayOrder: i + 1,
          isActive: true,
        },
      });
    }
    revalidatePath("/dashboard/surveys/questions");
    return { success: true, message: "Pertanyaan standar berhasil di-generate!" };
  } catch (error) {
    console.error("Gagal generate pertanyaan:", error);
    return { success: false, message: "Gagal men-generate pertanyaan." };
  }
}

// ==========================================
// TAMBAHAN BARU UNTUK FITUR CRUD
// ==========================================

// 3. FUNGSI TAMBAH PERTANYAAN BARU
export async function addQuestion(formData: FormData) {
  const unsurCode = formData.get("unsurCode") as string;
  const question = formData.get("question") as string;
  const displayOrder = parseInt(formData.get("displayOrder") as string);

  try {
    await prisma.surveyQuestion.create({
      data: { unsurCode, question, displayOrder, isActive: true },
    });
  } catch (error) {
    console.error("Gagal menambah pertanyaan:", error);
  }

  revalidatePath("/dashboard/surveys/questions");
  revalidatePath("/survey");
  redirect("/dashboard/surveys/questions"); // Kembali ke halaman tabel
}

// 4. FUNGSI TOGGLE STATUS (ON/OFF)
export async function toggleQuestionStatus(id: string, currentStatus: boolean) {
  await prisma.surveyQuestion.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  
  revalidatePath("/dashboard/surveys/questions");
  revalidatePath("/survey");
}

// 5. FUNGSI HAPUS PERTANYAAN
export async function deleteQuestion(id: string) {
  await prisma.surveyQuestion.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard/surveys/questions");
  revalidatePath("/survey");
}