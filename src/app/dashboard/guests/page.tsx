import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/guests/data-table";
import { columns } from "@/components/guests/guest-columns";
import { GuestToolbar } from "@/components/guests/guest-toolbar";
import { prisma } from "@/lib/prisma";
import { Prisma, ServiceCategory } from "@prisma/client";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  
  const currentPage = typeof params.page === "string" ? Number(params.page) : 1;
  const search = typeof params.search === "string" ? params.search : "";
  const serviceFilter = typeof params.service === "string" ? params.service : null;
  
  const limit = 10; 
  const skip = (currentPage - 1) * limit;

  // Membuat kondisi query (where) secara dinamis
  const whereCondition: Prisma.GuestBookWhereInput = {};

  // 1. Jika ada input pencarian
  if (search) {
    whereCondition.OR = [
      { fullName: { contains: search } },
      { whatsapp: { contains: search } },
    ];
  }

  // 2. Jika ada filter layanan
  if (serviceFilter) {
    whereCondition.service = serviceFilter as ServiceCategory;
  }

  // Fetch data ke database
  const [guestsData, totalGuests] = await Promise.all([
    prisma.guestBook.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.guestBook.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(totalGuests / limit);

  // MAPPING DATA: Sudah ditambahkan age, gender, education, dan occupation
  const formattedData = guestsData.map((guest) => ({
    id: guest.id,
    name: guest.fullName,
    whatsapp: guest.whatsapp,
    age: guest.age,
    gender: guest.gender,
    education: guest.education,
    occupation: guest.occupation,
    service:
      guest.service === "LAINNYA" && guest.customService
        ? guest.customService
        : guest.service.replace(/_/g, " "),
    rawService: guest.service, 
    customService: guest.customService, 
    createdAt: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(guest.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Guest Management</h1>
        <p className="text-muted-foreground">Kelola seluruh data buku tamu.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengunjung</CardTitle>
        </CardHeader>
        <CardContent>
          <GuestToolbar /> 
          <DataTable 
            columns={columns} 
            data={formattedData} 
            totalPages={totalPages} 
          />
        </CardContent>
      </Card>
    </div>
  );
}