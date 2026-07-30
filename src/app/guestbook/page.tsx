'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Loader2,
  ClipboardCheck,
  Building2,
  Sparkles
} from 'lucide-react';
// IMPORT SERVER ACTION YANG SUDAH DIBUAT
import { createGuest } from '@/lib/actions/guests'; 

export default function GuestbookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Initial State disesuaikan persis dengan Enum di schema.prisma
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'LAKI_LAKI',
    education: 'S1',
    occupation: 'PNS',
    serviceCategory: 'E_GOVERNMENT',
    purpose: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Panggil Server Action langsung, tidak pakai fetch ke /api
      const result = await createGuest(formData);

      if (!result.success) {
        throw new Error(result.message || 'Gagal menyimpan data buku tamu');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        
        {/* Navigasi Kembali */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </Link>

        {submitted ? (
          /* ================= TAMPILAN KONFIRMASI SUKSES ================= */
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 text-center space-y-6">
            
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Terima Kasih!
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Data kunjungan Anda telah berhasil dicatat ke dalam sistem Buku Tamu Diskominfo Provinsi Sulawesi Utara.
              </p>
            </div>

            {/* Banner Call-to-Action Survei SKM */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl text-left space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800 tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Langkah Selanjutnya</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                Bantu kami meningkatkan kualitas pelayanan publik dengan mengisi <strong>Survei Kepuasan Masyarakat (SKM)</strong>. Hanya butuh waktu 1–2 menit!
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => router.push('/survey')}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
              >
                <ClipboardCheck className="w-5 h-5" />
                <span>Isi Survei SKM Sekarang</span>
              </button>

              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-xl transition-all text-sm"
              >
                Selesai & Kembali
              </button>
            </div>

          </div>
        ) : (
          /* ================= FORM INPUT BUKU TAMU ================= */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
            
            {/* Header Form */}
            <div className="border-b border-slate-100 pb-5 space-y-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Diskominfo Sulut</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Formulir Buku Tamu</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Silakan isi data diri Anda sebelum memasuki area pelayanan.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>

              {/* No WhatsApp & Usia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    No. WhatsApp / HP <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08123456789"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Usia (Tahun) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      name="age"
                      required
                      min="10"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Contoh: 28"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Gender & Pendidikan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  >
                    <option value="LAKI_LAKI">Laki-Laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pendidikan Terakhir <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  >
                    <option value="SD">SD / Sederajat</option>
                    <option value="SMP">SMP / Sederajat</option>
                    <option value="SMA">SMA / SMK / Sederajat</option>
                    <option value="DIPLOMA">Diploma (D1-D4)</option>
                    <option value="S1">Sarjana (S1)</option>
                    <option value="S2_S3">Pascasarjana (S2 / S3)</option>
                  </select>
                </div>
              </div>

              {/* Pekerjaan & Jenis Layanan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  >
                    <option value="PNS">ASN / PNS / TNI / Polri</option>
                    <option value="SWASTA">Pegawai Swasta</option>
                    <option value="WIRASWASTA">Wiraswasta / Usahawan</option>
                    <option value="MAHASISWA">Mahasiswa / Pelajar</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Jenis Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  >
                    <option value="DOMAIN_SUBDOMAIN">Pengajuan Domain & Subdomain</option>
                    <option value="E_GOVERNMENT">Layanan SPBE / E-Government</option>
                    <option value="COMMAND_CENTER">Layanan Command Center & IT</option>
                    <option value="INFORMASI_KOMUNIKASI">Informasi & Komunikasi Publik</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Maksud & Tujuan (Opsional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Maksud & Tujuan Kunjungan <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  name="purpose"
                  rows={3}
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Tuliskan tujuan singkat kunjungan Anda..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 resize-none"
                />
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Menyimpan Data...</span>
                  </>
                ) : (
                  <span>Simpan Data Buku Tamu</span>
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}