// src/app/login/page.tsx
'use client';

import { useActionState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { loginAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  
  // Referensi ini berguna jika kita ingin mereset reCAPTCHA 
  // (misalnya ketika password salah, pengguna harus mencentang ulang)
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-6 pb-0">

          {/* --- Bagian Logo & Nama Instansi --- */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm p-2">
              <Image
                src="/logo.png" 
                alt="Logo Pemprov Sulut"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>
            
            <div className="flex flex-col text-left">
              <h2 className="text-[10px] sm:text-[13px] font-semibold text-slate-800 leading-snug tracking-wide">
                DINAS KOMUNIKASI,INFORMATIKA, PERSANDIAN,DAN STATISTIKA
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Provinsi Sulawesi Utara
              </p>
            </div>
          </div>
          {/* ----------------------------------- */}

          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Login Admin</CardTitle>
            <CardDescription>
              Masukkan username dan password untuk Login
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Masukkan username"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* --- FITUR 2: Widget reCAPTCHA --- */}
            <div className="flex justify-center pt-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                // Ganti value ini dengan Site Key milikmu atau ambil dari file .env
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? 'Memproses...' : 'Masuk ke Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}