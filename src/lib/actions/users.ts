"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

// 1. Tambah User Baru
export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const rawPassword = formData.get("password") as string;
  const role = formData.get("role") as "ADMIN" | "SUPER_ADMIN";

  try {
    // Enkripsi password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role,
      },
    });
  } catch (error) {
    console.error("Gagal membuat user:", error);
    // Jika username sudah ada, Prisma akan melempar error
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

// 2. Edit / Perbarui User (Fungsi Baru yang Ditambahkan)
export async function updateUser(id: string, data: { name?: string; username?: string; password?: string }) {
  try {
    // Definisi tipe data yang spesifik agar terhindar dari error 'any'
    const updateData: { name?: string; username?: string; password?: string } = {};
    
    if (data.name) updateData.name = data.name;
    if (data.username) updateData.username = data.username;
    
    // Jika password diisi (tidak kosong), enkripsi ulang dengan bcrypt
    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/users");
    return { success: true, message: "Akun berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal memperbarui user:", error);
    return { success: false, message: "Gagal memperbarui akun. Username mungkin sudah digunakan." };
  }
}

// 3. Hapus User
export async function deleteUser(id: string) {
  try {
    const session = await getSession();

    // CEGAT: Jika ID yang mau dihapus adalah ID dia sendiri, batalkan!
    if (session?.userId === id) {
      console.error("Ditolak: Super Admin tidak boleh menghapus akunnya sendiri.");
      return; 
    }

    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Gagal menghapus user:", error);
  }
}