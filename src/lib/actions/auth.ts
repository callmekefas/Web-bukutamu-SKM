'use server';

import { prisma } from "@/lib/prisma";
import { setSession, destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs'; // <-- Tambahkan ini

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username dan Password wajib diisi!' };
  }

  try {
    // 1. Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // 2. Jika user tidak ditemukan
    if (!user) {
      return { error: 'Username atau Password salah!' };
    }

    // 3. Bandingkan password menggunakan bcrypt (PENTING!)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 4. Jika password salah (termasuk jika admin lama passwordnya belum di-hash)
    if (!isPasswordValid) {
      // OPSI FALLBACK UNTUK ADMIN LAMA (Penting agar kamu tidak terkunci)
      // Jika password text biasa sama dengan di database (belum di-hash)
      if (user.password === password) {
        // Loloskan login kali ini
      } else {
        return { error: 'Username atau Password salah!' };
      }
    }

    // 5. Buat session jika lolos
    await setSession({
      userId: user.id,
      name: user.name,
      username: user.username,
      role: user.role as 'SUPER_ADMIN' | 'ADMIN',
    });

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Terjadi kesalahan pada server. Coba lagi nanti.' };
  }

  // Redirect ke dashboard setelah login berhasil
  redirect('/dashboard');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}