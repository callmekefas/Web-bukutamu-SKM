// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai seeding data awal...');

  // Hapus data lama jika ada
  await prisma.surveyAnswer.deleteMany();
  await prisma.surveyResponse.deleteMany();
  await prisma.surveyQuestion.deleteMany();
  await prisma.guestBook.deleteMany();
  await prisma.user.deleteMany();

  // 1. Buat Akun Super Admin & Admin
  await prisma.user.createMany({
    data: [
      {
        name: 'Super Administrator',
        username: 'superadmin',
        password: 'admin123', // Nanti bisa ditambahkan hashing password
        role: 'SUPER_ADMIN',
      },
      {
        name: 'Petugas Resepsionis',
        username: 'admin',
        password: 'admin123',
        role: 'ADMIN',
      },
    ],
  });

  // 2. Buat 9 Pertanyaan Survei PermenPANRB
  await prisma.surveyQuestion.createMany({
    data: [
      {
        unsurCode: 'U1',
        question: 'Bagaimana kesesuaian persyaratan pelayanan dengan jenis pelayanannya?',
      },
      {
        unsurCode: 'U2',
        question: 'Bagaimana kemudahan prosedur pelayanan di instansi ini?',
      },
      {
        unsurCode: 'U3',
        question: 'Bagaimana kecepatan waktu dalam mendapatkan pelayanan?',
      },
      {
        unsurCode: 'U4',
        question: 'Bagaimana kejelasan dan kejelasan biaya/tarif pelayanan (bebas pungli)?',
      },
      {
        unsurCode: 'U5',
        question: 'Bagaimana kesesuaian antara hasil pelayanan yang diterima dengan ketentuan?',
      },
      {
        unsurCode: 'U6',
        question: 'Bagaimana kemampuan dan keterampilan petugas dalam memberikan pelayanan?',
      },
      {
        unsurCode: 'U7',
        question: 'Bagaimana sikap dan perilaku petugas terkait kesopanan dan keramahan?',
      },
      {
        unsurCode: 'U8',
        question: 'Bagaimana kualitas penanganan pengaduan, saran, dan masukan pengguna?',
      },
      {
        unsurCode: 'U9',
        question: 'Bagaimana kualitas dan kenyamanan sarana serta prasarana pelayanan?',
      },
    ],
  });

  console.log('✅ Seeding selesai! Super Admin, Admin, dan 9 Pertanyaan PermenPANRB berhasil dibuat.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });