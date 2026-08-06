"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SKMCategory } from "@prisma/client"; // Import tipe kategori dari Prisma

// 1. FUNGSI EDIT PERTANYAAN
export async function updateQuestion(
  id: string,
  data: { question: string; isActive: boolean; displayOrder: number; category: SKMCategory }
) {
  try {
    await prisma.surveyQuestion.update({
      where: { id },
      data: {
        question: data.question,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
        category: data.category,
      },
    });

    revalidatePath("/dashboard/surveys/questions");
    revalidatePath("/survey");
    return { success: true, message: "Pertanyaan berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal memperbarui pertanyaan:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui." };
  }
}

// 2. FUNGSI AUTO-GENERATE (Menggunakan format Q1-Q9)
export async function seedDefaultQuestions() {
  const defaults = [
    { code: 'Q1', text: 'Bagaimana pendapat Anda tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?', category: 'U1_PERSYARATAN' },
    { code: 'Q2', text: 'Bagaimana pemahaman Anda tentang kemudahan prosedur pelayanan di unit ini?', category: 'U2_PROSEDUR' },
    { code: 'Q3', text: 'Bagaimana pendapat Anda tentang kecepatan waktu dalam memberikan pelayanan?', category: 'U3_WAKTU_PELAYANAN' },
    { code: 'Q4', text: 'Bagaimana pendapat Anda tentang kewajaran biaya/tarif dalam pelayanan?', category: 'U4_BIAYA_TARIF' },
    { code: 'Q5', text: 'Bagaimana pendapat Anda tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?', category: 'U5_PRODUK_SPESIFIKASI' },
    { code: 'Q6', text: 'Bagaimana pendapat Anda tentang kompetensi/kemampuan petugas dalam pelayanan?', category: 'U6_KOMPETENSI_PELAKSANA' },
    { code: 'Q7', text: 'Bagaimana pendapat Anda tentang perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?', category: 'U7_PERILAKU_PELAKSANA' },
    { code: 'Q8', text: 'Bagaimana pendapat Anda tentang kualitas sarana dan prasarana?', category: 'U8_PENANGANAN_PENGADUAN' },
    { code: 'Q9', text: 'Bagaimana pendapat Anda tentang penanganan pengaduan pengguna layanan?', category: 'U9_SARANA_PRASARANA' },
  ];

  try {
    for (let i = 0; i < defaults.length; i++) {
      await prisma.surveyQuestion.upsert({
        where: { unsurCode: defaults[i].code },
        update: {
          category: defaults[i].category as SKMCategory,
        },
        create: {
          unsurCode: defaults[i].code,
          question: defaults[i].text,
          displayOrder: i + 1,
          isActive: true,
          category: defaults[i].category as SKMCategory,
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
// CRUD TAMBAHAN
// ==========================================

// 3. FUNGSI TAMBAH PERTANYAAN BARU 
export async function addQuestion(formData: FormData) {
  const question = formData.get("question") as string;
  const category = formData.get("category") as SKMCategory;

  // Hitung total pertanyaan untuk otomatis menentukan kode (Q) dan urutan tampil
  const totalQuestions = await prisma.surveyQuestion.count();
  const unsurCode = `Q${totalQuestions + 1}`;
  const displayOrder = totalQuestions + 1; // Otomatis berurutan

  try {
    await prisma.surveyQuestion.create({
      data: { 
        unsurCode, 
        question, 
        displayOrder, 
        isActive: true, 
        category 
      },
    });
  } catch (error) {
    console.error("Gagal menambah pertanyaan:", error);
  }

  revalidatePath("/dashboard/surveys/questions");
  revalidatePath("/survey");
  redirect("/dashboard/surveys/questions");
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