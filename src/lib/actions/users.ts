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

// 2. Hapus User
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