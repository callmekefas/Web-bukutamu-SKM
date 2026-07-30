import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import QuestionClient from "./question-client";

export default async function SurveyQuestionsPage() {
  // Mengambil data pertanyaan dari database, diurutkan berdasarkan 'displayOrder'
  const questions = await prisma.surveyQuestion.findMany({
    orderBy: {
      displayOrder: 'asc',
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manajemen Pertanyaan SKM</h1>
        <p className="text-slate-500">Kelola dan edit daftar pertanyaan untuk Survei Kepuasan Masyarakat.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle>Daftar Pertanyaan</CardTitle>
          <CardDescription>Pertanyaan ini akan ditampilkan secara langsung di form pengisian survei tamu.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          
          {/* Memanggil UI Interaktif yang kita buat di langkah 2 */}
          <QuestionClient initialData={questions} />

        </CardContent>
      </Card>
    </div>
  );
}