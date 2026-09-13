import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* ==========================================================================
   Pengajuan Kolaborasi Riset — PROTOTIPE ANTARMUKA SAJA.
   Disimpan di memori React (bukan localStorage) sehingga konsisten selama
   sesi berjalan, tapi kembali ke data awal saat halaman dimuat ulang.
   ========================================================================== */

export const STATUS_USULAN = {
  diajukan: { id: 'diajukan', label: 'Diajukan', badge: 'bg-warning-bg text-warning', ikon: 'clock' },
  berjalan: { id: 'berjalan', label: 'Berjalan', badge: 'bg-success-bg text-success', ikon: 'checkCircle' },
  ditolak: { id: 'ditolak', label: 'Ditolak', badge: 'bg-danger-bg text-danger', ikon: 'alert' }
};

/* Beberapa contoh pengajuan agar dashboard mitra tidak kosong saat dicoba. */
const SEED = [
  {
    id: 'USL-2025-317', status: 'berjalan', createdAt: '2025-09-01T08:00:00.000Z', catatan: '',
    mitraEmail: 'mitra@undiksha.ac.id', namaKetua: 'Prof. Dr. I Gede Suarnaya, M.T.', institusi: 'UNDIKSHA',
    email: 'mitra@undiksha.ac.id', telp: '081139001234',
    judul: 'Optimalisasi Panen Air Hujan untuk Ketahanan Air Desa Wisata Pemuteran',
    skema: 'insentif', bidang: 'kelautan', kecamatan: 'gerokgak', dana: '145.000.000',
    sasaranRpjmd: 'Pengelolaan sumber daya kelautan dan pesisir',
    urgensi: 'Desa wisata Pemuteran menghadapi krisis air bersih pada musim kemarau panjang.',
    luaran: 'Purwarupa penampung air hujan komunal\nPolicy brief tata kelola air desa wisata',
    mitra: ['pokdarwis'], mitraNama: 'Pokdarwis Pemuteran', manfaat: '80 pelaku wisata',
    files: [{ name: 'proposal-poc-pemuteran.pdf', size: 812345 }]
  },
  {
    id: 'USL-2025-284', status: 'ditolak', createdAt: '2025-08-14T08:00:00.000Z',
    catatan: 'Dokumen RAB belum sesuai standar pagu BRIDA dan berkas mitra pendukung belum lengkap. Silakan lengkapi dan ajukan kembali pada Batch II.',
    mitraEmail: 'mitra@undiksha.ac.id', namaKetua: 'Prof. Dr. I Gede Suarnaya, M.T.', institusi: 'UNDIKSHA',
    email: 'mitra@undiksha.ac.id', telp: '081139001234',
    judul: 'Kajian Kelayakan Wisata Edukasi Subak Digital di Kecamatan Sukasada',
    skema: 'mandiri', bidang: 'pariwisata', kecamatan: 'sukasada', dana: '24.000.000',
    sasaranRpjmd: 'Pariwisata berkelanjutan dan penguatan ekonomi kreatif',
    urgensi: 'Minim atraksi edukatif berbasis teknologi di kawasan subak Sukasada.',
    luaran: 'Modul wisata edukasi digital',
    mitra: [], mitraNama: '', manfaat: '',
    files: [{ name: 'proposal-wisata-edukasi.pdf', size: 431200 }]
  }
];

const SubmissionsCtx = createContext(null);

export function SubmissionsProvider({ children }) {
  const [submissions, setSubmissions] = useState(SEED);

  const addSubmission = useCallback((data) => {
    const id = `USL-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
    const item = { status: 'diajukan', catatan: '', createdAt: new Date().toISOString(), ...data, id };
    setSubmissions((list) => [item, ...list]);
    return item;
  }, []);

  const setStatus = useCallback((id, status, catatan) => {
    setSubmissions((list) => list.map((s) => (s.id === id ? { ...s, status, catatan: catatan ?? s.catatan } : s)));
  }, []);

  const value = useMemo(() => ({ submissions, addSubmission, setStatus }), [submissions, addSubmission, setStatus]);

  return <SubmissionsCtx.Provider value={value}>{children}</SubmissionsCtx.Provider>;
}

export function useSubmissions() {
  const ctx = useContext(SubmissionsCtx);
  if (!ctx) throw new Error('useSubmissions harus dipakai di dalam SubmissionsProvider');
  return ctx;
}
