import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestBookId, feedback, answers } = body; 
    // answers berupa: { questionId: string, score: number }[]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { message: 'Mohon isi penilaian survei minimal pada unsur yang tersedia.' },
        { status: 400 }
      );
    }

    // 1. Validasi guestBookId: Jika string kosong ("") atau undefined, ubah ke null
    const validGuestBookId = guestBookId && guestBookId.trim() !== '' ? guestBookId : null;

    // Jika guestBookId diberikan, pastikan record-nya benar-benar ada di database
    if (validGuestBookId) {
      const existingGuest = await prisma.guestBook.findUnique({
        where: { id: validGuestBookId },
      });
      if (!existingGuest) {
        return NextResponse.json(
          { message: 'Data Buku Tamu tidak ditemukan/tidak valid.' },
          { status: 400 }
        );
      }
    }

    // 2. Ambil semua pertanyaan yang ada di database untuk pemetaan / pencocokan ID
    const dbQuestions = await prisma.surveyQuestion.findMany();

    if (dbQuestions.length === 0) {
      return NextResponse.json(
        { message: 'Pertanyaan survei belum tersedia di database. Jalankan db seed terlebih dahulu.' },
        { status: 400 }
      );
    }

    // Petakan jawaban agar menggunakan questionId resmi dari database jika yang dikirim berupa unsurCode (seperti U1, U2) atau ID indeks
    const preparedAnswers = answers.map((item: { questionId: string; score: number }) => {
      // Cari pertanyaan berdasarkan ID asli atau unsurCode/indeks
      const matchedQuestion = dbQuestions.find(
        (q: (typeof dbQuestions)[number]) => q.id === item.questionId || q.unsurCode === item.questionId
      );

      // Jika tidak cocok langsung, ambil pertanyaan berdasarkan urutan indeks jika dikirim angka
      const targetQuestion = matchedQuestion || dbQuestions[Number(item.questionId) - 1] || dbQuestions[0];

      return {
        questionId: targetQuestion.id,
        score: Number(item.score),
      };
    });

    // 3. Simpan SurveyResponse beserta relasi answers-nya
    const newResponse = await prisma.surveyResponse.create({
      data: {
        guestBookId: validGuestBookId,
        feedback: feedback || null,
        answers: {
          create: preparedAnswers,
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Terima kasih! Survei Kepuasan Masyarakat berhasil disimpan.',
        data: newResponse,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error saving survey:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan pada server saat menyimpan survei.';

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}