// src/lib/actions/auth.ts
'use';
'use server';

import { prisma } from "@/lib/prisma";
import { setSession, destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username dan Password wajib diisi!' };
  }

  try {
    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return { error: 'Username atau Password salah!' };
    }

    // Buat session
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