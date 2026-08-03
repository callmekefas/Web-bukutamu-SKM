import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { createUser } from "@/lib/actions/users";
import { requireSuperAdmin } from "@/lib/auth";

export default async function CreateUserPage() {
  // KUNCI HALAMAN: Hanya Super Admin yang boleh masuk!
  await requireSuperAdmin();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah Akun Baru</h1>
          <p className="text-slate-500 text-sm">Buat akun Admin atau Super Admin baru untuk mengakses sistem.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <form action={createUser} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Contoh: Budi Santoso" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="username" 
                required 
                placeholder="Contoh: budi123" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                name="password" 
                required 
                placeholder="Minimal 6 karakter" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hak Akses (Role) <span className="text-red-500">*</span></label>
            <select 
              name="role" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="ADMIN">Admin (Hanya Kelola Data)</option>
              <option value="SUPER_ADMIN">Super Admin (Akses Penuh)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <UserPlus className="w-5 h-5" /> Daftarkan Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}