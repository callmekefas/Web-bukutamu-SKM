'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  ClipboardCheck, 
  BarChart3, 
  ShieldCheck, 
  ChevronRight,
  Building2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* SECTION 1: HERO / BANNER HEADER 
        - flex flex-col justify-center memastikan konten tepat di tengah vertikal & sejajar dengan kanan
      */}
      <section className="lg:w-5/12 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-center rounded-b-[2.5rem] lg:rounded-b-none lg:min-h-screen relative overflow-hidden shadow-xl lg:shadow-none">
  
        {/* Pattern Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* Konten Hero - Menggunakan lg:-mt-10 untuk sedikit menaikkan posisi agar sejajar presisi dengan kanan */}
        <div className="relative z-10 space-y-6 sm:space-y-8 my-auto lg:my-0 lg:-mt-60">
          
          {/* Logo & Nama Instansi */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-25 sm:h-25 bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Image 
                src="/logo.png" 
                alt="Logo Instansi" 
                width={80} 
                height={80} 
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-cyan-100 leading-tight">
                Dinas Komunikasi, Informatika, Persandian, dan Statistika
              </h2>
              <p className="text-[11px] sm:text-xs text-blue-200 font-light mt-0.5">
                Provinsi Sulawesi Utara
              </p>
            </div>
          </div>

          {/* Judul Utama & Penjelasan */}
          <div className="space-y-3 pt-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Buku Tamu & <br className="hidden sm:inline" />
              <span className="text-cyan-200">Survei Kepuasan</span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-blue-100 leading-relaxed font-light max-w-lg">
              Platform digital resmi pelayanan tamu dan penilaian Indeks Kepuasan Masyarakat (IKM) sesuai standar PermenPANRB No. 14 Tahun 2017.
            </p>
          </div>

          {/* Badge Layanan Tambahan */}
          <div className="pt-2 hidden sm:block">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium text-cyan-100 border border-white/15">
              <Building2 className="w-4 h-4 text-cyan-300" />
              <span>Layanan Resepsionis Digital Diskominfo</span>
            </div>
          </div>

        </div>

        {/* Footer khusus Tampilan Desktop */}
        <div className="hidden lg:block absolute bottom-6 left-14 right-14 z-10 text-xs text-blue-200/80 border-t border-white/10 pt-3">
          © {new Date().getFullYear()} Diskominfo Provinsi Sulawesi Utara. All rights reserved.
        </div>
      </section>


      {/* 
        SECTION 2: MENU UTAMA 
        - HP: Berada di bawah banner dengan margin top positif (lega)
        - Desktop: Lebar 7/12 (58%), kontainer max-w-xl agar tombol pas & mantap
      */}
      <section className="lg:w-7/12 w-full p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-center lg:min-h-screen bg-slate-50 relative z-20">
        <div className="w-full max-w-xl space-y-6 sm:space-y-8">
          
          {/* Header Kanan */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wider uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Menu Layanan Digital
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-1">
              Pilih Layanan Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Silakan pilih salah satu menu di bawah ini untuk memulai pengisian.
            </p>
          </div>

          {/* List Menu Cards */}
          <div className="space-y-4">
            
            {/* 1. Isi Buku Tamu */}
            <Link 
              href="/guestbook" 
              className="group block bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-blue-500 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base sm:text-lg">
                      Isi Buku Tamu
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Catat data kedatangan & tujuan kunjungan Anda
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>

            {/* 2. Isi Survei SKM */}
            <Link 
              href="/survey" 
              className="group block bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-emerald-500 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                    <ClipboardCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-base sm:text-lg">
                      Survei Kepuasan (SKM)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Berikan penilaian pelayanan 9 unsur PermenPANRB
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>

            {/* 3. Statistik Layanan Publik */}
            <Link 
              href="/statistik"  // <--- INI YANG DIUBAH DARI /statistics MENJADI /statistik
              className="group block bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-amber-500 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base sm:text-lg">
                      Statistik Layanan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Lihat hasil nilai IKM masyarakat secara terbuka
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>

            {/* Separator */}
            <div className="pt-2 pb-1">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  Akses Petugas Internal
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </div>

            {/* 4. Portal Admin */}
            <Link 
              href="/login" 
              className="group block bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-sm hover:bg-slate-800 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center group-hover:text-white transition-colors shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">Portal Admin & Petugas</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Masuk untuk rekapitulasi data & laporan IKM</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-all shrink-0" />
              </div>
            </Link>

          </div>
        </div>

        {/* Footer HP */}
        <footer className="mt-10 pt-4 text-center text-xs text-slate-400 border-t border-slate-200/80 w-full lg:hidden">
          <p className="font-semibold text-slate-600">Diskominfo Provinsi Sulawesi Utara</p>
          <p className="text-[11px] mt-0.5">Sistem Pelayanan Tamu & SKM</p>
        </footer>
      </section>

    </div>
  );
}