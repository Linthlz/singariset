import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import KelompokRiset from './KelompokRiset.jsx';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/Modal.jsx';
import AsyncState, { EmptyState, ErrorState, SkeletonGrid } from '../../components/AsyncState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useMutation } from '../../hooks/useData.js';
import { useMyResearches, useResearchDetail } from '../../hooks/useResearch.js';
import { errorMessage } from '../../services/api.js';
import { DECISION_LABEL, researchService, statusResearch } from '../../services/researchService.js';
import { rupiah, tanggal } from '../../lib/format.js';

const MENU = [
  { id: 'pengajuan', label: 'Pengajuan Riset Saya', ikon: 'flask' },
  { id: 'kelompok', label: 'Kelompok Riset', ikon: 'users' }
];

const JUDUL = {
  pengajuan: ['Dashboard Mitra', 'Monitoring pengajuan kolaborasi riset'],
  kelompok: ['Kelompok Riset', 'Tim peneliti, pembimbing BRIDA, dan dokumentasi riset berjalan']
};

const FILTER = [
  { id: '', label: 'Semua' },
  { id: 'proses', label: 'Dalam proses', match: ['pending', 'under-review', 'revision'] },
  { id: 'berjalan', label: 'Berjalan', match: ['on-going', 'approved'] },
  { id: 'ditolak', label: 'Ditolak', match: ['rejected'] }
];

const PESAN_STATUS = {
  pending: ['warning', 'clock', 'Usulan masuk antrean dan menunggu ditugaskan ke reviewer BRIDA.'],
  'under-review': ['info', 'eye', 'Usulan sedang ditelaah oleh reviewer BRIDA.'],
  revision: ['warning', 'refresh', 'Reviewer meminta revisi. Perbarui usulan Anda sesuai catatan reviewer.'],
  rejected: ['danger', 'alert', 'Usulan tidak dilanjutkan pada batch ini.'],
  'on-going': ['success', 'checkCircle', 'Usulan disetujui dan riset berjalan dalam pemantauan BRIDA.'],
  approved: ['success', 'checkCircle', 'Usulan disetujui.']
};

function Card({ title, desc, action, children }) {
  return (
    <section className="rounded-xl border border-line bg-white p-4 sm:p-5.5">
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

function StatusBadge({ status }) {
  const st = statusResearch(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.badge}`}>
      <Icon name={st.ikon} size={12} /> {st.label}
    </span>
  );
}

function FormRevisi({ d, onDone }) {
  const toast = useToast();
  const [form, setForm] = useState({ judul: d.judul, tujuan: d.tujuan, dana: d.dana, luaran: d.luaran, mitra: d.mitra });
  const [salah, setSalah] = useState('');
  const kirim = useMutation((payload) => researchService.revise(d.id, payload));
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setSalah('');
    if (!form.judul.trim() || !form.tujuan.trim() || !form.luaran.trim()) { setSalah('Judul, urgensi, dan luaran wajib diisi.'); return; }
    if (!/^\d+$/.test(String(form.dana).replace(/\D/g, '')) || !String(form.dana).replace(/\D/g, '')) { setSalah('Usulan dana harus berupa angka.'); return; }
    try {
      await kirim.mutate({
        title: form.judul.trim(), purpose: form.tujuan.trim(), fund_amount: String(form.dana).replace(/\D/g, ''),
        promised_output: form.luaran.trim(), partner_name: form.mitra.trim()
      });
      toast('success', 'Revisi terkirim', 'Usulan kembali masuk antrean reviewer.');
      onDone();
    } catch (err) {
      setSalah(errorMessage(err));
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mt-4 rounded-xl border border-warning-bg bg-[#FFFBEB] p-4">
      <h4 className="mb-3 text-[.95rem]">Perbarui usulan sesuai catatan reviewer</h4>
      {[['judul', 'Judul riset', 'input'], ['tujuan', 'Urgensi & keterhubungan dengan kebutuhan daerah', 'textarea'], ['dana', 'Usulan dana (Rp)', 'input'], ['luaran', 'Luaran yang dijanjikan', 'textarea'], ['mitra', 'Mitra spesifik', 'input']].map(([k, l, t]) => (
        <label key={k} className="mb-3 block">
          <span className="mb-1 block text-[.82rem] font-semibold text-ink">{l}</span>
          {t === 'textarea'
            ? <textarea className="input-base min-h-[90px]" value={form[k]} onChange={(e) => set(k, e.target.value)} />
            : <input className="input-base" value={form[k]} inputMode={k === 'dana' ? 'numeric' : undefined} onChange={(e) => set(k, e.target.value)} />}
        </label>
      ))}
      {salah && <p role="alert" className="mb-3 text-[.82rem] font-semibold text-danger">{salah}</p>}
      <button type="submit" disabled={kirim.loading} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
        {kirim.loading ? 'Mengirim…' : 'Kirim revisi'}
      </button>
    </form>
  );
}

function DetailUsulan({ slug, onClose, onChanged }) {
  const { data: d, loading, error, reload } = useResearchDetail(slug);
  const pesan = d && PESAN_STATUS[d.status];
  const warna = { warning: 'border-warning-bg bg-warning-bg text-[#78350F]', info: 'border-info-bg bg-info-bg text-[#1E3A8A]', danger: 'border-danger-bg bg-danger-bg text-danger', success: 'border-success-bg bg-success-bg text-[#14532D]' };

  return (
    <Modal title={d?.judul || 'Detail usulan'} wide onClose={onClose}>
      {loading && !d && <SkeletonGrid count={4} className="flex flex-col gap-3" itemClassName="h-10" />}
      {error && !d && <ErrorState compact error={error} onRetry={reload} title="Gagal memuat detail usulan" />}
      {d && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <StatusBadge status={d.status} />
            <span className="text-[.78rem] text-ink-3">No. registrasi {d.kode}{d.tanggal ? ` · Diajukan ${tanggal(d.tanggal)}` : ''}</span>
          </div>

          <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.75 text-[.845rem]">
            <dt className="font-semibold text-ink-3">Skema</dt><dd className="m-0 font-semibold">{d.skema || '-'}</dd>
            <dt className="font-semibold text-ink-3">Bidang</dt><dd className="m-0 font-semibold">{d.bidang || '-'}</dd>
            <dt className="font-semibold text-ink-3">Lokasi</dt><dd className="m-0 font-semibold">{d.lokasi || '-'}</dd>
            <dt className="font-semibold text-ink-3">Usulan dana</dt><dd className="m-0 font-semibold">{d.dana ? rupiah(d.dana) : '-'}</dd>
            <dt className="font-semibold text-ink-3">Sasaran RPJMD</dt><dd className="m-0 font-semibold">{d.rpjmd || '-'}</dd>
            <dt className="font-semibold text-ink-3">Mitra sasaran</dt><dd className="m-0 font-semibold">{[d.targetMitra, d.mitra].filter(Boolean).join(' · ') || '-'}</dd>
            <dt className="font-semibold text-ink-3">Berkas</dt>
            <dd className="m-0 font-semibold">
              {d.berkas ? <a href={d.berkas} target="_blank" rel="noopener noreferrer" className="text-maroon-800 underline">Lihat proposal (PDF)</a> : '-'}
            </dd>
          </dl>

          <h4 className="mb-2 text-[.92rem]">Urgensi</h4>
          <p className="mb-4 whitespace-pre-line text-[.86rem] leading-relaxed text-ink-2">{d.tujuan || '-'}</p>

          <h4 className="mb-2 text-[.92rem]">Luaran</h4>
          <p className="mb-4 whitespace-pre-line text-[.86rem] leading-relaxed text-ink-2">{d.luaran || '-'}</p>

          {pesan && (
            <div className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 text-[.855rem] ${warna[pesan[0]]}`}>
              <Icon name={pesan[1]} size={19} className="mt-0.5 flex-none" />
              <p className="m-0">{pesan[2]}</p>
            </div>
          )}

          {d.komentar.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-[.92rem]">Catatan reviewer</h4>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {d.komentar.map((c) => (
                  <li key={c.id} className="rounded-lg border border-line bg-surface-1 p-3 text-[.85rem]">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-[.76rem] text-ink-3">
                      <b className="text-ink">{c.penulis}</b>{c.jabatan && <span>· {c.jabatan}</span>}<span>· {tanggal(c.tanggal)}</span>
                      {c.keputusan && <span className="rounded-full bg-white px-2 py-0.5 font-bold text-ink-2">{DECISION_LABEL[c.keputusan] || c.keputusan}{c.putaran ? ` · putaran ${c.putaran}` : ''}</span>}
                    </div>
                    <p className="m-0 whitespace-pre-line text-ink-2">{c.pesan}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {d.grup && (
            <div className="mt-4 rounded-xl border border-line p-4 text-[.85rem]">
              <h4 className="mb-2 text-[.92rem]">Tim riset</h4>
              {d.grup.kodeGabung && (
                <p className="mb-2 text-ink-2">Bagikan kode gabung <b className="font-mono text-maroon-800">{d.grup.kodeGabung}</b> kepada anggota tim agar mereka dapat bergabung.</p>
              )}
              <ul className="m-0 list-none space-y-1 p-0">
                {d.grup.anggota.map((a) => <li key={a.nama} className="text-ink-2"><b className="text-ink">{a.nama}</b> · {a.institusi || '-'} · {a.peran === 'leader' ? 'Ketua' : 'Anggota'}</li>)}
              </ul>
            </div>
          )}

          {d.status === 'revision' && <FormRevisi d={d} onDone={() => { reload(); onChanged(); }} />}
        </>
      )}
    </Modal>
  );
}

function PengajuanSaya() {
  const [filter, setFilter] = useState('');
  const [slug, setSlug] = useState(null);
  const { data, loading, error, reload } = useMyResearches();
  const tutup = useCallback(() => setSlug(null), []);
  const milikSaya = data || [];
  const aktif = FILTER.find((f) => f.id === filter);
  const hits = aktif?.match ? milikSaya.filter((s) => aktif.match.includes(s.status)) : milikSaya;
  const hitung = (ids) => milikSaya.filter((s) => ids.includes(s.status)).length;

  const kpi = [
    { l: 'Total pengajuan', v: milikSaya.length },
    { l: 'Dalam proses', v: hitung(FILTER[1].match) },
    { l: 'Berjalan', v: hitung(FILTER[2].match) },
    { l: 'Ditolak', v: hitung(FILTER[3].match) }
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpi.map((k) => (
          <div key={k.l} className="rounded-xl border border-line bg-white p-4.5">
            <div className="text-[.78rem] font-semibold text-ink-3">{k.l}</div>
            <div className="mt-1 text-[1.75rem] font-extrabold leading-tight text-ink">{loading && !data ? '…' : k.v}</div>
          </div>
        ))}
      </div>

      <Card
        title="Riwayat pengajuan kolaborasi riset"
        desc="Pantau status verifikasi hingga penetapan setiap usulan yang Anda kirim."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Saring status pengajuan">
              {FILTER.map((f) => (
                <button
                  key={f.id || 'semua'} type="button" onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={`rounded-full border px-3 py-1.5 text-[.78rem] font-semibold transition ${
                    filter === f.id ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Link to="/kolaborasi" className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white no-underline hover:bg-maroon-600">
              <Icon name="plus" size={15} /> Ajukan riset baru
            </Link>
          </div>
        }
      >
        <AsyncState
          loading={loading}
          error={error}
          isEmpty={hits.length === 0}
          onRetry={reload}
          skeleton={<SkeletonGrid count={3} className="flex flex-col gap-2" itemClassName="h-14" />}
          empty={
            <EmptyState icon="flask"
              title={filter ? 'Belum ada pengajuan pada kategori ini' : 'Belum ada pengajuan riset'}
              text='Gunakan tombol "Ajukan riset baru" untuk mengirim usulan kolaborasi riset.' />
          }
        >
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[760px] border-collapse text-[.845rem]">
              <caption className="sr-only">Daftar pengajuan riset saya</caption>
              <thead>
                <tr className="border-b border-line bg-surface-1">
                  {['No. registrasi', 'Judul & skema', 'Bidang', 'Tanggal ajuan', 'Status', 'Aksi'].map((h) => (
                    <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hits.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                    <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">{s.kode}</td>
                    <td className="px-4 py-3.5">
                      <div className="max-w-[320px] font-semibold text-ink">{s.judul}</div>
                      <div className="text-[.765rem] text-ink-3">{s.skema || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-ink-2">{s.bidang.split(' ')[0] || '-'}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(s.tanggal)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3.5">
                      <button type="button" onClick={() => setSlug(s.slug)}
                        className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                        Lihat detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {hits.length} dari {milikSaya.length} pengajuan.</p>
        </AsyncState>
      </Card>

      {slug && <DetailUsulan slug={slug} onClose={tutup} onChanged={reload} />}
    </div>
  );
}

export default function MitraDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('pengajuan');
  const [judul, sub] = JUDUL[active];
  const instansi = user.instansi && user.instansi !== '-' ? `${user.instansi} · ` : '';

  return (
    <DashboardLayout menu={MENU} active={active} onSelect={setActive} title={judul} subtitle={`${instansi}${sub}`}>
      {active === 'pengajuan' && <PengajuanSaya />}
      {active === 'kelompok' && <KelompokRiset bolehGabung judulKosong="Anda belum tergabung dalam kelompok riset" />}
    </DashboardLayout>
  );
}
