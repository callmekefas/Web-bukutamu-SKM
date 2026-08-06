// src/app/login/page.tsx
'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { loginAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-6 pb-0">
          
          {/* --- Bagian Logo & Nama Instansi (Menyamping) --- */}
          <div className="flex items-center gap-4">
            {/* Box Logo dengan sedikit rounding */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm p-2">
              <Image
                src="/logo.png" 
                alt="Logo Pemprov Sulut"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>
            
            {/* Teks Instansi rata kiri */}
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

            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? 'Memproses...' : 'Masuk ke Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}