import { useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import HBarChart from '../../components/charts/HBarChart.jsx';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/Modal.jsx';
import { DEMO_ACCOUNTS, ROLES, getRegisteredUsers } from '../../context/AuthContext.jsx';
import { useContent } from '../../context/ContentContext.jsx';
import { STATUS_USULAN, useSubmissions } from '../../context/SubmissionsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { RISET, BIDANG, KECAMATAN, SKEMA, STATS } from '../../data/singaData.js';
import { bidangById, kecById, rupiah, rupiahRingkas, skemaById, tanggal, statusMeta, angka } from '../../lib/format.js';

const MENU = [
  { id: 'ringkasan', label: 'Ringkasan', ikon: 'chart' },
  { id: 'pengguna', label: 'Manajemen Pengguna', ikon: 'users' },
  { id: 'usulan', label: 'Usulan Riset Mitra', ikon: 'handshake' },
  { id: 'riset', label: 'Katalog Riset', ikon: 'flask' },
  { id: 'konten', label: 'Berita & Publikasi', ikon: 'doc' },
  { id: 'pengaturan', label: 'Pengaturan Situs', ikon: 'shield' }
];

/* Akun contoh tambahan agar tabel manajemen pengguna punya kasus nyata. */
const AKUN_CONTOH = [
  { email: 'lppm@unud.ac.id', nama: 'Dr. Ni Made Ayu Sriwahyuni, M.Par.', role: 'mitra', instansi: 'Universitas Udayana', jenis: 'Perguruan Tinggi', status: 'aktif', terdaftar: '2025-02-18' },
  { email: 'p3m@pnb.ac.id', nama: 'Dr. I Made Dwi Ariyanta, S.Pi., M.Si.', role: 'mitra', instansi: 'Politeknik Negeri Bali', jenis: 'Perguruan Tinggi', status: 'aktif', terdaftar: '2025-03-02' },
  { email: 'dispar@bulelengkab.go.id', nama: 'I Nyoman Sutrisna, S.Sos., M.AP.', role: 'opd', instansi: 'Dinas Pariwisata', jenis: 'Perangkat Daerah', status: 'aktif', terdaftar: '2025-02-11' },
  { email: 'dkp@bulelengkab.go.id', nama: 'Ni Luh Putu Ariani, S.Pi., M.Si.', role: 'opd', instansi: 'Dinas Kelautan dan Perikanan', jenis: 'Perangkat Daerah', status: 'aktif', terdaftar: '2025-03-19' },
  { email: 'subakwanagiri@gmail.com', nama: 'I Ketut Sudarma', role: 'mitra', instansi: 'Subak Abian Wanagiri', jenis: 'Komunitas Subak', status: 'menunggu', terdaftar: '2025-09-02' },
  { email: 'pokdarwis.pemuteran@gmail.com', nama: 'I Gede Sukerta', role: 'mitra', instansi: 'Pokdarwis Pemuteran', jenis: 'Kelompok Sadar Wisata', status: 'menunggu', terdaftar: '2025-09-05' },
  { email: 'koperasi.sarigunung@gmail.com', nama: 'Ni Kadek Ayu Lestari', role: 'mitra', instansi: 'Koperasi Tani Sari Gunung', jenis: 'Koperasi / BUMDes', status: 'nonaktif', terdaftar: '2024-11-22' }
];

const STATUS_AKUN = {
  aktif: { l: 'Aktif', c: 'bg-success-bg text-success', ikon: 'checkCircle' },
  menunggu: { l: 'Menunggu verifikasi', c: 'bg-warning-bg text-warning', ikon: 'clock' },
  nonaktif: { l: 'Nonaktif', c: 'bg-danger-bg text-danger', ikon: 'alert' }
};

function Card({ title, desc, action, children }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5.5">
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="m-0 text-[1.02rem]">{title}</h2>}
            {desc && <p className="m-0 mt-0.5 text-[.8rem] text-ink-3">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ---------------- Ringkasan ---------------- */
function Ringkasan() {
  const perBidang = BIDANG.map((b) => ({
    label: b.nama, value: RISET.filter((r) => r.bidang === b.id).length
  })).sort((a, b) => b.value - a.value);

  const perKecamatan = [...KECAMATAN]
    .map((k) => ({ label: k.nama, value: k.riset }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const kpi = [
    { l: 'Riset terdaftar', v: angka(STATS.totalRiset), d: '+12 dari 2024', up: true },
    { l: 'Riset aktif dimonitor', v: angka(STATS.risetAktif), d: 'Tahun anggaran 2025', up: null },
    { l: 'Akun pengguna', v: angka(DEMO_ACCOUNTS.length + AKUN_CONTOH.length + getRegisteredUsers().length), d: '2 menunggu verifikasi', up: null },
    { l: 'Pagu riset 2025', v: rupiahRingkas(STATS.anggaran2025), d: `${Math.round((STATS.serapan2025 / STATS.anggaran2025) * 100)}% terserap`, up: true }
  ];

  const aktivitas = [
    { t: 'Akun mitra baru menunggu verifikasi', s: 'Pokdarwis Pemuteran · pokdarwis.pemuteran@gmail.com', w: '5 Sep 2025', ikon: 'users' },
    { t: 'Usulan kolaborasi riset masuk antrean', s: 'USL-2025-317 · Universitas Udayana', w: '4 Sep 2025', ikon: 'doc' },
    { t: 'Perbup wisata bahari Lovina ditetapkan', s: 'Adopsi kebijakan dari riset BRD-2025-002', w: '4 Sep 2025', ikon: 'award' },
    { t: 'SP-1 diterbitkan untuk BRD-2025-006', s: 'Keterlambatan laporan termin II', w: '22 Agu 2025', ikon: 'alert' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpi.map((k) => (
          <div key={k.l} className="rounded-xl border border-line bg-white p-4.5">
            <div className="text-[.78rem] font-semibold text-ink-3">{k.l}</div>
            <div className="mt-1 text-[1.75rem] font-extrabold leading-tight text-ink">{k.v}</div>
            <div className={`mt-1 text-[.755rem] font-semibold ${k.up ? 'text-success' : 'text-ink-3'}`}>
              {k.up ? '▲ ' : ''}{k.d}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Riset per bidang prioritas" desc="Jumlah judul riset dalam katalog, 2024–2025">
          <HBarChart rows={perBidang} ariaLabel="Jumlah riset per bidang prioritas" />
        </Card>
        <Card title="Sebaran riset per kecamatan" desc="Enam kecamatan dengan riset terbanyak">
          <HBarChart rows={perKecamatan} ariaLabel="Jumlah riset per kecamatan" />
        </Card>
      </div>

      <Card title="Aktivitas terbaru" desc="Kejadian yang memerlukan perhatian administrator">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {aktivitas.map((a) => (
            <li key={a.t} className="flex items-start gap-3 rounded-lg border border-line p-3.5">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-maroon-50 text-maroon-800"><Icon name={a.ikon} size={16} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[.86rem] font-semibold text-ink">{a.t}</span>
                <span className="block text-[.78rem] text-ink-3">{a.s}</span>
              </span>
              <span className="flex-none text-[.75rem] text-ink-3">{a.w}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ---------------- Manajemen pengguna ---------------- */
function Pengguna() {
  const toast = useToast();
  const awal = useMemo(() => [
    ...DEMO_ACCOUNTS.map((a) => ({ ...a, jenis: a.role === 'opd' ? 'Perangkat Daerah' : a.role === 'admin' ? 'Internal BRIDA' : 'Perguruan Tinggi' })),
    ...AKUN_CONTOH,
    ...getRegisteredUsers()
  ], []);

  const [akun, setAkun] = useState(awal);
  const [q, setQ] = useState('');
  const [peran, setPeran] = useState('');
  const [detail, setDetail] = useState(null);

  const hits = akun.filter((a) => {
    if (peran && a.role !== peran) return false;
    if (q && !`${a.nama} ${a.email} ${a.instansi}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function ubahStatus(email, status) {
    setAkun((list) => list.map((a) => (a.email === email ? { ...a, status } : a)));
    const label = status === 'aktif' ? 'diverifikasi dan diaktifkan' : 'dinonaktifkan';
    toast('success', 'Status akun diperbarui', `Akun ${email} ${label}. (Prototipe, perubahan hanya di sesi ini.)`);
    setDetail(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Manajemen pengguna"
        desc="Verifikasi pendaftaran mitra dan perangkat daerah, serta kelola status akun."
        action={
          <div className="flex flex-wrap gap-2">
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, surel, instansi…"
              className="input-base w-auto min-w-[220px]" aria-label="Cari akun" />
            <select value={peran} onChange={(e) => setPeran(e.target.value)} className="input-base w-auto" aria-label="Saring peran">
              <option value="">Semua peran</option>
              <option value="mitra">Mitra / Instansi</option>
              <option value="opd">OPD Perangkat Daerah</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[820px] border-collapse text-[.845rem]">
            <caption className="sr-only">Daftar akun pengguna portal</caption>
            <thead>
              <tr className="border-b border-line bg-surface-1">
                {['Pengguna', 'Instansi', 'Peran', 'Terdaftar', 'Status', 'Aksi'].map((h) => (
                  <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hits.map((a) => {
                const st = STATUS_AKUN[a.status] || STATUS_AKUN.aktif;
                return (
                  <tr key={a.email} className="border-b border-line last:border-0 hover:bg-surface-1">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-ink">{a.nama}</div>
                      <div className="text-[.765rem] text-ink-3">{a.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-ink-2">{a.instansi}</div>
                      <div className="text-[.765rem] text-ink-3">{a.jenis}</div>
                    </td>
                    <td className="px-4 py-3.5 text-ink-2">{ROLES[a.role]?.nama || a.role}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(a.terdaftar, true)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.c}`}>
                        <Icon name={st.ikon} size={12} /> {st.l}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button type="button" onClick={() => setDetail(a)}
                        className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                        Kelola
                      </button>
                    </td>
                  </tr>
                );
              })}
              {hits.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-3">Tidak ada akun yang cocok dengan filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {hits.length} dari {akun.length} akun terdaftar.</p>
      </Card>

      {detail && (
        <Modal title={`Kelola akun: ${detail.nama}`} onClose={() => setDetail(null)} footer={
          <>
            {detail.status !== 'aktif' && (
              <button type="button" onClick={() => ubahStatus(detail.email, 'aktif')}
                className="rounded-lg bg-success px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Verifikasi &amp; aktifkan</button>
            )}
            {detail.status !== 'nonaktif' && detail.role !== 'admin' && (
              <button type="button" onClick={() => ubahStatus(detail.email, 'nonaktif')}
                className="rounded-lg border border-danger px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger-bg">Nonaktifkan akun</button>
            )}
          </>
        }>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[.855rem]">
            <dt className="font-semibold text-ink-3">Nama</dt><dd className="m-0 font-semibold">{detail.nama}</dd>
            <dt className="font-semibold text-ink-3">Surel</dt><dd className="m-0 font-semibold">{detail.email}</dd>
            <dt className="font-semibold text-ink-3">Instansi</dt><dd className="m-0 font-semibold">{detail.instansi}</dd>
            <dt className="font-semibold text-ink-3">Jenis</dt><dd className="m-0 font-semibold">{detail.jenis || '-'}</dd>
            <dt className="font-semibold text-ink-3">Peran</dt><dd className="m-0 font-semibold">{ROLES[detail.role]?.nama}</dd>
            <dt className="font-semibold text-ink-3">Terdaftar</dt><dd className="m-0 font-semibold">{tanggal(detail.terdaftar)}</dd>
            <dt className="font-semibold text-ink-3">Status</dt><dd className="m-0 font-semibold">{STATUS_AKUN[detail.status]?.l}</dd>
          </dl>
          {detail.status === 'menunggu' && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning-bg bg-warning-bg px-4 py-3.5 text-[.855rem] text-[#78350F]">
              <Icon name="info" size={19} className="mt-0.5 flex-none text-warning" />
              <p className="m-0">Verifikasi keabsahan instansi dan penanggung jawab sebelum mengaktifkan akun ini.</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ---------------- Katalog riset ---------------- */
function KatalogRiset() {
  const [q, setQ] = useState('');
  const hits = RISET.filter((r) => !q || `${r.judul} ${r.peneliti} ${r.institusi}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <Card
      title="Katalog riset daerah"
      desc="Seluruh judul riset yang tercatat dalam basis data BRIDA."
      action={
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul, peneliti, institusi…"
          className="input-base w-auto min-w-[240px]" aria-label="Cari riset" />
      }
    >
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[860px] border-collapse text-[.845rem]">
          <caption className="sr-only">Katalog riset daerah</caption>
          <thead>
            <tr className="border-b border-line bg-surface-1">
              {['Kode', 'Judul & peneliti', 'Bidang', 'TA', 'Nilai kontrak', 'Status'].map((h) => (
                <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hits.map((r) => {
              const sm = statusMeta(r.status);
              return (
                <tr key={r.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">{r.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-ink">{r.judul.length > 58 ? r.judul.slice(0, 58) + '…' : r.judul}</div>
                    <div className="text-[.765rem] text-ink-3">{r.peneliti} · {r.institusi}</div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-2">{bidangById(r.bidang).nama.split(' ')[0]}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{r.tahun}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{rupiah(r.anggaran)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${sm.badge}`}>{sm.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {hits.length} dari {RISET.length} riset.</p>
    </Card>
  );
}

/* ---------------- Usulan riset mitra ---------------- */
function UsulanMitra() {
  const { submissions, setStatus } = useSubmissions();
  const toast = useToast();
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState(null);
  const [catatan, setCatatan] = useState('');

  const hits = filter ? submissions.filter((s) => s.status === filter) : submissions;

  function tindak(status) {
    setStatus(detail.id, status, status === 'ditolak' ? catatan : '');
    toast(status === 'berjalan' ? 'success' : 'danger',
      status === 'berjalan' ? 'Usulan disetujui' : 'Usulan ditolak',
      `Pengajuan ${detail.id} kini berstatus ${STATUS_USULAN[status].label}. (Prototipe, perubahan hanya di sesi ini.)`);
    setDetail(null); setCatatan('');
  }

  return (
    <Card
      title="Usulan kolaborasi riset dari mitra"
      desc="Verifikasi pengajuan, setujui menjadi riset berjalan, atau tolak dengan catatan perbaikan."
      action={
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Saring status usulan">
          {[['', 'Semua'], ...Object.values(STATUS_USULAN).map((s) => [s.id, s.label])].map(([id, label]) => (
            <button key={id || 'semua'} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id}
              className={`rounded-full border px-3 py-1.5 text-[.78rem] font-semibold transition ${
                filter === id ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'
              }`}>{label}</button>
          ))}
        </div>
      }
    >
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[880px] border-collapse text-[.845rem]">
          <caption className="sr-only">Daftar usulan kolaborasi riset mitra</caption>
          <thead>
            <tr className="border-b border-line bg-surface-1">
              {['No. registrasi', 'Judul & pengusul', 'Skema', 'Diajukan', 'Status', 'Aksi'].map((h) => (
                <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hits.map((s) => {
              const st = STATUS_USULAN[s.status];
              return (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">{s.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="max-w-[320px] font-semibold text-ink">{s.judul}</div>
                    <div className="text-[.765rem] text-ink-3">{s.namaKetua} · {s.institusi}</div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-2">{skemaById(s.skema).nama}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(s.createdAt.slice(0, 10), true)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.badge}`}>
                      <Icon name={st.ikon} size={12} /> {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button type="button" onClick={() => { setDetail(s); setCatatan(s.catatan || ''); }}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">Kelola</button>
                  </td>
                </tr>
              );
            })}
            {hits.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-3">Tidak ada usulan pada status ini.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {hits.length} dari {submissions.length} usulan.</p>

      {detail && (
        <Modal title={`Kelola usulan: ${detail.id}`} wide onClose={() => setDetail(null)} footer={
          <>
            {detail.status !== 'berjalan' && (
              <button type="button" onClick={() => tindak('berjalan')}
                className="rounded-lg bg-success px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Setujui &amp; jadikan berjalan</button>
            )}
            {detail.status !== 'ditolak' && (
              <button type="button" onClick={() => tindak('ditolak')}
                className="rounded-lg border border-danger px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger-bg">Tolak usulan</button>
            )}
          </>
        }>
          <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.75 text-[.845rem]">
            <dt className="font-semibold text-ink-3">Judul</dt><dd className="m-0 font-semibold">{detail.judul}</dd>
            <dt className="font-semibold text-ink-3">Ketua peneliti</dt><dd className="m-0 font-semibold">{detail.namaKetua} · {detail.institusi}</dd>
            <dt className="font-semibold text-ink-3">Kontak</dt><dd className="m-0 font-semibold">{detail.email} · {detail.telp}</dd>
            <dt className="font-semibold text-ink-3">Skema</dt><dd className="m-0 font-semibold">{skemaById(detail.skema).nama}</dd>
            <dt className="font-semibold text-ink-3">Bidang</dt><dd className="m-0 font-semibold">{bidangById(detail.bidang).nama}</dd>
            <dt className="font-semibold text-ink-3">Lokasi</dt><dd className="m-0 font-semibold">{detail.kecamatan === 'lintas' ? 'Lintas kecamatan' : kecById(detail.kecamatan).nama}</dd>
            <dt className="font-semibold text-ink-3">Usulan dana</dt><dd className="m-0 font-semibold">Rp {detail.dana}</dd>
          </dl>
          <h4 className="mb-1.5 text-[.9rem]">Urgensi</h4>
          <p className="mb-4 whitespace-pre-line text-[.85rem] text-ink-2">{detail.urgensi}</p>
          <h4 className="mb-1.5 text-[.9rem]">Luaran</h4>
          <p className="mb-4 whitespace-pre-line text-[.85rem] text-ink-2">{detail.luaran}</p>
          <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">Catatan untuk mitra (terisi otomatis bila ditolak)</label>
          <textarea className="input-base min-h-[80px]" value={catatan} onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: dokumen RAB belum sesuai standar, lengkapi dan ajukan kembali." />
        </Modal>
      )}
    </Card>
  );
}

/* ---------------- Konten ---------------- */
function FormModal({ title, fields, initial, onClose, onSubmit, submitLabel = 'Simpan' }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal title={title} wide onClose={onClose} footer={
      <button type="button" onClick={() => onSubmit(form)} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600">{submitLabel}</button>
    }>
      <div className="grid gap-x-4.5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={`mb-4 ${f.full ? 'sm:col-span-2' : ''}`}>
            <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">{f.label}</label>
            {f.type === 'select' ? (
              <select className="input-base" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">Pilih {f.label.toLowerCase()}</option>
                {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className="input-base min-h-[110px]" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
            ) : (
              <input className="input-base" type={f.type || 'text'} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

const BERITA_FIELDS = [
  { key: 'kategori', label: 'Kategori', placeholder: 'Kebijakan, Pendanaan, Monev, …' },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'judul', label: 'Judul berita', full: true },
  { key: 'penulis', label: 'Penulis' },
  { key: 'gambar', label: 'Path gambar', placeholder: '/images/berita/berita-xx.jpg' },
  { key: 'ringkas', label: 'Ringkasan', type: 'textarea', full: true },
  { key: 'isiText', label: 'Isi lengkap (satu paragraf per baris)', type: 'textarea', full: true }
];

function dokFields() {
  return [
    { key: 'judul', label: 'Judul dokumentasi', full: true },
    { key: 'bidang', label: 'Bidang', type: 'select', options: BIDANG.map((b) => ({ value: b.id, label: b.nama })) },
    { key: 'kecamatan', label: 'Kecamatan', type: 'select', options: KECAMATAN.map((k) => ({ value: k.id, label: k.nama })) },
    { key: 'tanggal', label: 'Tanggal', type: 'date' },
    { key: 'risetId', label: 'Kode riset terkait (opsional)', placeholder: 'BRD-2025-001' },
    { key: 'fotoSrc', label: 'Path foto utama', placeholder: '/images/dokumentasi/nama-foto.jpg' },
    { key: 'fotoKet', label: 'Keterangan foto' },
    { key: 'narasi', label: 'Narasi pelaksanaan', type: 'textarea', full: true }
  ];
}

function pendanaanFields() {
  return [
    { key: 'nama', label: 'Nama skema', full: true },
    { key: 'penyelenggara', label: 'Penyelenggara' },
    { key: 'skema', label: 'Kode skema', type: 'select', options: SKEMA.map((s) => ({ value: s.id, label: s.nama })) },
    { key: 'plafon', label: 'Plafon (Rp)', type: 'number' },
    { key: 'kuota', label: 'Kuota', type: 'number' },
    { key: 'deadline', label: 'Tenggat', type: 'date' },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'open', label: 'Dibuka' }, { value: 'closing', label: 'Segera tutup' }, { value: 'soon', label: 'Akan dibuka' }] },
    { key: 'ket', label: 'Keterangan', type: 'textarea', full: true }
  ];
}

function Konten() {
  const toast = useToast();
  const {
    berita, addBerita, updateBerita, deleteBerita,
    dokumentasi, addDokumentasi, updateDokumentasi, deleteDokumentasi,
    pendanaan, addPendanaan, updatePendanaan, deletePendanaan
  } = useContent();
  const [modal, setModal] = useState(null); // { jenis: 'berita'|'dok'|'pendanaan', data?: ... }

  function simpanBerita(form) {
    const payload = { ...form, isi: (form.isiText || '').split('\n').map((s) => s.trim()).filter(Boolean) };
    delete payload.isiText;
    if (modal.data) { updateBerita(modal.data.id, payload); toast('success', 'Berita diperbarui', `"${payload.judul}" telah disunting.`); }
    else { addBerita(payload); toast('success', 'Berita ditambahkan', `"${payload.judul}" tayang di halaman Berita & Diseminasi.`); }
    setModal(null);
  }

  function simpanDok(form) {
    const fotoBaru = { src: form.fotoSrc, ket: form.fotoKet };
    const payload = {
      judul: form.judul, bidang: form.bidang, kecamatan: form.kecamatan, tanggal: form.tanggal, risetId: form.risetId, narasi: form.narasi,
      foto: modal.data ? [fotoBaru, ...modal.data.foto.slice(1)] : [fotoBaru],
      video: modal.data?.video ?? null, galeriVideo: modal.data?.galeriVideo ?? null
    };
    if (modal.data) { updateDokumentasi(modal.data.id, payload); toast('success', 'Dokumentasi diperbarui', `"${payload.judul}" telah disunting.`); }
    else { addDokumentasi(payload); toast('success', 'Dokumentasi ditambahkan', `"${payload.judul}" tayang di halaman Publikasi & Dokumentasi.`); }
    setModal(null);
  }

  function simpanPendanaan(form) {
    const payload = {
      ...form, plafon: Number(form.plafon) || 0, kuota: Number(form.kuota) || 0,
      situs: modal.data?.situs || 'https://bulelengkab.go.id', situsNama: modal.data?.situsNama || 'BRIDA Kabupaten Buleleng',
      bidangTarget: modal.data?.bidangTarget || [], syarat: modal.data?.syarat || []
    };
    if (modal.data) { updatePendanaan(modal.data.id, payload); toast('success', 'Skema pendanaan diperbarui', `"${payload.nama}" telah disunting.`); }
    else { addPendanaan(payload); toast('success', 'Skema pendanaan ditambahkan', `"${payload.nama}" tayang pada peluang pendanaan.`); }
    setModal(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <Card title="Berita & diseminasi" desc="Kelola kabar yang tampil pada beranda dan halaman Berita."
        action={<button type="button" onClick={() => setModal({ jenis: 'berita' })} className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600"><Icon name="plus" size={15} /> Tulis berita</button>}>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {berita.map((n) => (
            <li key={n.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line p-3.5">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[.71rem] font-bold text-ink-2">{n.kategori}</span>
              <span className="min-w-[240px] flex-1">
                <span className="block text-[.87rem] font-semibold text-ink">{n.judul}</span>
                <span className="block text-[.76rem] text-ink-3">{tanggal(n.tanggal)} · {n.penulis}</span>
              </span>
              <button type="button" onClick={() => setModal({ jenis: 'berita', data: n })} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600 hover:text-maroon-800">Sunting</button>
              <button type="button" onClick={() => { deleteBerita(n.id); toast('info', 'Berita dihapus', `"${n.judul}" telah dihapus dari portal.`); }}
                className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-danger hover:border-danger hover:bg-danger-bg">Hapus</button>
            </li>
          ))}
          {berita.length === 0 && <li className="py-6 text-center text-ink-3">Belum ada berita.</li>}
        </ul>
      </Card>

      <Card title="Publikasi & dokumentasi" desc="Kelola arsip visual pelaksanaan riset pada halaman Publikasi & Dokumentasi."
        action={<button type="button" onClick={() => setModal({ jenis: 'dok' })} className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600"><Icon name="plus" size={15} /> Tambah dokumentasi</button>}>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {dokumentasi.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line p-3.5">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[.71rem] font-bold text-ink-2">{bidangById(d.bidang).nama.split(' ')[0]}</span>
              <span className="min-w-[240px] flex-1">
                <span className="block text-[.87rem] font-semibold text-ink">{d.judul}</span>
                <span className="block text-[.76rem] text-ink-3">{tanggal(d.tanggal)} · Kec. {kecById(d.kecamatan).nama} · {d.foto.length} foto</span>
              </span>
              <button type="button" onClick={() => setModal({ jenis: 'dok', data: d })} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600 hover:text-maroon-800">Sunting</button>
              <button type="button" onClick={() => { deleteDokumentasi(d.id); toast('info', 'Dokumentasi dihapus', `"${d.judul}" telah dihapus dari portal.`); }}
                className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-danger hover:border-danger hover:bg-danger-bg">Hapus</button>
            </li>
          ))}
          {dokumentasi.length === 0 && <li className="py-6 text-center text-ink-3">Belum ada dokumentasi.</li>}
        </ul>
      </Card>

      <Card title="Skema pendanaan" desc="Atur kuota, plafon, dan tenggat setiap skema hibah."
        action={<button type="button" onClick={() => setModal({ jenis: 'pendanaan' })} className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600"><Icon name="plus" size={15} /> Tambah skema</button>}>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[760px] border-collapse text-[.845rem]">
            <caption className="sr-only">Daftar skema pendanaan</caption>
            <thead>
              <tr className="border-b border-line bg-surface-1">
                {['Skema', 'Plafon', 'Kuota', 'Tenggat', 'Status', 'Aksi'].map((h) => (
                  <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendanaan.map((f) => (
                <tr key={f.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-ink">{f.nama}</div>
                    <div className="text-[.765rem] text-ink-3">{f.penyelenggara}</div>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{rupiahRingkas(f.plafon)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{f.kuota}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(f.deadline, true)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${
                      f.status === 'open' ? 'bg-success-bg text-success' : f.status === 'closing' ? 'bg-danger-bg text-danger' : 'bg-info-bg text-info'
                    }`}>
                      {f.status === 'open' ? 'Dibuka' : f.status === 'closing' ? 'Segera tutup' : 'Akan dibuka'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setModal({ jenis: 'pendanaan', data: f })} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600 hover:text-maroon-800">Sunting</button>
                    <button type="button" onClick={() => { deletePendanaan(f.id); toast('info', 'Skema dihapus', `"${f.nama}" telah dihapus.`); }}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-danger hover:border-danger hover:bg-danger-bg">Hapus</button>
                  </td>
                </tr>
              ))}
              {pendanaan.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-3">Belum ada skema pendanaan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modal?.jenis === 'berita' && (
        <FormModal
          title={modal.data ? 'Sunting berita' : 'Tulis berita baru'}
          fields={BERITA_FIELDS}
          initial={modal.data ? { ...modal.data, isiText: (modal.data.isi || []).join('\n') } : { kategori: '', tanggal: '', judul: '', penulis: '', gambar: '', ringkas: '', isiText: '' }}
          onClose={() => setModal(null)}
          onSubmit={simpanBerita}
          submitLabel={modal.data ? 'Simpan perubahan' : 'Terbitkan berita'}
        />
      )}
      {modal?.jenis === 'dok' && (
        <FormModal
          title={modal.data ? 'Sunting dokumentasi' : 'Tambah dokumentasi baru'}
          fields={dokFields()}
          initial={modal.data ? { ...modal.data, fotoSrc: modal.data.foto[0]?.src || '', fotoKet: modal.data.foto[0]?.ket || '' } : { judul: '', bidang: '', kecamatan: '', tanggal: '', risetId: '', fotoSrc: '', fotoKet: '', narasi: '' }}
          onClose={() => setModal(null)}
          onSubmit={simpanDok}
          submitLabel={modal.data ? 'Simpan perubahan' : 'Tambahkan dokumentasi'}
        />
      )}
      {modal?.jenis === 'pendanaan' && (
        <FormModal
          title={modal.data ? 'Sunting skema pendanaan' : 'Tambah skema pendanaan'}
          fields={pendanaanFields()}
          initial={modal.data || { nama: '', penyelenggara: '', skema: '', plafon: '', kuota: '', deadline: '', status: 'open', ket: '' }}
          onClose={() => setModal(null)}
          onSubmit={simpanPendanaan}
          submitLabel={modal.data ? 'Simpan perubahan' : 'Tambahkan skema'}
        />
      )}
    </div>
  );
}

/* ---------------- Pengaturan ---------------- */
function Pengaturan() {
  const toast = useToast();
  const [form, setForm] = useState({
    namaSitus: 'SINGA RISET BULELENG',
    tagline: 'Sinergi Gerakan Akademisi dan Riset Buleleng',
    email: 'brida@bulelengkab.go.id',
    telepon: '(0362) 21985',
    alamat: 'Jl. Ngurah Rai No. 2, Singaraja, Kabupaten Buleleng, Bali 81113',
    batchBuka: true,
    pendaftaranMitra: true,
    modePemeliharaan: false
  });

  function simpan(e) {
    e.preventDefault();
    toast('success', 'Pengaturan disimpan', 'Perubahan tercatat pada sesi ini (prototipe, belum dikirim ke server).');
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={simpan} className="flex max-w-[720px] flex-col gap-5">
      <Card title="Identitas situs" desc="Nama dan kontak yang tampil pada header serta footer portal.">
        <div className="grid gap-x-5 sm:grid-cols-2">
          {[
            ['namaSitus', 'Nama situs', 'text'],
            ['tagline', 'Tagline', 'text'],
            ['email', 'Surel resmi', 'email'],
            ['telepon', 'Telepon', 'tel']
          ].map(([k, l, t]) => (
            <div key={k} className="mb-4">
              <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">{l}</label>
              <input className="input-base" type={t} value={form[k]} onChange={(e) => set(k, e.target.value)} />
            </div>
          ))}
          <div className="mb-4 sm:col-span-2">
            <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">Alamat kantor</label>
            <textarea className="input-base min-h-[70px]" value={form.alamat} onChange={(e) => set('alamat', e.target.value)} />
          </div>
        </div>
      </Card>

      <Card title="Kendali portal" desc="Saklar yang memengaruhi perilaku portal publik.">
        <div className="flex flex-col gap-2.5">
          {[
            ['batchBuka', 'Batch pengajuan riset dibuka', 'Ketika nonaktif, formulir kolaborasi hanya menerima draf.'],
            ['pendaftaranMitra', 'Pendaftaran akun mandiri', 'Izinkan mitra dan OPD membuat akun sendiri melalui halaman daftar.'],
            ['modePemeliharaan', 'Mode pemeliharaan', 'Tampilkan halaman pemeliharaan bagi pengunjung publik.']
          ].map(([k, l, s]) => (
            <label key={k} className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[.86rem] transition ${form[k] ? 'border-maroon-800 bg-maroon-50' : 'border-line hover:bg-surface-1'}`}>
              <input type="checkbox" className="mt-0.5 h-4 w-4 flex-none accent-maroon-800" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
              <span><span className="block font-semibold text-ink">{l}</span><span className="block text-[.78rem] text-ink-3">{s}</span></span>
            </label>
          ))}
        </div>
      </Card>

      <div>
        <button type="submit" className="rounded-lg bg-maroon-800 px-6 py-3 text-[.92rem] font-semibold text-white hover:bg-maroon-600">
          Simpan pengaturan
        </button>
      </div>
    </form>
  );
}

/* ---------------- Shell ---------------- */
const JUDUL = {
  ringkasan: ['Ringkasan portal', 'Pantauan menyeluruh ekosistem riset dan aktivitas portal'],
  pengguna: ['Manajemen pengguna', 'Verifikasi dan kelola akun mitra serta perangkat daerah'],
  usulan: ['Usulan riset mitra', 'Verifikasi, setujui, atau tolak pengajuan kolaborasi riset dari mitra'],
  riset: ['Katalog riset', 'Seluruh judul riset dalam basis data BRIDA'],
  konten: ['Berita & publikasi', 'Kelola konten yang tampil di portal publik'],
  pengaturan: ['Pengaturan situs', 'Identitas, kontak, dan kendali portal']
};

export default function AdminDashboard() {
  const [active, setActive] = useState('ringkasan');
  const [judul, sub] = JUDUL[active];
  const { submissions } = useSubmissions();
  const pendingUsulan = submissions.filter((s) => s.status === 'diajukan').length;

  const menu = MENU.map((m) => {
    if (m.id === 'pengguna') return { ...m, badge: 2 };
    if (m.id === 'usulan' && pendingUsulan > 0) return { ...m, badge: pendingUsulan };
    return m;
  });

  return (
    <DashboardLayout menu={menu} active={active} onSelect={setActive} title={judul} subtitle={sub}>
      {active === 'ringkasan' && <Ringkasan />}
      {active === 'pengguna' && <Pengguna />}
      {active === 'usulan' && <UsulanMitra />}
      {active === 'riset' && <KatalogRiset />}
      {active === 'konten' && <Konten />}
      {active === 'pengaturan' && <Pengaturan />}
    </DashboardLayout>
  );
}
