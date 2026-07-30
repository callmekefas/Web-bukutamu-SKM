import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Cek apakah ada cookie sesi login milik admin
  // (Pastikan nama cookie ini sama dengan yang kamu buat saat proses login)
  const session = request.cookies.get('admin_session')?.value;

  // 2. Jika pengguna mencoba masuk ke halaman /dashboard atau sub-halamannya
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    
    // 3. Jika tidak ada sesi (belum login), lempar paksa ke halaman /login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika sudah login atau mengakses halaman publik, izinkan lewat
  return NextResponse.next();
}

// 4. Tentukan rute mana saja yang akan diawasi oleh middleware ini
export const config = {
  matcher: [
    /*
     * Berlaku untuk semua rute yang diawali dengan /dashboard
     * Contoh: /dashboard, /dashboard/guests, /dashboard/reports
     */
    '/dashboard/:path*',
  ],
};