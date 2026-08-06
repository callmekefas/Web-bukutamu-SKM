import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Trophy, Clock } from "lucide-react";

export const dynamic = "force-dynamic"; // Memastikan data selalu update setiap kali halaman direfresh

export default async function DashboardOverview() {
  // 1. Ambil Total Semua Pengunjung
  const totalGuests = await prisma.guestBook.count();

  // 2. Ambil Pengunjung Hari Ini
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const guestsToday = await prisma.guestBook.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  // 3. Cari Layanan Paling Banyak Dikunjungi (Terpopuler)
  const popularServiceQuery = await prisma.guestBook.groupBy({
    by: ["service"],
    _count: {
      service: true,
    },
    orderBy: {
      _count: {
        service: "desc",
      },
    },
    take: 1,
  });

  const topService = 
    popularServiceQuery.length > 0 
      ? popularServiceQuery[0].service.replace(/_/g, " ") 
      : "Belum ada data";

  // 4. Ambil 5 Tamu Terakhir
  const recentGuests = await prisma.guestBook.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 mt-2">Ringkasan data pengunjung.</p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Kartu Total Pengunjung */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Pengunjung
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalGuests}</div>
            <p className="text-xs text-slate-500 mt-1">Seluruh data tercatat</p>
          </CardContent>
        </Card>

        {/* Kartu Pengunjung Hari Ini */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pengunjung Hari Ini
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{guestsToday}</div>
            <p className="text-xs text-slate-500 mt-1">Sejak pergantian hari</p>
          </CardContent>
        </Card>

        {/* Kartu Layanan Terpopuler */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Layanan Terpopuler
            </CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-800 truncate" title={topService}>
              {topService}
            </div>
            <p className="text-xs text-slate-500 mt-1">Paling banyak dituju</p>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Tamu Terbaru */}
      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1 shadow-sm border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-500" />
              5 Pengunjung Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentGuests.length > 0 ? (
                recentGuests.map((guest) => (
                  <div key={guest.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-semibold text-sm">
                        {guest.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-800">
                        {guest.fullName}
                      </p>
                      <p className="text-sm text-slate-500">
                        Menuju layanan: {guest.service === "LAINNYA" ? guest.customService : guest.service.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-slate-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                      }).format(guest.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Belum ada data pengunjung.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}