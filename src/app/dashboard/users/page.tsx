import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserPlus, ShieldAlert, Trash2, ShieldCheck } from "lucide-react";
import { deleteUser } from "@/lib/actions/users";
import { requireSuperAdmin } from "@/lib/auth";

export default async function UsersPage() {
  // 1. KUNCI HALAMAN: Panggil satpamnya di sini!
  await requireSuperAdmin();

  // 2. Ambil semua data user, urutkan agar Super Admin di atas
  const users = await prisma.user.findMany({
    orderBy: { role: 'desc' }, 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500">Kelola akun Admin dan Super Admin sistem.</p>
        </div>
        
        <Link href="/dashboard/users/create">
          <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <UserPlus className="w-4 h-4" /> Tambah Akun
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4 text-center">Role / Hak Akses</th>
                <th className="px-6 py-4 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">@{user.username}</td>
                  <td className="px-6 py-4 text-center">
                    {user.role === "SUPER_ADMIN" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" /> SUPER ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> ADMIN
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <form action={deleteUser.bind(null, user.id)}>
                        <button 
                          type="submit" 
                          title="Hapus Akun" 
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}