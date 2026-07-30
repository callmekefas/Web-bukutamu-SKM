// src/lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthSession {
  userId: string;
  name: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

// Set session ke cookie (HTTP-Only agar aman dari XSS)
export async function setSession(user: AuthSession) {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // Sesi berlaku 1 hari
    path: '/',
  });
}

// Ambil data session dari cookie
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  if (!session) return null;

  try {
    return JSON.parse(session) as AuthSession;
  } catch {
    return null;
  }
}

// Hapus session (Logout)
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

// Helper untuk proteksi halaman dashboard
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}