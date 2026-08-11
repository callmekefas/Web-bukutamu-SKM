"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
// Pastikan path import ini sesuai dengan lokasi file action kamu (users.ts)
import { updateUser } from "@/lib/actions/users";

export default function EditUserButton({ user }: { user: { id: string; name: string; username: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const result = await updateUser(user.id, {
      name,
      username,
      password: password.trim() !== "" ? password : undefined,
    });

    setIsUpdating(false);
    alert(result.message);

    if (result.success) {
      setIsOpen(false);
      setPassword(""); // Kosongkan kembali password
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-colors mr-2"
        title="Edit Akun"
      >
        <Edit className="w-4 h-4" />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="bg-white sm:max-w-md w-full p-6 sm:p-8 flex flex-col">
          <SheetHeader className="space-y-1 text-left mb-6">
            <SheetTitle className="text-xl font-bold text-slate-900">Edit Akun</SheetTitle>
            <SheetDescription className="text-slate-500 text-sm">
              Perbarui nama, username, atau kata sandi milik <b>{user.name}</b>.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Lengkap</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Username</label>
              <Input required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Password Baru <span className="font-normal text-slate-400 lowercase">(Opsional)</span>
              </label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Biarkan kosong jika tidak diubah" 
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-2 mt-auto">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">
                Batal
              </Button>
              <Button type="submit" disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}