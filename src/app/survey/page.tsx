'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ClipboardCheck, Phone, MessageSquare, 
  CheckCircle2, Loader2, Star 
} from 'lucide-react';
import { getActiveQuestions, submitSurvey } from '@/lib/actions/surveys';

// Tipe data pertanyaan dari database
type Question = {
  id: string;
  unsurCode: string;
  question: string;
};

export default function SurveyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [whatsapp, setWhatsapp] = useState('');
  const [feedback, setFeedback] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Fetch pertanyaan dari database saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchQuestions = async () => {
      const result = await getActiveQuestions();
      if (result.success) {
        setQuestions(result.data);
      }
      setIsLoadingQuestions(false);
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi apakah semua pertanyaan aktif sudah dijawab
    if (Object.keys(answers).length < questions.length) {
      setErrorMsg('Mohon jawab seluruh pertanyaan survei sebelum menyimpan.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Ubah format jawaban agar sesuai dengan yang diminta Server Action
      const formattedAnswers = Object.entries(answers).map(([qId, score]) => ({
        questionId: qId,
        score: score,
      }));

      // PANGGIL DATABASE!
      const result = await submitSurvey({
        whatsapp,
        feedback,
        answers: formattedAnswers,
      });

      if (!result.success) {
        throw new Error(result.message);
      }
      
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-emerald-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium">Memuat kuesioner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-3xl mt-4 sm:mt-8">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </Link>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12 animate-in zoom-in duration-500" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Survei Berhasil Dikirim!
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Terima kasih atas penilaian dan masukan yang Anda berikan. Partisipasi Anda sangat berarti untuk peningkatan kualitas pelayanan kami.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/">
                <button className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
                  Selesai & Kembali ke Beranda
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
            
            <div className="border-b border-slate-100 pb-6 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-2">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Indeks Kepuasan Masyarakat</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Survei Pelayanan</h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Bantu kami mengevaluasi kinerja layanan Diskominfo. Silakan berikan penilaian dengan skala 1 (Buruk) hingga 4 (Sangat Baik).
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl font-medium flex items-start gap-3">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <label className="block text-sm font-bold text-slate-800">
                  Nomor WhatsApp yang Anda gunakan saat mengisi Buku Tamu <span className="text-red-500">*</span>
                </label>
                <div className="relative max-w-md">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 shadow-sm"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  * Nomor ini digunakan agar survei terhubung dengan riwayat kunjungan Anda hari ini.
                </p>
              </div>

              <div className="space-y-6">
                {questions.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Kuesioner belum tersedia.</p>
                ) : (
                  questions.map((q, index) => (
                    <div key={q.id} className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl hover:border-emerald-200 transition-colors">
                      <h3 className="text-sm font-semibold text-slate-800 mb-4 leading-relaxed">
                        <span className="text-emerald-600 mr-1">{index + 1}.</span> {q.question}
                      </h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { score: 1, label: 'Buruk' },
                          { score: 2, label: 'Cukup' },
                          { score: 3, label: 'Baik' },
                          { score: 4, label: 'Sangat Baik' },
                        ].map((opt) => (
                          <label 
                            key={opt.score}
                            className={`
                              relative flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all
                              ${answers[q.id] === opt.score 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200 hover:bg-white'}
                            `}
                          >
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt.score}
                              className="sr-only"
                              onChange={() => handleAnswerChange(q.id, opt.score)}
                            />
                            <span className="text-lg font-bold mb-1">{opt.score}</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-center">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Kritik & Saran <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda atau berikan masukan untuk peningkatan pelayanan kami..."
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 resize-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || questions.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses Survei...</span>
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    <span>Kirim Penilaian Survei</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}
        
        <p className="text-center text-[11px] text-slate-400 mt-8 font-medium pb-8">
          &copy; {new Date().getFullYear()} Diskominfo Provinsi Sulawesi Utara.
        </p>

      </div>
    </div>
  );
}