import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import HBarChart from '../../components/charts/HBarChart.jsx';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/Modal.jsx';
import NewsFormModal from '../../components/NewsFormModal.jsx';
import AsyncState, { EmptyState, ErrorState, SkeletonGrid } from '../../components/AsyncState.jsx';
import MonevModule from './MonevModule.jsx';
import { ROLES, useAuth } from '../../context/AuthContext.jsx';
import { useMutation } from '../../hooks/useData.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useFunding, useSettings, useStats } from '../../hooks/useContent.js';
import { useAdminNews, useNewsCategories } from '../../hooks/useNews.js';
import { useDocumentations, useResearchDetail, useStaffResearches } from '../../hooks/useResearch.js';
import { useUsers } from '../../hooks/useUsers.js';
import { errorMessage } from '../../services/api.js';
import { NEWS_STATUS, newsService } from '../../services/newsService.js';
import { contentService, validateFunding } from '../../services/contentService.js';
import { DECISION_LABEL, researchService, statusResearch } from '../../services/researchService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { BIDANG, KECAMATAN, SKEMA } from '../../data/singaData.js';
import { rupiah, rupiahRingkas, tanggal, angka } from '../../lib/format.js';

const MENU = [
  { id: 'ringkasan', label: 'Ringkasan', ikon: 'chart' },
  { id: 'monev', label: 'Monitoring & Evaluasi', ikon: 'chart' },
  { id: 'pengguna', label: 'Manajemen Pengguna', ikon: 'users' },
  { id: 'usulan', label: 'Usulan Riset Mitra', ikon: 'handshake' },
  { id: 'riset', label: 'Katalog Riset', ikon: 'flask' },
  { id: 'konten', label: 'Berita & Publikasi', ikon: 'doc' },
  { id: 'pengaturan', label: 'Pengaturan Situs', ikon: 'shield' }
];

const STATUS_AKUN = {
  aktif: { l: 'Aktif', c: 'bg-success-bg text-success', ikon: 'checkCircle' },
  menunggu: { l: 'Belum verifikasi surel', c: 'bg-warning-bg text-warning', ikon: 'clock' }
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
function AktivitasTerbaru() {
  const { data, loading, error } = useStaffResearches({ limit: 5 });
  if (error) return null;
  const list = data || [];
  return (
    <Card title="Aktivitas terbaru" desc="Usulan riset yang paling baru masuk atau diperbarui">
      {loading && !data ? <SkeletonGrid count={3} className="flex flex-col gap-2" itemClassName="h-14" /> : list.length === 0 ? (
        <EmptyState icon="doc" title="Belum ada aktivitas" />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {list.map((a) => (
            <li key={a.id} className="flex items-start gap-3 rounded-lg border border-line p-3.5">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-maroon-50 text-maroon-800"><Icon name="doc" size={16} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[.86rem] font-semibold text-ink">{a.judul}</span>
                <span className="block text-[.78rem] text-ink-3">{a.kode} · {a.pengusul || '-'}</span>
              </span>
              <span className="flex flex-none flex-col items-end gap-1">
                <StatusRiset status={a.status} />
                <span className="text-[.75rem] text-ink-3">{tanggal(a.tanggal, true)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Ringkasan() {
  const { user } = useAuth();
  const { data: st, error, reload } = useStats();
  if (!st) {
    return error
      ? <ErrorState error={error} onRetry={reload} title="Statistik gagal dimuat" />
      : <SkeletonGrid count={4} className="grid grid-cols-2 gap-4 lg:grid-cols-4" itemClassName="h-28" />;
  }

  const perBidang = BIDANG.map((b) => ({ label: b.nama, value: (st.by_category || []).find((c) => c.value === b.nama)?.total || 0 }))
    .sort((a, b) => b.value - a.value);
  const perKecamatan = KECAMATAN.map((k) => ({ label: k.nama, value: (st.by_location || []).find((c) => c.value === k.nama)?.total || 0 }))
    .sort((a, b) => b.value - a.value).slice(0, 6);

  const kpi = [
    { l: 'Riset terdaftar', v: angka(st.total_research), d: `${st.pending_submissions} menunggu verifikasi` },
    { l: 'Riset aktif dimonitor', v: angka(st.active_research), d: 'Disetujui & berjalan' },
    { l: 'Akun pengguna', v: angka(st.users), d: `${st.researchers} peneliti terverifikasi` },
    { l: 'Nilai riset berjalan', v: rupiahRingkas(st.active_budget), d: `${st.open_funding} skema pendanaan dibuka` }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpi.map((k) => (
          <div key={k.l} className="rounded-xl border border-line bg-white p-4.5">
            <div className="text-[.78rem] font-semibold text-ink-3">{k.l}</div>
            <div className="mt-1 text-[1.75rem] font-extrabold leading-tight text-ink">{k.v}</div>
            <div className="mt-1 text-[.755rem] font-semibold text-ink-3">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Riset aktif per bidang prioritas" desc="Riset yang disetujui dan sedang berjalan">
          <HBarChart rows={perBidang} ariaLabel="Jumlah riset aktif per bidang prioritas" />
        </Card>
        <Card title="Sebaran riset aktif per kecamatan" desc="Enam kecamatan dengan riset aktif terbanyak">
          <HBarChart rows={perKecamatan} ariaLabel="Jumlah riset aktif per kecamatan" />
        </Card>
      </div>

      {user.backendRole !== 'media-brida' && <AktivitasTerbaru />}
    </div>
  );
}

/* ---------------- Manajemen pengguna ---------------- */
function Pengguna() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const cari = useDebounce(q.trim(), 400);
  const { data, meta, loading, error, reload } = useUsers({ page, limit: 20, q: cari });
  const akun = data || [];
  const totalPage = meta?.total_page || 1;

  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Manajemen pengguna"
        desc="Daftar akun terdaftar pada portal, diambil langsung dari server."
        action={
          <div className="flex flex-wrap gap-2">
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Cari nama atau surel…"
              className="input-base w-auto min-w-[220px]" aria-label="Cari akun" />
            <button type="button" onClick={reload} disabled={loading} aria-label="Muat ulang daftar akun"
              className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong text-ink-2 hover:border-maroon-600 hover:text-maroon-800 disabled:opacity-50">
              <Icon name="refresh" size={16} />
            </button>
          </div>
        }
      >
        <AsyncState
          loading={loading}
          error={error}
          isEmpty={akun.length === 0}
          onRetry={reload}
          skeleton={<SkeletonGrid count={5} className="flex flex-col gap-2" itemClassName="h-14" />}
          empty={<EmptyState icon="users" title={cari ? 'Tidak ada akun yang cocok' : 'Belum ada akun terdaftar'} />}
        >
          <div className={`overflow-x-auto rounded-lg border border-line ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
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
                {akun.map((a) => {
                  const st = a.verified ? STATUS_AKUN.aktif : STATUS_AKUN.menunggu;
                  return (
                    <tr key={a.publicId} className="border-b border-line last:border-0 hover:bg-surface-1">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-ink">{a.nama}</div>
                        <div className="text-[.765rem] text-ink-3">{a.email}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-ink-2">{a.instansi}</div>
                        <div className="text-[.765rem] text-ink-3">{a.jabatan}</div>
                      </td>
                      <td className="px-4 py-3.5 text-ink-2">{ROLES[a.role]?.nama || a.role}<div className="text-[.72rem] text-ink-3">{a.backendRole}</div></td>
                      <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(a.terdaftar, true)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.c}`}>
                          <Icon name={st.ikon} size={12} /> {st.l}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button type="button" onClick={() => setDetail(a)}
                          className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[.82rem] text-ink-3">
            <span>Menampilkan {akun.length} dari {meta?.total ?? akun.length} akun terdaftar.</span>
            {totalPage > 1 && (
              <span className="flex items-center gap-2">
                <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-line-strong px-3 py-1.5 font-semibold text-ink-2 disabled:opacity-40">←</button>
                Halaman {page} / {totalPage}
                <button type="button" disabled={page >= totalPage || loading} onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-line-strong px-3 py-1.5 font-semibold text-ink-2 disabled:opacity-40">→</button>
              </span>
            )}
          </div>
        </AsyncState>
      </Card>

      {detail && (
        <Modal title={`Detail akun: ${detail.nama}`} onClose={() => setDetail(null)}>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[.855rem]">
            <dt className="font-semibold text-ink-3">Nama</dt><dd className="m-0 font-semibold">{detail.nama}</dd>
            <dt className="font-semibold text-ink-3">Surel</dt><dd className="m-0 font-semibold">{detail.email}</dd>
            <dt className="font-semibold text-ink-3">Instansi</dt><dd className="m-0 font-semibold">{detail.instansi}</dd>
            <dt className="font-semibold text-ink-3">Jabatan</dt><dd className="m-0 font-semibold">{detail.jabatan}</dd>
            <dt className="font-semibold text-ink-3">Peran</dt><dd className="m-0 font-semibold">{ROLES[detail.role]?.nama} ({detail.backendRole})</dd>
            <dt className="font-semibold text-ink-3">Terdaftar</dt><dd className="m-0 font-semibold">{tanggal(detail.terdaftar)}</dd>
            <dt className="font-semibold text-ink-3">Status</dt><dd className="m-0 font-semibold">{detail.verified ? STATUS_AKUN.aktif.l : STATUS_AKUN.menunggu.l}</dd>
          </dl>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- Katalog riset ---------------- */
function StatusRiset({ status }) {
  const st = statusResearch(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.badge}`}>
      <Icon name={st.ikon} size={12} /> {st.label}
    </span>
  );
}

function Pager({ page, totalPage, loading, onPage }) {
  if (totalPage <= 1) return null;
  return (
    <span className="flex items-center gap-2">
      <button type="button" disabled={page <= 1 || loading} onClick={() => onPage(page - 1)}
        className="rounded-lg border border-line-strong px-3 py-1.5 font-semibold text-ink-2 disabled:opacity-40">←</button>
      Halaman {page} / {totalPage}
      <button type="button" disabled={page >= totalPage || loading} onClick={() => onPage(page + 1)}
        className="rounded-lg border border-line-strong px-3 py-1.5 font-semibold text-ink-2 disabled:opacity-40">→</button>
    </span>
  );
}

function KatalogRiset() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const cari = useDebounce(q.trim(), 400);
  const { data, meta, loading, error, reload } = useStaffResearches({ page, limit: 20, q: cari });
  const list = data || [];

  return (
    <Card
      title="Katalog riset daerah"
      desc="Seluruh judul riset yang tercatat dalam basis data BRIDA, termasuk yang masih dalam proses review."
      action={
        <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Cari judul riset…"
          className="input-base w-auto min-w-[240px]" aria-label="Cari riset" />
      }
    >
      <AsyncState loading={loading} error={error} isEmpty={list.length === 0} onRetry={reload}
        skeleton={<SkeletonGrid count={5} className="flex flex-col gap-2" itemClassName="h-14" />}
        empty={<EmptyState icon="flask" title={cari ? 'Tidak ada riset yang cocok' : 'Belum ada riset tercatat'} />}>
        <div className={`overflow-x-auto rounded-lg border border-line ${loading ? 'opacity-60' : ''}`}>
          <table className="w-full min-w-[860px] border-collapse text-[.845rem]">
            <caption className="sr-only">Katalog riset daerah</caption>
            <thead>
              <tr className="border-b border-line bg-surface-1">
                {['Kode', 'Judul & pengusul', 'Bidang', 'Diajukan', 'Nilai usulan', 'Status'].map((h) => (
                  <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">{r.kode}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-ink">{r.judul.length > 58 ? r.judul.slice(0, 58) + '…' : r.judul}</div>
                    <div className="text-[.765rem] text-ink-3">{[r.pengusul, r.institusi].filter(Boolean).join(' · ')}</div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-2">{r.bidang.split(' ')[0] || '-'}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(r.tanggal, true)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{r.dana ? rupiah(r.dana) : '-'}</td>
                  <td className="px-4 py-3.5"><StatusRiset status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[.82rem] text-ink-3">
          <span>Menampilkan {list.length} dari {meta?.total ?? list.length} riset.</span>
          <Pager page={page} totalPage={meta?.total_page || 1} loading={loading} onPage={setPage} />
        </div>
      </AsyncState>
    </Card>
  );
}

/* ---------------- Usulan riset mitra ---------------- */
const FILTER_USULAN = [
  ['', 'Semua'], ['pending', 'Menunggu'], ['under-review', 'Ditinjau'], ['revision', 'Perlu revisi'],
  ['on-going', 'Berjalan'], ['rejected', 'Ditolak']
];

function KelolaUsulan({ slug, onClose, onChanged }) {
  const toast = useToast();
  const { user } = useAuth();
  const { data: d, loading, error, reload } = useResearchDetail(slug);
  const [catatan, setCatatan] = useState('');
  const [salah, setSalah] = useState('');
  const aksi = useMutation(async (jenis) => {
    if (jenis === 'klaim') return researchService.claim(d.id);
    if (jenis === 'setujui') return researchService.approve(d.id, catatan.trim() || 'Usulan disetujui.');
    return researchService.decide(d.id, jenis, catatan.trim());
  });

  async function jalankan(jenis) {
    setSalah('');
    if ((jenis === 'revision' || jenis === 'rejected') && catatan.trim().length < 10) {
      setSalah('Tulis catatan minimal 10 karakter agar mitra tahu apa yang perlu diperbaiki.');
      return;
    }
    try {
      await aksi.mutate(jenis);
      const pesan = { klaim: 'Usulan kini dalam tinjauan Anda.', setujui: 'Usulan disetujui dan menjadi riset berjalan.', revision: 'Mitra diminta merevisi usulan.', rejected: 'Usulan ditolak.' };
      toast(jenis === 'rejected' ? 'info' : 'success', 'Status usulan diperbarui', pesan[jenis]);
      setCatatan('');
      reload();
      onChanged();
    } catch (err) {
      setSalah(errorMessage(err));
    }
  }

  const sayaReviewer = d && d.reviewerId && d.reviewerId === user.publicId;
  const footer = d && (
    <>
      {d.status === 'pending' && (
        <button type="button" disabled={aksi.loading} onClick={() => jalankan('klaim')}
          className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">Tinjau usulan ini</button>
      )}
      {d.status === 'under-review' && sayaReviewer && (
        <>
          <button type="button" disabled={aksi.loading} onClick={() => jalankan('setujui')}
            className="rounded-lg bg-success px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">Setujui &amp; jadikan berjalan</button>
          <button type="button" disabled={aksi.loading} onClick={() => jalankan('revision')}
            className="rounded-lg border border-warning px-5 py-2.5 text-sm font-semibold text-warning hover:bg-warning-bg disabled:opacity-50">Minta revisi</button>
          <button type="button" disabled={aksi.loading} onClick={() => jalankan('rejected')}
            className="rounded-lg border border-danger px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger-bg disabled:opacity-50">Tolak usulan</button>
        </>
      )}
    </>
  );

  return (
    <Modal title={d ? `Kelola usulan: ${d.kode}` : 'Kelola usulan'} wide onClose={onClose} footer={footer}>
      {loading && !d && <SkeletonGrid count={4} className="flex flex-col gap-3" itemClassName="h-10" />}
      {error && !d && <ErrorState compact error={error} onRetry={reload} title="Gagal memuat usulan" />}
      {d && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <StatusRiset status={d.status} />
            {d.reviewer && <span className="text-[.78rem] text-ink-3">Reviewer: <b>{d.reviewer}</b>{sayaReviewer ? ' (Anda)' : ''}</span>}
          </div>
          <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.75 text-[.845rem]">
            <dt className="font-semibold text-ink-3">Judul</dt><dd className="m-0 font-semibold">{d.judul}</dd>
            <dt className="font-semibold text-ink-3">Pengusul</dt><dd className="m-0 font-semibold">{[d.pengusul, d.institusi].filter(Boolean).join(' · ')}</dd>
            <dt className="font-semibold text-ink-3">Skema</dt><dd className="m-0 font-semibold">{d.skema || '-'}</dd>
            <dt className="font-semibold text-ink-3">Bidang</dt><dd className="m-0 font-semibold">{d.bidang || '-'}</dd>
            <dt className="font-semibold text-ink-3">Lokasi</dt><dd className="m-0 font-semibold">{d.alamat || d.lokasi || '-'}</dd>
            <dt className="font-semibold text-ink-3">Usulan dana</dt><dd className="m-0 font-semibold">{d.dana ? rupiah(d.dana) : '-'}</dd>
            <dt className="font-semibold text-ink-3">Sasaran RPJMD</dt><dd className="m-0 font-semibold">{d.rpjmd || '-'}</dd>
            <dt className="font-semibold text-ink-3">Mitra sasaran</dt><dd className="m-0 font-semibold">{[d.targetMitra, d.mitra].filter(Boolean).join(' · ') || '-'}</dd>
            <dt className="font-semibold text-ink-3">Proposal</dt>
            <dd className="m-0 font-semibold">{d.berkas ? <a href={d.berkas} target="_blank" rel="noopener noreferrer" className="text-maroon-800 underline">Buka PDF</a> : '-'}</dd>
          </dl>
          <h4 className="mb-1.5 text-[.9rem]">Urgensi</h4>
          <p className="mb-4 whitespace-pre-line text-[.85rem] text-ink-2">{d.tujuan || '-'}</p>
          <h4 className="mb-1.5 text-[.9rem]">Luaran</h4>
          <p className="mb-4 whitespace-pre-line text-[.85rem] text-ink-2">{d.luaran || '-'}</p>

          {d.komentar.length > 0 && (
            <>
              <h4 className="mb-1.5 text-[.9rem]">Riwayat keputusan</h4>
              <ul className="mb-4 flex list-none flex-col gap-2 p-0">
                {d.komentar.map((c) => (
                  <li key={c.id} className="rounded-lg border border-line bg-surface-1 p-3 text-[.84rem]">
                    <div className="mb-1 text-[.75rem] text-ink-3"><b className="text-ink">{c.penulis}</b> · {tanggal(c.tanggal)}{c.keputusan ? ` · ${DECISION_LABEL[c.keputusan] || c.keputusan}` : ''}</div>
                    <p className="m-0 whitespace-pre-line text-ink-2">{c.pesan}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {d.status === 'under-review' && !sayaReviewer && (
            <p className="rounded-lg bg-info-bg px-3.5 py-3 text-[.84rem] text-[#1E3A8A]">Usulan ini sedang ditinjau oleh reviewer lain.</p>
          )}
          {d.status === 'under-review' && sayaReviewer && (
            <label className="block">
              <span className="mb-1.5 block text-[.84rem] font-semibold text-ink">Catatan untuk mitra (wajib untuk revisi atau penolakan)</span>
              <textarea className="input-base min-h-[80px]" value={catatan} onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: dokumen RAB belum sesuai standar, lengkapi dan ajukan kembali." />
            </label>
          )}
          {salah && <p role="alert" className="mt-3 text-[.82rem] font-semibold text-danger">{salah}</p>}
        </>
      )}
    </Modal>
  );
}

function UsulanMitra() {
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [slug, setSlug] = useState(null);
  const tutup = useCallback(() => setSlug(null), []);
  const { data, meta, loading, error, reload } = useStaffResearches({ page, limit: 20, status: filter });
  const list = data || [];

  return (
    <Card
      title="Usulan kolaborasi riset dari mitra"
      desc="Tinjau pengajuan, setujui menjadi riset berjalan, minta revisi, atau tolak dengan catatan."
      action={
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Saring status usulan">
          {FILTER_USULAN.map(([id, label]) => (
            <button key={id || 'semua'} type="button" onClick={() => { setFilter(id); setPage(1); }} aria-pressed={filter === id}
              className={`rounded-full border px-3 py-1.5 text-[.78rem] font-semibold transition ${
                filter === id ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'
              }`}>{label}</button>
          ))}
        </div>
      }
    >
      <AsyncState loading={loading} error={error} isEmpty={list.length === 0} onRetry={reload}
        skeleton={<SkeletonGrid count={4} className="flex flex-col gap-2" itemClassName="h-14" />}
        empty={<EmptyState icon="handshake" title="Tidak ada usulan pada status ini" />}>
        <div className={`overflow-x-auto rounded-lg border border-line ${loading ? 'opacity-60' : ''}`}>
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
              {list.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">{s.kode}</td>
                  <td className="px-4 py-3.5">
                    <div className="max-w-[320px] font-semibold text-ink">{s.judul}</div>
                    <div className="text-[.765rem] text-ink-3">{[s.pengusul, s.institusi].filter(Boolean).join(' · ')}</div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-2">{s.skema || '-'}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(s.tanggal, true)}</td>
                  <td className="px-4 py-3.5"><StatusRiset status={s.status} /></td>
                  <td className="px-4 py-3.5">
                    <button type="button" onClick={() => setSlug(s.slug)}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">Kelola</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[.82rem] text-ink-3">
          <span>Menampilkan {list.length} dari {meta?.total ?? list.length} usulan.</span>
          <Pager page={page} totalPage={meta?.total_page || 1} loading={loading} onPage={setPage} />
        </div>
      </AsyncState>

      {slug && <KelolaUsulan slug={slug} onClose={tutup} onChanged={reload} />}
    </Card>
  );
}

/* ---------------- Konten ---------------- */
function Field({ label, error, full, children }) {
  return (
    <label className={`mb-4 block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-[.84rem] font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[.78rem] font-semibold text-danger">{error}</span>}
    </label>
  );
}

function KonfirmasiHapus({ judul, nama, onClose, onConfirm }) {
  const hapus = useMutation(onConfirm);
  return (
    <Modal title={judul} onClose={onClose} footer={
      <>
        <button type="button" onClick={onClose} disabled={hapus.loading}
          className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-white disabled:opacity-50">Batal</button>
        <button type="button" onClick={() => hapus.mutate().catch(() => {})} disabled={hapus.loading}
          className="rounded-lg bg-danger px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
          {hapus.loading ? 'Menghapus…' : 'Ya, hapus'}
        </button>
      </>
    }>
      <p className="m-0 text-[.9rem] text-ink-2"><b>{nama}</b> akan dihapus dari portal.</p>
      {hapus.error && <p role="alert" className="mb-0 mt-3 text-[.84rem] font-semibold text-danger">{errorMessage(hapus.error)}</p>}
    </Modal>
  );
}

const KOSONG_DOK = { grupId: '', judul: '', tanggal: '', lokasi: '', narasi: '', video: '', foto: [] };
const MAX_FOTO = 10;

function FormDokumentasi({ data, onClose, onSaved }) {
  const isCreate = !data;
  const riset = useStaffResearches({ status: 'on-going', limit: 100 });
  const [form, setForm] = useState(data ? {
    grupId: data.grupId, judul: data.judul, tanggal: data.tanggal, lokasi: data.lokasi, narasi: data.narasi, video: data.video || '', foto: []
  } : KOSONG_DOK);
  const [errors, setErrors] = useState({});
  const simpan = useMutation((f) => (isCreate
    ? contentService.createDocumentation(f.grupId, f)
    : contentService.updateDocumentation(data.grupId, data.id, f)));
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  function tambahFoto(list) {
    const valid = Array.from(list).filter((f) => ['image/jpeg', 'image/png'].includes(f.type) && f.size <= 5 * 1024 * 1024);
    if (valid.length < list.length) setErrors((e) => ({ ...e, foto: 'Sebagian berkas dilewati: hanya JPG/PNG maksimal 5 MB.' }));
    setForm((f) => ({ ...f, foto: [...f.foto, ...valid.map((file) => ({ file, ket: '' }))].slice(0, MAX_FOTO) }));
  }

  async function submit(e) {
    e.preventDefault();
    const v = {};
    if (isCreate && !form.grupId) v.grupId = 'Pilih riset yang didokumentasikan.';
    if (!form.judul.trim()) v.judul = 'Judul wajib diisi.';
    if (form.video.trim() && !/^https?:\/\//.test(form.video.trim())) v.video = 'Tautan video harus diawali http:// atau https://';
    if (isCreate && form.foto.length === 0) v.foto = 'Unggah minimal satu foto.';
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      await simpan.mutate(form);
      onSaved(isCreate);
    } catch { /* ditampilkan di bawah */ }
  }

  const pilihan = (riset.data || []).filter((r) => r.grupId);
  return (
    <Modal title={isCreate ? 'Tambah dokumentasi' : 'Sunting dokumentasi'} wide onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="grid gap-x-4.5 sm:grid-cols-2">
          {isCreate && (
            <Field label="Riset yang didokumentasikan" error={errors.grupId} full>
              <select className="input-base" value={form.grupId} onChange={(e) => set('grupId', e.target.value)}>
                <option value="">{riset.loading ? 'Memuat riset berjalan…' : 'Pilih riset berjalan'}</option>
                {pilihan.map((r) => <option key={r.id} value={r.grupId}>{r.kode} · {r.judul}</option>)}
              </select>
            </Field>
          )}
          <Field label="Judul dokumentasi" error={errors.judul} full>
            <input className="input-base" maxLength={255} value={form.judul} onChange={(e) => set('judul', e.target.value)} />
          </Field>
          <Field label="Tanggal kegiatan">
            <input className="input-base" type="date" value={form.tanggal} onChange={(e) => set('tanggal', e.target.value)} />
          </Field>
          <Field label="Lokasi">
            <input className="input-base" maxLength={255} value={form.lokasi} onChange={(e) => set('lokasi', e.target.value)} placeholder="Contoh: Kec. Sukasada" />
          </Field>
          <Field label="Tautan video YouTube (opsional)" error={errors.video} full>
            <input className="input-base" value={form.video} onChange={(e) => set('video', e.target.value)} placeholder="https://youtu.be/…" />
          </Field>
          <Field label="Narasi pelaksanaan" full>
            <textarea className="input-base min-h-[110px]" value={form.narasi} onChange={(e) => set('narasi', e.target.value)} />
          </Field>
          {isCreate && (
            <div className="mb-4 sm:col-span-2">
              <span className="mb-1.5 block text-[.84rem] font-semibold text-ink">Foto kegiatan (JPG/PNG, maks. 5 MB, maks. {MAX_FOTO} foto)</span>
              <input type="file" accept="image/jpeg,image/png" multiple className="input-base" onChange={(e) => { tambahFoto(e.target.files); e.target.value = ''; }} />
              {form.foto.length > 0 && (
                <ul className="m-0 mt-2.5 flex list-none flex-col gap-2 p-0">
                  {form.foto.map((f, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-line p-2 text-[.82rem]">
                      <span className="min-w-[140px] flex-1 truncate font-semibold text-ink">{f.file.name}</span>
                      <input className="input-base flex-[2] py-1.5" placeholder="Keterangan foto" value={f.ket}
                        onChange={(e) => setForm((s) => ({ ...s, foto: s.foto.map((x, j) => (j === i ? { ...x, ket: e.target.value } : x)) }))} />
                      <button type="button" aria-label={`Hapus ${f.file.name}`} onClick={() => setForm((s) => ({ ...s, foto: s.foto.filter((_, j) => j !== i) }))}
                        className="rounded-md p-1.5 text-ink-3 hover:bg-danger-bg hover:text-danger"><Icon name="trash" size={15} /></button>
                    </li>
                  ))}
                </ul>
              )}
              {errors.foto && <span className="mt-1.5 block text-[.78rem] font-semibold text-danger">{errors.foto}</span>}
            </div>
          )}
        </div>
        {simpan.error && <p role="alert" className="mb-3 text-[.84rem] font-semibold text-danger">{errorMessage(simpan.error)}</p>}
        <div className="flex justify-end gap-2.5 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-1">Batal</button>
          <button type="submit" disabled={simpan.loading} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
            {simpan.loading ? 'Menyimpan…' : isCreate ? 'Simpan dokumentasi' : 'Simpan perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function KelolaDokumentasi() {
  const toast = useToast();
  const { data, loading, error, reload } = useDocumentations({ limit: 100 });
  const [form, setForm] = useState(null);
  const [hapus, setHapus] = useState(null);
  const tutupForm = useCallback(() => setForm(null), []);
  const tutupHapus = useCallback(() => setHapus(null), []);
  const list = data || [];

  return (
    <Card title="Publikasi & dokumentasi" desc="Dokumentasi pelaksanaan riset berjalan yang tampil pada halaman Galeri Kegiatan."
      action={<button type="button" onClick={() => setForm({})} className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600"><Icon name="plus" size={15} /> Tambah dokumentasi</button>}>
      <AsyncState loading={loading} error={error} isEmpty={list.length === 0} onRetry={reload}
        skeleton={<SkeletonGrid count={3} className="flex flex-col gap-2" itemClassName="h-16" />}
        empty={<EmptyState icon="camera" title="Belum ada dokumentasi" />}>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {list.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line p-3.5">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[.71rem] font-bold text-ink-2">{(d.bidang || 'Umum').split(' ')[0]}</span>
              <span className="min-w-[240px] flex-1">
                <span className="block text-[.87rem] font-semibold text-ink">{d.judul}</span>
                <span className="block text-[.76rem] text-ink-3">{tanggal(d.tanggal)} · {d.risetKode} · {d.foto.length} foto</span>
              </span>
              <button type="button" onClick={() => setForm({ data: d })} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600 hover:text-maroon-800">Sunting</button>
              <button type="button" onClick={() => setHapus(d)} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-danger hover:border-danger hover:bg-danger-bg">Hapus</button>
            </li>
          ))}
        </ul>
      </AsyncState>

      {form && (
        <FormDokumentasi data={form.data} onClose={tutupForm} onSaved={(isCreate) => {
          setForm(null);
          toast('success', isCreate ? 'Dokumentasi ditambahkan' : 'Dokumentasi diperbarui', 'Perubahan tampil di Galeri Kegiatan.');
          reload();
        }} />
      )}
      {hapus && (
        <KonfirmasiHapus judul="Hapus dokumentasi?" nama={hapus.judul} onClose={tutupHapus} onConfirm={async () => {
          await contentService.deleteDocumentation(hapus.grupId, hapus.id);
          setHapus(null);
          toast('info', 'Dokumentasi dihapus', `"${hapus.judul}" telah dihapus.`);
          reload();
        }} />
      )}
    </Card>
  );
}

const KOSONG_DANA = { nama: '', penyelenggara: '', skema: '', plafon: '', kuota: '', deadline: '', status: 'open', bidangTarget: [], syaratText: '', ket: '', situs: '', situsNama: '' };

function FormPendanaan({ data, onClose, onSaved }) {
  const isCreate = !data;
  const [form, setForm] = useState(data ? { ...data, syaratText: data.syarat.join('\n') } : KOSONG_DANA);
  const [errors, setErrors] = useState({});
  const simpan = useMutation((f) => (isCreate ? contentService.createFunding(f) : contentService.updateFunding(data.id, f)));
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  async function submit(e) {
    e.preventDefault();
    const v = validateFunding(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      const saved = await simpan.mutate(form);
      onSaved(saved, isCreate);
    } catch { /* ditampilkan di bawah */ }
  }

  return (
    <Modal title={isCreate ? 'Tambah skema pendanaan' : 'Sunting skema pendanaan'} wide onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="grid gap-x-4.5 sm:grid-cols-2">
          <Field label="Nama skema" error={errors.nama} full><input className="input-base" maxLength={255} value={form.nama} onChange={(e) => set('nama', e.target.value)} /></Field>
          <Field label="Penyelenggara" error={errors.penyelenggara}><input className="input-base" maxLength={255} value={form.penyelenggara} onChange={(e) => set('penyelenggara', e.target.value)} /></Field>
          <Field label="Kode skema" error={errors.skema}>
            <select className="input-base" value={form.skema} onChange={(e) => set('skema', e.target.value)}>
              <option value="">Pilih kode skema</option>
              {SKEMA.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </Field>
          <Field label="Plafon per judul (Rp)"><input className="input-base" inputMode="numeric" value={form.plafon} onChange={(e) => set('plafon', e.target.value.replace(/\D/g, ''))} /></Field>
          <Field label="Kuota judul"><input className="input-base" inputMode="numeric" value={form.kuota} onChange={(e) => set('kuota', e.target.value.replace(/\D/g, ''))} /></Field>
          <Field label="Tenggat" error={errors.deadline}><input className="input-base" type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} /></Field>
          <Field label="Status" error={errors.status}>
            <select className="input-base" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="open">Dibuka</option><option value="closing">Segera tutup</option><option value="soon">Akan dibuka</option>
            </select>
          </Field>
          <div className="mb-4 sm:col-span-2">
            <span className="mb-1.5 block text-[.84rem] font-semibold text-ink">Bidang sasaran</span>
            <div className="flex flex-wrap gap-2">
              {BIDANG.map((b) => (
                <label key={b.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[.8rem] ${form.bidangTarget.includes(b.id) ? 'border-maroon-800 bg-maroon-50' : 'border-line-strong'}`}>
                  <input type="checkbox" className="accent-maroon-800" checked={form.bidangTarget.includes(b.id)}
                    onChange={() => set('bidangTarget', form.bidangTarget.includes(b.id) ? form.bidangTarget.filter((x) => x !== b.id) : [...form.bidangTarget, b.id])} />
                  {b.nama.split(' ')[0]}
                </label>
              ))}
            </div>
          </div>
          <Field label="Syarat (satu per baris)" full><textarea className="input-base min-h-[90px]" value={form.syaratText} onChange={(e) => set('syaratText', e.target.value)} /></Field>
          <Field label="Keterangan" full><textarea className="input-base min-h-[70px]" value={form.ket} onChange={(e) => set('ket', e.target.value)} /></Field>
          <Field label="Situs penyelenggara" error={errors.situs}><input className="input-base" value={form.situs} onChange={(e) => set('situs', e.target.value)} placeholder="https://…" /></Field>
          <Field label="Nama situs"><input className="input-base" value={form.situsNama} onChange={(e) => set('situsNama', e.target.value)} /></Field>
        </div>
        {simpan.error && <p role="alert" className="mb-3 text-[.84rem] font-semibold text-danger">{errorMessage(simpan.error)}</p>}
        <div className="flex justify-end gap-2.5 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-1">Batal</button>
          <button type="submit" disabled={simpan.loading} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
            {simpan.loading ? 'Menyimpan…' : isCreate ? 'Tambahkan skema' : 'Simpan perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function KelolaPendanaan() {
  const toast = useToast();
  const { data, loading, error, reload } = useFunding();
  const [form, setForm] = useState(null);
  const [hapus, setHapus] = useState(null);
  const tutupForm = useCallback(() => setForm(null), []);
  const tutupHapus = useCallback(() => setHapus(null), []);
  const list = data || [];

  return (
    <Card title="Skema pendanaan" desc="Atur kuota, plafon, dan tenggat setiap skema hibah."
      action={<button type="button" onClick={() => setForm({})} className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600"><Icon name="plus" size={15} /> Tambah skema</button>}>
      <AsyncState loading={loading} error={error} isEmpty={list.length === 0} onRetry={reload}
        skeleton={<SkeletonGrid count={3} className="flex flex-col gap-2" itemClassName="h-14" />}
        empty={<EmptyState icon="money" title="Belum ada skema pendanaan" />}>
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
              {list.map((f) => (
                <tr key={f.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                  <td className="px-4 py-3.5"><div className="font-semibold text-ink">{f.nama}</div><div className="text-[.765rem] text-ink-3">{f.penyelenggara}</div></td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{rupiahRingkas(f.plafon)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{f.kuota}</td>
                  <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(f.deadline, true)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${
                      f.status === 'open' ? 'bg-success-bg text-success' : f.status === 'closing' ? 'bg-danger-bg text-danger' : 'bg-info-bg text-info'
                    }`}>{f.status === 'open' ? 'Dibuka' : f.status === 'closing' ? 'Segera tutup' : 'Akan dibuka'}</span>
                  </td>
                  <td className="flex flex-wrap gap-2 px-4 py-3.5">
                    <button type="button" onClick={() => setForm({ data: f })} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600 hover:text-maroon-800">Sunting</button>
                    <button type="button" onClick={() => setHapus(f)} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-danger hover:border-danger hover:bg-danger-bg">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncState>

      {form && (
        <FormPendanaan data={form.data} onClose={tutupForm} onSaved={(f, isCreate) => {
          setForm(null);
          toast('success', isCreate ? 'Skema ditambahkan' : 'Skema diperbarui', `"${f.nama}" tayang pada halaman Peluang Pendanaan.`);
          reload();
        }} />
      )}
      {hapus && (
        <KonfirmasiHapus judul="Hapus skema pendanaan?" nama={hapus.nama} onClose={tutupHapus} onConfirm={async () => {
          await contentService.deleteFunding(hapus.id);
          setHapus(null);
          toast('info', 'Skema dihapus', `"${hapus.nama}" telah dihapus.`);
          reload();
        }} />
      )}
    </Card>
  );
}

function KelolaBerita() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null); // { id?: string }
  const [hapus, setHapus] = useState(null);
  const cari = useDebounce(q.trim(), 400);

  const berita = useAdminNews({ page, limit: 20, q: cari });
  const kategori = useNewsCategories();
  const hapusBerita = useMutation((id) => newsService.remove(id));
  const list = berita.data || [];
  const totalPage = berita.meta?.total_page || 1;

  const tutupForm = useCallback(() => setForm(null), []);
  const resetHapus = hapusBerita.reset;
  const tutupHapus = useCallback(() => { setHapus(null); resetHapus(); }, [resetHapus]);

  function tersimpan(n, isCreate) {
    setForm(null);
    toast('success', isCreate ? 'Berita ditambahkan' : 'Berita diperbarui',
      n.status === 'published' ? `"${n.judul}" tayang di halaman Berita & Diseminasi.` : `"${n.judul}" disimpan sebagai draf.`);
    berita.reload();
  }

  async function konfirmasiHapus() {
    try {
      await hapusBerita.mutate(hapus.id);
      toast('info', 'Berita dihapus', `"${hapus.judul}" telah dihapus dari portal.`);
      setHapus(null);
      berita.reload();
    } catch {
      /* pesan error ditampilkan di modal */
    }
  }

  return (
    <Card title="Berita & diseminasi" desc="Kelola kabar yang tampil pada beranda dan halaman Berita. Data tersimpan di server."
      action={
        <div className="flex flex-wrap gap-2">
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Cari judul…"
            className="input-base w-auto min-w-[200px]" aria-label="Cari berita" />
          <button type="button" onClick={() => setForm({})} disabled={!kategori.data}
            title={kategori.error ? 'Kategori gagal dimuat' : undefined}
            className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
            <Icon name="plus" size={15} /> Tulis berita
          </button>
        </div>
      }>
      <AsyncState
        loading={berita.loading}
        error={berita.error}
        isEmpty={list.length === 0}
        onRetry={berita.reload}
        skeleton={<SkeletonGrid count={4} className="flex flex-col gap-2" itemClassName="h-16" />}
        empty={<EmptyState icon="doc" title={cari ? 'Tidak ada berita yang cocok' : 'Belum ada berita'} text={cari ? undefined : 'Klik "Tulis berita" untuk menambahkan kabar pertama.'} />}
      >
        <ul className={`m-0 flex list-none flex-col gap-2 p-0 ${berita.loading ? 'opacity-60' : ''}`} aria-busy={berita.loading}>
          {list.map((n) => (
            <li key={n.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line p-3.5">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[.71rem] font-bold text-ink-2">{n.kategori}</span>
              <span className={`rounded-full px-2.5 py-1 text-[.71rem] font-bold ${n.status === 'published' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                {NEWS_STATUS[n.status] || n.status}
              </span>
              <span className="min-w-[240px] flex-1">
                <span className="block text-[.87rem] font-semibold text-ink">{n.judul}</span>
                <span className="block text-[.76rem] text-ink-3">{tanggal(n.tanggal)} · {n.penulis}</span>
              </span>
              <button type="button" onClick={() => setForm({ id: n.id })} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600 hover:text-maroon-800">Sunting</button>
              <button type="button" onClick={() => setHapus(n)}
                className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-danger hover:border-danger hover:bg-danger-bg">Hapus</button>
            </li>
          ))}
        </ul>
        {totalPage > 1 && (
          <div className="mt-3 flex items-center justify-end gap-2 text-[.82rem] text-ink-3">
            <button type="button" disabled={page <= 1 || berita.loading} onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-line-strong px-3 py-1.5 font-semibold text-ink-2 disabled:opacity-40">←</button>
            Halaman {page} / {totalPage}
            <button type="button" disabled={page >= totalPage || berita.loading} onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-line-strong px-3 py-1.5 font-semibold text-ink-2 disabled:opacity-40">→</button>
          </div>
        )}
      </AsyncState>

      {form && (
        <NewsFormModal newsId={form.id} categories={kategori.data || []} onClose={tutupForm} onSaved={tersimpan} />
      )}

      {hapus && (
        <Modal title="Hapus berita?" onClose={tutupHapus} footer={
          <>
            <button type="button" onClick={tutupHapus} disabled={hapusBerita.loading}
              className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-white disabled:opacity-50">Batal</button>
            <button type="button" onClick={konfirmasiHapus} disabled={hapusBerita.loading}
              className="rounded-lg bg-danger px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
              {hapusBerita.loading ? 'Menghapus…' : 'Ya, hapus'}
            </button>
          </>
        }>
          <p className="m-0 text-[.9rem] text-ink-2">Berita <b>{hapus.judul}</b> akan dihapus dari portal.</p>
          {hapusBerita.error && (
            <p role="alert" className="mt-3 mb-0 text-[.84rem] font-semibold text-danger">{errorMessage(hapusBerita.error)}</p>
          )}
        </Modal>
      )}
    </Card>
  );
}

function Konten() {
  const { user } = useAuth();
  const admin = user.backendRole === 'admin';
  return (
    <div className="flex flex-col gap-5">
      <KelolaBerita />
      {admin && <KelolaDokumentasi />}
      {admin && <KelolaPendanaan />}
    </div>
  );
}

/* ---------------- Pengaturan ---------------- */
const TEKS_SITUS = [
  ['site_name', 'Nama situs', 'text'],
  ['tagline', 'Tagline', 'text'],
  ['contact_email', 'Surel resmi', 'email'],
  ['contact_phone', 'Telepon', 'tel']
];
const SAKLAR = [
  ['batch_open', 'Batch pengajuan riset dibuka', 'Ketika nonaktif, server menolak pengajuan riset baru.'],
  ['registration_open', 'Pendaftaran akun mandiri', 'Ketika nonaktif, server menolak pendaftaran akun baru.'],
  ['maintenance_mode', 'Mode pemeliharaan', 'Tampilkan pemberitahuan pemeliharaan kepada pengunjung publik.']
];
const ANGKA = [
  ['stat_publikasi', 'Publikasi & luaran ilmiah'],
  ['stat_hki', 'HKI & paten terdaftar'],
  ['stat_desa_terdampak', 'Desa/kelurahan terdampak'],
  ['stat_adopsi_kebijakan', 'Rekomendasi diadopsi'],
  ['stat_policy_brief', 'Policy brief tersedia']
];

function FormPengaturan({ awal, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() => ({
    ...awal,
    ...Object.fromEntries(SAKLAR.map(([k]) => [k, awal[k] === 'true']))
  }));
  const simpan = useMutation((values) => contentService.saveSettings(values));
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    const payload = {};
    TEKS_SITUS.forEach(([k]) => { payload[k] = String(form[k] || '').trim(); });
    payload.address = String(form.address || '').trim();
    SAKLAR.forEach(([k]) => { payload[k] = !!form[k]; });
    ANGKA.forEach(([k]) => { payload[k] = Number(String(form[k] || '0').replace(/\D/g, '')) || 0; });
    try {
      await simpan.mutate(payload);
      toast('success', 'Pengaturan disimpan', 'Perubahan tersimpan di server dan langsung berlaku.');
      onSaved();
    } catch { /* ditampilkan di bawah */ }
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-5">
      <Card title="Identitas situs" desc="Nama dan kontak yang tampil pada header serta footer portal.">
        <div className="grid gap-x-5 sm:grid-cols-2">
          {TEKS_SITUS.map(([k, l, t]) => (
            <Field key={k} label={l}><input className="input-base" type={t} value={form[k] || ''} onChange={(e) => set(k, e.target.value)} /></Field>
          ))}
          <Field label="Alamat kantor" full><textarea className="input-base min-h-[70px]" value={form.address || ''} onChange={(e) => set('address', e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Kendali portal" desc="Saklar ini ditegakkan oleh server, bukan hanya tampilan.">
        <div className="flex flex-col gap-2.5">
          {SAKLAR.map(([k, l, s]) => (
            <label key={k} className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[.86rem] transition ${form[k] ? 'border-maroon-800 bg-maroon-50' : 'border-line hover:bg-surface-1'}`}>
              <input type="checkbox" className="mt-0.5 h-4 w-4 flex-none accent-maroon-800" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} />
              <span><span className="block font-semibold text-ink">{l}</span><span className="block text-[.78rem] text-ink-3">{s}</span></span>
            </label>
          ))}
        </div>
      </Card>

      <Card title="Angka capaian" desc="Angka yang tidak dapat dihitung otomatis dari basis data dan tampil pada beranda.">
        <div className="grid gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
          {ANGKA.map(([k, l]) => (
            <Field key={k} label={l}><input className="input-base" inputMode="numeric" value={form[k] || ''} onChange={(e) => set(k, e.target.value.replace(/\D/g, ''))} /></Field>
          ))}
        </div>
      </Card>

      {simpan.error && <p role="alert" className="m-0 text-[.86rem] font-semibold text-danger">{errorMessage(simpan.error)}</p>}
      <div>
        <button type="submit" disabled={simpan.loading} className="rounded-lg bg-maroon-800 px-6 py-3 text-[.92rem] font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
          {simpan.loading ? 'Menyimpan…' : 'Simpan pengaturan'}
        </button>
      </div>
    </form>
  );
}

function Pengaturan() {
  const { data, loading, error, reload } = useSettings();
  if (!data) {
    return error
      ? <ErrorState error={error} onRetry={reload} title="Pengaturan gagal dimuat" />
      : <SkeletonGrid count={3} className="flex flex-col gap-5" itemClassName="h-40" />;
  }
  return <FormPengaturan key={loading ? 'muat' : 'siap'} awal={data} onSaved={reload} />;
}

/* ---------------- Shell ---------------- */
const JUDUL = {
  ringkasan: ['Ringkasan portal', 'Pantauan menyeluruh ekosistem riset dan aktivitas portal'],
  monev: ['Monitoring & Evaluasi', 'Review tindak lanjut kajian dan pemantauan kinerja seluruh OPD'],
  pengguna: ['Manajemen pengguna', 'Verifikasi dan kelola akun mitra serta perangkat daerah'],
  usulan: ['Usulan riset mitra', 'Verifikasi, setujui, atau tolak pengajuan kolaborasi riset dari mitra'],
  riset: ['Katalog riset', 'Seluruh judul riset dalam basis data BRIDA'],
  konten: ['Berita & publikasi', 'Kelola konten yang tampil di portal publik'],
  pengaturan: ['Pengaturan situs', 'Identitas, kontak, dan kendali portal']
};

// Menu yang boleh diakses per role backend; endpoint tetap divalidasi di server.
const MENU_PER_ROLE = {
  admin: null,
  reviewer: ['ringkasan', 'usulan', 'riset'],
  'media-brida': ['ringkasan', 'konten']
};

function PendingBadge({ onCount }) {
  const { meta } = useStaffResearches({ status: 'pending', limit: 1 });
  const total = meta?.total || 0;
  useEffect(() => { onCount(total); }, [total, onCount]);
  return null;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const izin = MENU_PER_ROLE[user.backendRole];
  const tampil = izin === undefined ? MENU_PER_ROLE.admin : izin;
  const bolehReview = !tampil || tampil.includes('usulan');
  const [active, setActive] = useState('ringkasan');
  const [pendingUsulan, setPendingUsulan] = useState(0);
  const [judul, sub] = JUDUL[active];

  const menu = MENU.filter((m) => !tampil || tampil.includes(m.id)).map((m) => {
    if (m.id === 'usulan' && pendingUsulan > 0) return { ...m, badge: pendingUsulan };
    return m;
  });

  return (
    <DashboardLayout menu={menu} active={active} onSelect={setActive} title={judul} subtitle={sub}>
      {bolehReview && <PendingBadge onCount={setPendingUsulan} />}
      {active === 'ringkasan' && <Ringkasan />}
      {active === 'monev' && <MonevModule />}
      {active === 'pengguna' && <Pengguna />}
      {active === 'usulan' && <UsulanMitra />}
      {active === 'riset' && <KatalogRiset />}
      {active === 'konten' && <Konten />}
      {active === 'pengaturan' && <Pengaturan />}
    </DashboardLayout>
  );
}
