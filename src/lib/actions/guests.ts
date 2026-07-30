"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Gender, Education, ServiceCategory } from "@prisma/client";

// 1. FUNGSI HAPUS (DELETE)
export async function deleteGuest(id: string) {
  try {
    await prisma.guestBook.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/dashboard/guests");
    
    return { success: true, message: "Data pengunjung berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    return { success: false, message: "Gagal menghapus data pengunjung." };
  }
}

// 2. FUNGSI EDIT (UPDATE) - Diperbarui agar mendukung data lengkap
export async function updateGuest(
  id: string,
  data: {
    fullName: string;
    whatsapp: string;
    age: string;
    gender: string;
    education: string;
    occupation: string;
    service: string;
    customService?: string;
  }
) {
  try {
    await prisma.guestBook.update({
      where: {
        id: id,
      },
      data: {
        fullName: data.fullName,
        whatsapp: data.whatsapp,
        age: parseInt(data.age), // Ubah string ke angka
        gender: data.gender as Gender,
        education: data.education as Education,
        occupation: data.occupation,
        service: data.service as ServiceCategory,
        customService: data.customService || null,
      },
    });

    revalidatePath("/dashboard/guests");
    
    return { success: true, message: "Data pengunjung berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui data." };
  }
}

// 3. FUNGSI TAMBAH (CREATE) - Sesuai dengan form di halaman depan
export async function createGuest(data: {
  name: string;
  phone: string;
  age: string;
  gender: string;
  education: string;
  occupation: string;
  serviceCategory: string;
  purpose?: string;
}) {
  try {
    await prisma.guestBook.create({
      data: {
        fullName: data.name,
        whatsapp: data.phone,
        age: parseInt(data.age), // Ubah string ke angka
        gender: data.gender as Gender,
        education: data.education as Education,
        occupation: data.occupation,
        service: data.serviceCategory as ServiceCategory,
        customService: data.purpose || null,
      },
    });

    revalidatePath("/dashboard/guests"); 
    revalidatePath("/dashboard");
    
    return { success: true, message: "Terima kasih! Data Anda berhasil dicatat." };
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    return { success: false, message: "Gagal menyimpan data ke database. Silakan coba lagi." };
  }
}