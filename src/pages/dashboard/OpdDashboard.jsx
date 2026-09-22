import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import MonevFormPage from '../MonevFormPage.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const MENU = [
  { id: 'isi-monev', label: 'Isi Form Monev', ikon: 'doc' },
  { id: 'riwayat-monev', label: 'Riwayat Monev', ikon: 'clock' }
];

const RIWAYAT_MONEV = [
  {
    judul: 'Sistem Irigasi Presisi Berbasis IoT untuk Subak Sawah Sukasada Menghadapi Anomali Iklim',
    tanggal: '21 Agustus 2025',
    hasil: 'Sudah'
  },
  {
    judul: 'Model Pengelolaan Wisata Bahari Berkelanjutan Berbasis Masyarakat di Kawasan Lovina',
    tanggal: '12 Agustus 2025',
    hasil: 'Sudah'
  }
];

function RiwayatMonev() {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-line bg-white p-5.5">
        <h2 className="m-0 text-[1.05rem]">Riwayat input Monev</h2>
        <p className="mt-1 text-[.84rem] text-ink-3">Daftar hasil monitoring yang pernah diisi oleh akun OPD ini.</p>

        <div className="mt-5 flex flex-col gap-3">
          {RIWAYAT_MONEV.map((item) => (
            <article key={item.judul} className="rounded-xl border border-line p-4 transition hover:border-maroon-100 hover:bg-surface-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="m-0 text-[.9rem] leading-snug">{item.judul}</h3>
                  <p className="m-0 mt-1.5 text-[.76rem] text-ink-3">Diisi pada {item.tanggal}</p>
                </div>
                <span className="flex-none self-start rounded-full bg-success-bg px-2.5 py-1 text-[.7rem] font-bold text-success">Monitoring: {item.hasil}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function OpdDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('isi-monev');

  const content = active === 'isi-monev' ? <MonevFormPage /> : <RiwayatMonev />;
  const title = active === 'isi-monev' ? 'Isi Form Monitoring & Evaluasi' : 'Riwayat Monev';
  const subtitle = active === 'isi-monev' ? `${user.instansi} · Tahun Anggaran 2025` : `${user.instansi} · Riwayat pengajuan Monev`;

  return (
    <DashboardLayout
      menu={MENU}
      active={active}
      onSelect={setActive}
      title={title}
      subtitle={subtitle}
    >
      {content}
    </DashboardLayout>
  );
}
