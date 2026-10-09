import { useMemo, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { useResearchDetail } from '../../hooks/useResearch.js';
import { RISET, BIDANG, MILESTONES } from '../../data/singaData.js';
import { kecById, rupiah, rupiahRingkas, skemaById, statusMeta, tanggal } from '../../lib/format.js';

const API_STATUS = {
  pending: { label: 'Menunggu verifikasi', badge: 'bg-warning-bg text-warning', bar: 'from-amber-800 to-warning' },
  'under-review': { label: 'Sedang ditinjau', badge: 'bg-info-bg text-info', bar: 'from-blue-700 to-info' },
  revision: { label: 'Perlu revisi', badge: 'bg-warning-bg text-warning', bar: 'from-amber-800 to-warning' },
  rejected: { label: 'Ditolak', badge: 'bg-danger-bg text-danger', bar: 'from-red-800 to-danger' },
  'on-going': { label: 'Berjalan', badge: 'bg-success-bg text-success', bar: 'from-emerald-700 to-success' },
  approved: { label: 'Disetujui', badge: 'bg-success-bg text-success', bar: 'from-emerald-700 to-success' }
};

function researchStatus(riset) {
  return API_STATUS[riset.status] || statusMeta(riset.status);
}

function researchCode(riset) {
  return riset.kode || riset.id || '-';
}

function researchField(riset) {
  return BIDANG.find((item) => item.id === (riset.bidangId || riset.bidang) || item.nama === riset.bidang)
    || { nama: riset.bidang || '-', warna: '#6B7280' };
}

function researchPartners(riset) {
  if (Array.isArray(riset.mitraList)) return riset.mitraList;
  if (Array.isArray(riset.mitra)) return riset.mitra;
  return riset.mitra ? [riset.mitra] : [];
}

function researchOutputs(riset) {
  if (Array.isArray(riset.luaranList)) return riset.luaranList;
  if (Array.isArray(riset.luaran)) return riset.luaran;
  return String(riset.luaran || '').split(/\n|;\s*/).map((item) => item.trim()).filter(Boolean);
}

function numericValue(value) {
  return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
}

function researchProgress(riset) {
  return numericValue(riset.progress);
}

/** Data VPS menyimpan nilai usulan di `dana`; data contoh memakai `anggaran`. */
function researchBudget(riset) {
  return numericValue(riset.anggaran ?? riset.dana);
}

function researchCategoryId(riset) {
  return riset.bidangId || BIDANG.find((item) => item.id === riset.bidang || item.nama === riset.bidang)?.id || '';
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-[.72rem] font-semibold text-ink-3">{label}</dt>
      <dd className="m-0 mt-1 text-[.84rem] font-semibold leading-5 text-ink">{value || '-'}</dd>
    </div>
  );
}

function RisetDetail({ riset }) {
  // Detail internal dari backend memuat grup & anggota tim; data contoh (tanpa slug) dilewati.
  const { data: detail, loading: memuatTim } = useResearchDetail(riset.slug);
  const bidang = researchField(riset);
  const status = researchStatus(riset);
  const progress = researchProgress(riset);
  const anggaran = researchBudget(riset);
  const terserap = numericValue(riset.terserap);
  const mitra = researchPartners(riset);
  const luaran = researchOutputs(riset);
  const serapan = anggaran && terserap !== null ? Math.round((terserap / anggaran) * 100) : null;
  const lokasi = riset.kecamatan ? kecById(riset.kecamatan).nama : riset.lokasi || riset.alamat;
  const grup = detail?.grup || riset.grup;
  const tim = Array.isArray(grup?.anggota)
    ? grup.anggota
    : (Array.isArray(riset.tim) ? riset.tim.map((nama) => ({ nama })) : []);

  return (
    <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2.5 py-1 text-[.71rem] font-bold" style={{ background: `${bidang.warna}18`, color: bidang.warna }}>{bidang.nama}</span>
            <span className={`rounded-full px-2.5 py-1 text-[.71rem] font-bold ${status.badge}`}>{status.label}</span>
          </div>
          <p className="m-0 text-[.75rem] font-semibold text-ink-3">{researchCode(riset)} · {riset.tahun ? `Tahun ${riset.tahun}` : riset.periode || 'Periode belum tersedia'}</p>
          <h2 className="mb-0 mt-1 text-[1.12rem] leading-6">{riset.judul}</h2>
          <p className="mb-0 mt-1.5 text-[.8rem] text-ink-3">{riset.peneliti || riset.pengusul || '-'} · {riset.institusi || '-'}{lokasi ? ` · ${riset.kecamatan ? 'Kec. ' : ''}${lokasi}` : ''}</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Nilai kontrak', value: anggaran !== null ? rupiahRingkas(anggaran) : riset.dana || 'Belum tersedia' },
          { label: 'Realisasi serapan', value: serapan !== null ? `${rupiahRingkas(terserap)} · ${serapan}%` : 'Belum tersedia' },
          { label: 'Capaian kegiatan', value: progress !== null ? `${progress}%` : 'Belum tersedia' },
          { label: 'Tahap berjalan', value: riset.tahap ? `${riset.tahap} dari ${MILESTONES.length}` : 'Belum tersedia' }
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-line bg-surface-1 px-3.5 py-3">
            <div className="text-[.72rem] font-semibold text-ink-3">{item.label}</div>
            <div className="mt-1 text-[.94rem] font-extrabold tabular-nums text-ink">{item.value}</div>
          </div>
        ))}
      </div>

      {progress !== null && <div className="mb-5">
        <div className="mb-1.5 flex items-center justify-between text-[.76rem]">
          <span className="font-semibold text-ink-2">Progres kegiatan</span>
          <span className="font-bold tabular-nums text-ink">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`Progres ${riset.judul}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
          <div className={`h-full rounded-full bg-linear-to-r ${status.bar}`} style={{ width: `${progress}%` }} />
        </div>
      </div>}

      <dl className="mb-5 grid gap-4 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Skema" value={skemaById(riset.skema)?.nama || riset.skema} />
        <Field label="Sumber dana" value={riset.sumber} />
        <Field label="Nomor kontrak" value={riset.kontrak} />
        <Field label="Periode" value={riset.mulai && riset.selesai ? `${tanggal(riset.mulai, true)} – ${tanggal(riset.selesai, true)}` : riset.periode} />
        <Field label="Sasaran RPJMD" value={riset.rpjmd} />
        <Field label="Target mitra" value={riset.targetMitra} />
      </dl>

      <div className="mb-5">
        <h3 className="mb-2 text-[.9rem]">Tahapan pelaksanaan</h3>
        {riset.tahap ? (
          <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.map((milestone) => {
              const state = milestone.n < riset.tahap ? 'done' : milestone.n === riset.tahap ? 'active' : 'upcoming';
              return (
                <li key={milestone.n} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${state === 'done' ? 'border-success-bg bg-success-bg' : state === 'active' ? 'border-maroon-100 bg-maroon-50' : 'border-line bg-white'}`}>
                  <span className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[.7rem] font-bold ${state === 'done' ? 'bg-success text-white' : state === 'active' ? 'bg-maroon-800 text-white' : 'bg-surface-2 text-ink-3'}`}>
                    {state === 'done' ? '✓' : milestone.n}
                  </span>
                  <span className={`text-[.76rem] font-semibold ${state === 'upcoming' ? 'text-ink-3' : 'text-ink'}`}>{milestone.short}</span>
                </li>
              );
            })}
          </ol>
        ) : <p className="m-0 text-[.8rem] text-ink-3">Tahapan belum tersedia pada data direktori riset.</p>}
      </div>

      <div className="grid gap-5 border-t border-line pt-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-1.5 text-[.9rem]">Ringkasan kajian</h3>
          <p className="m-0 text-[.82rem] leading-6 text-ink-2">{riset.abstrak || riset.tujuan || '-'}</p>
        </div>
        <div>
          <h3 className="mb-1.5 text-[.9rem]">Metodologi</h3>
          <p className="m-0 text-[.82rem] leading-6 text-ink-2">{riset.metodologi || riset.signifikansi || '-'}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 border-t border-line pt-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-[.9rem]">Luaran yang ditargetkan</h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {(luaran.length ? luaran : ['Belum tersedia']).map((item) => <li key={item} className="rounded-lg border border-line px-3 py-2 text-[.8rem] text-ink-2">{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-[.9rem]">Mitra pelaksana</h3>
          <div className="flex flex-wrap gap-2">
            {mitra.length ? mitra.map((item) => <span key={item} className="rounded-full bg-surface-1 px-3 py-1.5 text-[.76rem] font-semibold text-ink-2">{item}</span>) : <span className="text-[.8rem] text-ink-3">Belum tersedia</span>}
          </div>
          {memuatTim && !tim.length && <p className="mb-0 mt-5 text-[.8rem] text-ink-3">Memuat tim peneliti…</p>}
          {tim.length > 0 && (
            <>
              <h3 className="mb-2 mt-5 text-[.9rem]">Tim peneliti</h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {tim.map((anggota, index) => {
                  const nama = typeof anggota === 'string' ? anggota : anggota.nama;
                  return <li key={`${nama}-${index}`} className="text-[.8rem] text-ink-2">{nama}{anggota.institusi ? ` · ${anggota.institusi}` : ''}{anggota.peran ? ` · ${anggota.peran}` : ''}</li>;
                })}
              </ul>
            </>
          )}
          <h3 className="mb-1.5 mt-5 text-[.9rem]">Dampak yang dilaporkan</h3>
          <p className="m-0 text-[.82rem] leading-6 text-ink-2">{riset.dampak || riset.penerimaManfaat || '-'}</p>
          {riset.catatanKendala && <p className="mb-0 mt-3 rounded-lg bg-warning-bg px-3 py-2.5 text-[.8rem] leading-5 text-warning"><b>Catatan kendala:</b> {riset.catatanKendala}</p>}
        </div>
      </div>
    </section>
  );
}

export default function RisetMonitoringModule({ risetData = RISET }) {
  const [filters, setFilters] = useState({ query: '', tahun: '', bidang: '', status: '' });
  const [selectedId, setSelectedId] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const tahunOptions = useMemo(() => [...new Set(risetData.map((item) => item.tahun).filter(Boolean))].sort((a, b) => b - a), [risetData]);
  const statusOptions = useMemo(() => [...new Set(risetData.map((item) => item.status).filter(Boolean))], [risetData]);

  const filteredRiset = useMemo(() => risetData.filter((riset) => {
    const query = filters.query.toLowerCase();
    if (query && !`${researchCode(riset)} ${riset.judul} ${riset.peneliti || riset.pengusul} ${riset.institusi} ${researchPartners(riset).join(' ')}`.toLowerCase().includes(query)) return false;
    if (filters.tahun && String(riset.tahun) !== filters.tahun) return false;
    if (filters.bidang && researchCategoryId(riset) !== filters.bidang) return false;
    if (filters.status && riset.status !== filters.status) return false;
    return true;
  }), [risetData, filters]);

  const sortedRiset = useMemo(() => [...filteredRiset].sort((a, b) =>
    (sortDirection === 'asc' ? 1 : -1) * researchCode(a).localeCompare(researchCode(b))
  ), [filteredRiset, sortDirection]);

  const selected = selectedId ? risetData.find((riset) => riset.id === selectedId) : null;
  const aktif = risetData.filter((riset) => !['selesai', 'rejected'].includes(riset.status)).length;
  const perhatian = risetData.filter((riset) => ['warning', 'delayed', 'pending', 'revision', 'rejected'].includes(riset.status)).length;
  const progressValues = risetData.map(researchProgress).filter((value) => value !== null);
  const rerataProgress = progressValues.length ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length) : null;
  const anggaranValues = risetData.map(researchBudget).filter((value) => value !== null);
  const terserapValues = risetData.map((riset) => numericValue(riset.terserap)).filter((value) => value !== null);
  const serapanTotal = terserapValues.reduce((sum, value) => sum + value, 0);
  const anggaranTotal = anggaranValues.reduce((sum, value) => sum + value, 0);

  if (selected) {
    return (
      <div className="flex flex-col gap-4">
        <button type="button" onClick={() => setSelectedId(null)} className="inline-flex w-fit items-center gap-2 rounded-lg border border-line-strong bg-white px-3.5 py-2 text-[.82rem] font-semibold text-ink-2 transition hover:border-maroon-600 hover:text-maroon-800">
          <Icon name="arrow" size={15} className="rotate-180" />
          Kembali ke daftar
        </button>
        <RisetDetail riset={selected} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { label: 'Total riset', value: risetData.length, detail: 'Di direktori daerah' },
          { label: 'Sedang berjalan', value: aktif, detail: 'Belum selesai atau ditolak' },
          { label: 'Perlu perhatian', value: perhatian, detail: 'Menunggu, revisi, atau ditolak' },
          { label: 'Rerata progres', value: rerataProgress === null ? '-' : `${rerataProgress}%`, detail: anggaranTotal ? (terserapValues.length ? `${rupiahRingkas(serapanTotal)} terserap dari ${rupiahRingkas(anggaranTotal)}` : `Total nilai usulan ${rupiahRingkas(anggaranTotal)}`) : 'Data anggaran belum tersedia' }
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-line bg-white p-4.5">
            <div className="text-[.78rem] font-semibold text-ink-3">{metric.label}</div>
            <div className="mt-1 text-[1.75rem] font-extrabold leading-tight text-ink">{metric.value}</div>
            <div className="mt-0.5 text-[.755rem] text-ink-3">{metric.detail}</div>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-[1rem]">Direktori riset daerah</h2>
            <p className="m-0 mt-1 text-[.82rem] text-ink-3">Pantau progres, anggaran, tahap, luaran, dan mitra setiap kajian.</p>
          </div>
          <button type="button" onClick={() => setFilters({ query: '', tahun: '', bidang: '', status: '' })} className="rounded-lg px-3 py-1.5 text-[.8rem] font-semibold text-ink-2 hover:bg-surface-1">Atur ulang</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="search" value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Cari judul, ID, peneliti, mitra…" className="input-base" aria-label="Cari direktori riset" />
          <select value={filters.tahun} onChange={(event) => setFilters((current) => ({ ...current, tahun: event.target.value }))} className="input-base" aria-label="Filter tahun riset">
            <option value="">Semua tahun</option>
            {tahunOptions.map((tahun) => <option key={tahun} value={tahun}>{tahun}</option>)}
          </select>
          <select value={filters.bidang} onChange={(event) => setFilters((current) => ({ ...current, bidang: event.target.value }))} className="input-base" aria-label="Filter bidang riset">
            <option value="">Semua bidang</option>
            {BIDANG.map((bidang) => <option key={bidang.id} value={bidang.id}>{bidang.nama}</option>)}
          </select>
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="input-base" aria-label="Filter status riset">
            <option value="">Semua status</option>
            {statusOptions.map((status) => <option key={status} value={status}>{researchStatus({ status }).label}</option>)}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 className="m-0 text-[.98rem]">Daftar pemantauan riset</h2>
            <p className="m-0 mt-0.5 text-[.76rem] text-ink-3">Pilih baris untuk melihat ringkasan monitoring.</p>
          </div>
          <button type="button" onClick={() => setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')} className="rounded-lg border border-line-strong px-3 py-1.5 text-[.77rem] font-semibold text-ink-2 hover:bg-surface-1">Urut ID {sortDirection === 'asc' ? '↑' : '↓'}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-240 border-collapse text-[.82rem]">
            <caption className="sr-only">Monitoring direktori riset daerah</caption>
            <thead>
              <tr className="border-b border-line bg-surface-1">
                {['ID / Judul kajian', 'Peneliti / Institusi', 'Mitra OPD', 'Tahun', 'Anggaran / Serapan', 'Progres', 'Status'].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.7rem] font-bold uppercase tracking-wide text-ink-3">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {sortedRiset.map((riset) => {
                const status = researchStatus(riset);
                const anggaran = researchBudget(riset);
                const terserap = numericValue(riset.terserap);
                const serapan = anggaran && terserap !== null ? Math.round((terserap / anggaran) * 100) : null;
                const progress = researchProgress(riset);
                const mitra = researchPartners(riset);
                return (
                  <tr key={riset.id} onClick={() => setSelectedId(riset.id)} className="cursor-pointer border-b border-line transition last:border-0 hover:bg-surface-1">
                    <td className="px-4 py-3.5"><div className="font-bold text-ink">{researchCode(riset)}</div><div className="max-w-85 font-semibold leading-5 text-ink-2">{riset.judul}</div></td>
                    <td className="px-4 py-3.5"><div className="font-semibold text-ink-2">{riset.peneliti || riset.pengusul || '-'}</div><div className="text-[.75rem] text-ink-3">{riset.institusi || '-'}</div></td>
                    <td className="px-4 py-3.5"><div className="max-w-55 text-ink-2">{mitra.length ? mitra.join(', ') : riset.targetMitra || '-'}</div></td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-2">{riset.tahun}</td>
                    <td className="px-4 py-3.5"><div className="whitespace-nowrap font-semibold text-ink-2">{anggaran !== null ? rupiah(anggaran) : riset.dana || '-'}</div><div className="text-[.75rem] text-ink-3">Serapan {serapan === null ? 'Belum tersedia' : `${serapan}%`}</div></td>
                    <td className="px-4 py-3.5">{progress === null ? <span className="text-ink-3">Belum tersedia</span> : <div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-line"><div className={`h-full rounded-full bg-linear-to-r ${status.bar}`} style={{ width: `${progress}%` }} /></div><span className="font-semibold tabular-nums text-ink-2">{progress}%</span></div>}</td>
                    <td className="px-4 py-3.5"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[.7rem] font-bold ${status.badge}`}>{status.label}</span></td>
                  </tr>
                );
              })}
              {sortedRiset.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-ink-3">Tidak ada riset yang sesuai filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="m-0 px-4 py-3 text-[.78rem] text-ink-3">Menampilkan {sortedRiset.length} dari {risetData.length} kajian.</p>
      </section>

    </div>
  );
}
