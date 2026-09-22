import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import ScoreRing from '../../components/charts/ScoreRing.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { RISET, BIDANG, INDIKATOR, SKOR, BERKAS } from '../../data/singaData.js';
import { kecById, skemaById, statusMeta, rupiah, rupiahRingkas, tanggal } from '../../lib/format.js';

const TAHUN_OPTS = [...new Set(RISET.map((r) => r.tahun))].sort((a, b) => b - a);

const STATUSES = [
  { id: '', l: 'Semua status' },
  { id: 'ontrack', l: 'On Track' },
  { id: 'selesai', l: 'Selesai' }
];

function displayStatus(status) {
  return status === 'selesai' ? 'selesai' : 'ontrack';
}

function scoreTotal(skor) {
  if (!skor) return null;
  return INDIKATOR.reduce((sum, ind) => sum + (skor[ind.id] || 0) * (ind.bobot / 100), 0);
}

function ScoreMatrix({ r }) {
  const { hasRole } = useAuth();
  const toast = useToast();
  const saved = SKOR[r.id];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => {
    const base = {};
    INDIKATOR.forEach((i) => { base[i.id] = saved ? saved[i.id] : 70; });
    return base;
  });

  const total = scoreTotal(editing ? draft : saved);
  const canEdit = hasRole('admin');

  function submitScore() {
    toast('success', 'Penilaian tersimpan', `Skor akhir ${scoreTotal(draft).toFixed(1).replace('.', ',')} untuk ${r.id} dicatat pada sistem monev (prototipe, belum dikirim ke server).`);
    setEditing(false);
  }

  if (!saved && !editing) {
    return (
      <div className="flex items-center gap-3.5 rounded-xl border border-dashed border-line-strong bg-surface-1 p-4.5">
        <Icon name="clock" size={22} className="flex-none text-ink-3" />
        <div className="flex-1">
          <strong className="block text-[.88rem] text-ink">Belum ada penilaian tim pakar</strong>
          <span className="text-[.8rem] text-ink-3">Riset ini masuk antrean sidang evaluasi pada siklus monev berikutnya.</span>
        </div>
        {canEdit && (
          <button type="button" onClick={() => setEditing(true)} className="flex-none rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600">
            Mulai penilaian
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-5.5">
        <ScoreRing value={total || 0} />
        <div className="flex-1">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <h3 className="m-0 text-[1rem]">Matriks Evaluasi Kinerja</h3>
            {canEdit && !editing && (
              <button type="button" onClick={() => setEditing(true)} className="ml-auto rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                Perbarui skor
              </button>
            )}
          </div>
          {saved && !editing && <p className="m-0 text-[.83rem] text-ink-3">Dinilai oleh <b>{saved.evaluator}</b> pada {tanggal(saved.tanggal)}.</p>}
        </div>
      </div>

      <div className="divide-y divide-line">
        {INDIKATOR.map((ind) => {
          const val = editing ? draft[ind.id] : (saved ? saved[ind.id] : 0);
          return (
            <div key={ind.id} className="py-3.5 first:pt-0 last:pb-0">
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[.87rem] font-semibold text-ink">{ind.nama} <span className="font-normal text-ink-3">({ind.ket})</span></span>
                <div className="flex flex-none items-baseline gap-2">
                  <span className="text-[.74rem] font-semibold text-ink-3">Bobot {ind.bobot}%</span>
                  <span className="text-[.87rem] font-extrabold tabular-nums text-maroon-800">{val}</span>
                </div>
              </div>
              {editing ? (
                <input type="range" min="0" max="100" value={draft[ind.id]}
                  onChange={(e) => setDraft((d) => ({ ...d, [ind.id]: Number(e.target.value) }))}
                  className="w-full accent-maroon-800" aria-label={`Skor ${ind.nama}`} />
              ) : (
                <div className="h-1.75 overflow-hidden rounded-full bg-line"><div className="h-full rounded-r-[4px] bg-maroon-800" style={{ width: `${val}%` }} /></div>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-line-strong px-4 py-2 text-[.83rem] font-semibold text-ink-2 hover:bg-surface-1">Batal</button>
          <button type="button" onClick={submitScore} className="rounded-lg bg-maroon-800 px-4 py-2 text-[.83rem] font-semibold text-white hover:bg-maroon-600">Simpan penilaian</button>
        </div>
      )}

      {saved && !editing && (
        <div className="mt-4 rounded-xl border border-line bg-surface-1 p-4">
          <strong className="mb-1 block text-[.83rem] text-ink">Catatan evaluator</strong>
          <p className="m-0 text-[.85rem] text-ink-2">{saved.catatan}</p>
        </div>
      )}
    </div>
  );
}

const FILE_ICON = { pdf: 'doc', img: 'image', video: 'video' };

const MONEV_INPUTS = {
  'BRD-2025-001': {
    opd: 'Dinas Pertanian Kabupaten Buleleng',
    monitoring: 'Sudah',
    uraian: 'Rekomendasi mulai ditindaklanjuti melalui pemasangan 12 node sensor pada tiga tempek Subak Padanggalak. Data debit harian sudah digunakan sebagai bahan rapat penyesuaian pola tanam MT-1 2025.',
    kendala: 'Integrasi data dengan sistem pelaporan rutin masih membutuhkan penyesuaian format. Beberapa sensor juga perlu kalibrasi ulang setelah hujan dengan intensitas tinggi.',
    manfaat: 'OPD memperoleh data lapangan yang lebih cepat untuk menyusun jadwal pengairan. Subak melaporkan penghematan penggunaan air dan koordinasi antar tempek menjadi lebih terukur.'
  },
  'BRD-2025-002': {
    opd: 'Dinas Kebudayaan dan Pariwisata Kabupaten Buleleng',
    monitoring: 'Sudah',
    uraian: 'Draf standar operasional wisata bahari telah dibahas bersama operator perahu dan Pokdarwis Kalibukbuk. Materi awal sertifikasi operator sedang diuji pada dua kelompok pengelola.',
    kendala: 'Penyesuaian jadwal pertemuan dengan pelaku wisata terkendala musim ramai kunjungan dan perbedaan waktu operasional antar kelompok.',
    manfaat: 'Kajian menjadi dasar penyusunan layanan wisata yang lebih tertib, aman, dan menjaga keberlanjutan kawasan Lovina.'
  }
};

function EvidenceRepo({ r }) {
  const files = BERKAS[r.id] || [];

  return (
    <div>
      <div className="rounded-xl border border-info-bg bg-info-bg/40 p-4 text-[.82rem] text-info">
        Bukti dukung diunggah oleh OPD melalui Form Monev. Panel admin hanya menampilkan berkas untuk diperiksa.
      </div>

      {files.length > 0 ? (
        <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
          {files.map((f) => {
            return (
              <li key={f.nama} className="flex items-center gap-3 rounded-lg border border-line bg-white p-3">
                <span className="flex-none text-maroon-800"><Icon name={FILE_ICON[f.tipe] || 'doc'} size={19} /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[.84rem] font-semibold text-ink">{f.nama}</div>
                  <div className="text-[.74rem] text-ink-3">{f.ukuran} · {tanggal(f.tgl, true)}{f.geo ? ` · ${f.geo}` : ''}</div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3.5 text-[.83rem] text-ink-3">Belum ada berkas bukti luaran yang diunggah untuk riset ini.</p>
      )}
    </div>
  );
}

function MonevInputPreview({ r }) {
  const input = MONEV_INPUTS[r.id] || {
    opd: 'OPD pengampu kajian',
    monitoring: 'Sudah',
    uraian: 'OPD telah mengisi uraian perkembangan tindak lanjut rekomendasi kajian. Data lengkap dan bukti pelaksanaan menunggu pemeriksaan admin BRIDA.',
    kendala: 'Koordinasi lintas pihak dan penyesuaian jadwal pelaksanaan masih dipantau.',
    manfaat: 'Hasil kajian menjadi bahan pertimbangan dalam penyusunan program dan peningkatan layanan OPD.'
  };

  return (
    <section className="mt-5 rounded-xl border border-line bg-surface-1 p-4.5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-[.98rem]">Hasil input Monev dari OPD</h3>
          <p className="m-0 mt-1 text-[.78rem] text-ink-3">Preview data yang diisi OPD. Admin memeriksa isi ini sebelum memberikan penilaian.</p>
        </div>
        <span className="rounded-full bg-info-bg px-2.5 py-1 text-[.7rem] font-bold text-info">Input OPD</span>
      </div>

      <dl className="mb-4 grid gap-3 border-b border-line pb-4 sm:grid-cols-2">
        <div>
          <dt className="text-[.74rem] font-semibold text-ink-3">OPD pengampu</dt>
          <dd className="m-0 mt-0.5 text-[.84rem] font-semibold text-ink">{input.opd}</dd>
        </div>
        <div>
          <dt className="text-[.74rem] font-semibold text-ink-3">Hasil monitoring</dt>
          <dd className="m-0 mt-0.5"><span className="inline-flex rounded-full bg-success-bg px-2.5 py-1 text-[.72rem] font-bold text-success">{input.monitoring}</span></dd>
        </div>
      </dl>

      <div className="grid gap-4">
        {[
          ['Uraian hasil monitoring', input.uraian],
          ['Kendala pelaksanaan rekomendasi', input.kendala],
          ['Manfaat kajian', input.manfaat]
        ].map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 text-[.76rem] font-bold text-ink-3">{label}</div>
            <p className="m-0 text-[.84rem] leading-6 text-ink-2">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Sorotan({ r }) {
  const sm = statusMeta(displayStatus(r.status));
  const b = BIDANG.find((x) => x.id === r.bidang);
  // minmax(0,…) wajib: tanpa itu lebar min-content milestone tracker
  // menggencet kolom matriks skor sampai tak terbaca.
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        <section className="rounded-xl border border-line bg-white p-5.5">
          <div className="mb-1.5 flex flex-wrap gap-2">
            <span className="rounded-full px-2.5 py-1 text-[.715rem] font-bold" style={{ background: b.warna + '18', color: b.warna }}>{b.nama}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.715rem] font-bold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${sm.badge}`}>{sm.label}</span>
          </div>
          <h3 className="m-0 text-[1.05rem] leading-snug"><Link to={`/riset/${r.id}`} className="text-ink hover:text-maroon-800">{r.judul}</Link></h3>
          <p className="m-0 mt-1 text-[.82rem] text-ink-3">{r.peneliti} · {r.institusi} · Kec. {kecById(r.kecamatan).nama}</p>

          <dl className="mb-5 mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-[.83rem] sm:grid-cols-3">
            <div><dt className="font-semibold text-ink-3">Skema</dt><dd className="m-0 font-semibold">{skemaById(r.skema).nama}</dd></div>
            <div><dt className="font-semibold text-ink-3">Nilai kontrak</dt><dd className="m-0 font-semibold text-maroon-800">{rupiahRingkas(r.anggaran)}</dd></div>
            <div><dt className="font-semibold text-ink-3">Sisa dana</dt><dd className="m-0 font-semibold">{rupiahRingkas(r.anggaran - r.terserap)}</dd></div>
          </dl>

        </section>

        <section className="rounded-xl border border-line bg-white p-5.5">
          <h3 className="mb-1 text-[1rem]">Dokumentasi &amp; berkas bukti luaran</h3>
          <p className="mb-4 text-[.82rem] text-ink-3">Laporan kemajuan, foto lapangan bergeotag, dan tautan video demo purwarupa.</p>
          <EvidenceRepo r={r} />
          <MonevInputPreview r={r} />
        </section>
      </div>

      <section className="rounded-xl border border-line bg-white p-5.5">
        <ScoreMatrix r={r} />
      </section>
    </div>
  );
}

export default function MonevModule() {
  const [filt, setFilt] = useState({ q: '', tahun: '', bidang: '', status: '' });
  const [selectedId, setSelectedId] = useState('BRD-2025-001');
  const [sort, setSort] = useState({ key: 'id', dir: 'asc' });

  const hits = useMemo(() => {
    const q = filt.q.toLowerCase();
    return RISET.filter((r) => {
      if (filt.tahun && String(r.tahun) !== filt.tahun) return false;
      if (filt.bidang && r.bidang !== filt.bidang) return false;
      if (filt.status && displayStatus(r.status) !== filt.status) return false;
      if (q && !(`${r.judul} ${r.peneliti}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filt]);

  const sorted = useMemo(() => {
    const arr = [...hits];
    const dir = sort.dir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      switch (sort.key) {
        case 'judul': return a.judul.localeCompare(b.judul) * dir;
        case 'bidang': return a.bidang.localeCompare(b.bidang) * dir;
        case 'tahun': return (a.tahun - b.tahun) * dir;
        case 'anggaran': return (a.anggaran - b.anggaran) * dir;
        case 'serap': return (a.terserap / a.anggaran - b.terserap / b.anggaran) * dir;
        case 'progress': return (a.progress - b.progress) * dir;
        case 'status': return a.status.localeCompare(b.status) * dir;
        default: return a.id.localeCompare(b.id) * dir;
      }
    });
    return arr;
  }, [hits, sort]);

  function toggleSort(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }

  function exportCsv() {
    const header = ['Kode', 'Judul', 'Peneliti', 'Bidang', 'Tahun', 'Nilai Kontrak', 'Serapan', 'Capaian (%)', 'Status'];
    const rows = sorted.map((r) => [r.id, r.judul, r.peneliti, r.bidang, r.tahun, r.anggaran, r.terserap, r.progress, displayStatus(r.status)]);
    const csv = [header, ...rows].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rekap-monev-singa-riset-buleleng.csv';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  const selected = RISET.find((r) => r.id === selectedId) || sorted[0] || RISET[0];
  const total = RISET.length;
  const onTrack = RISET.filter((r) => displayStatus(r.status) === 'ontrack').length;
  const selesai = RISET.filter((r) => r.status === 'selesai').length;
  const avgProgress = Math.round(RISET.reduce((s, r) => s + r.progress, 0) / RISET.length);

  const SortHead = ({ label, k, align = 'left' }) => (
    <th scope="col"
      aria-sort={sort.key === k ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={`cursor-pointer select-none whitespace-nowrap px-4 py-3 text-${align} text-[.72rem] font-bold uppercase tracking-wide text-ink-3 hover:text-maroon-800`}
      onClick={() => toggleSort(k)}>
      {label} <span className={sort.key === k ? 'text-maroon-800' : 'opacity-40'}>↕</span>
    </th>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: 'Total dimonitor', v: total, sub: 'Riset TA 2025', c: '' },
          { l: 'On track', v: onTrack, sub: 'Sesuai timeline', c: 'border-l-4 border-l-success' },
          { l: 'Selesai & adopsi', v: selesai, sub: 'Rekomendasi teradopsi', c: 'border-l-4 border-l-info' },
          { l: 'Rerata capaian', v: `${avgProgress}%`, sub: 'Seluruh riset dimonitor', c: 'border-l-4 border-l-gold-500' }
        ].map((m) => (
          <div key={m.l} className={`rounded-xl border border-line bg-white p-4.5 ${m.c}`}>
            <div className="text-[.78rem] font-semibold text-ink-3">{m.l}</div>
            <div className="mt-1 text-[1.75rem] font-extrabold leading-tight text-ink">{m.v}</div>
            <div className="mt-0.5 text-[.755rem] text-ink-3">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <section className="rounded-xl border border-line bg-white p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="m-0 text-[1rem]">Pencarian lanjutan riset aktif</h2>
          <button type="button" onClick={() => setFilt({ q: '', tahun: '', bidang: '', status: '' })}
            className="rounded-lg px-3 py-1.5 text-[.8rem] font-semibold text-ink-2 hover:bg-surface-1">Atur ulang</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="search" placeholder="Judul riset atau peneliti…" value={filt.q}
            onChange={(e) => setFilt((f) => ({ ...f, q: e.target.value }))} className="input-base" aria-label="Cari riset" />
          <select value={filt.tahun} onChange={(e) => setFilt((f) => ({ ...f, tahun: e.target.value }))} className="input-base" aria-label="Tahun anggaran">
            <option value="">Semua tahun anggaran</option>
            {TAHUN_OPTS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filt.bidang} onChange={(e) => setFilt((f) => ({ ...f, bidang: e.target.value }))} className="input-base" aria-label="Bidang riset">
            <option value="">Semua bidang riset</option>
            {BIDANG.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
          </select>
        </div>
        <div className="mt-3.5 flex flex-wrap gap-2" role="group" aria-label="Saring status monev">
          {STATUSES.map((s) => {
            const active = filt.status === s.id;
            return (
              <button key={s.id || 'all'} type="button" aria-pressed={active} onClick={() => setFilt((f) => ({ ...f, status: s.id }))}
                className={`rounded-full border px-3.5 py-1.75 text-[.8rem] font-semibold transition ${active ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'}`}>
                {s.l}
              </button>
            );
          })}
        </div>
      </section>

      {/* Riset sorotan */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 text-[1.2rem]">Detail pemantauan riset terpilih</h2>
          <div className="flex items-center gap-2.5">
            <label htmlFor="mvPilih" className="text-[.83rem] font-semibold text-ink-2">Riset dipantau</label>
            <select id="mvPilih" value={selected.id} onChange={(e) => setSelectedId(e.target.value)}
              className="input-base w-auto min-w-[260px] max-w-full">
              {RISET.map((r) => <option key={r.id} value={r.id}>{r.id}: {r.judul.slice(0, 44)}…</option>)}
            </select>
          </div>
        </div>
        <Sorotan r={selected} />
      </section>

      {/* Master data */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="m-0 text-[1.2rem]">Master data agenda riset</h2>
            <p className="m-0 text-[.84rem] text-ink-2">Klik baris untuk memuat riset tersebut pada panel sorotan di atas.</p>
          </div>
          <button type="button" onClick={exportCsv}
            className="rounded-lg border border-line-strong bg-white px-5 py-2.5 text-sm font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
            Ekspor rekapitulasi (CSV)
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[880px] border-collapse text-[.845rem]">
            <caption className="sr-only">Master data riset yang dimonitor BRIDA Kabupaten Buleleng</caption>
            <thead>
              <tr className="border-b border-line bg-surface-1">
                <SortHead label="Kode" k="id" />
                <SortHead label="Judul & peneliti" k="judul" />
                <SortHead label="Bidang" k="bidang" />
                <SortHead label="TA" k="tahun" />
                <SortHead label="Nilai kontrak" k="anggaran" align="right" />
                <SortHead label="Serapan" k="serap" align="right" />
                <SortHead label="Capaian" k="progress" />
                <SortHead label="Status" k="status" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const visibleStatus = displayStatus(r.status);
                const sm = statusMeta(visibleStatus);
                const serapPct = Math.round((r.terserap / r.anggaran) * 100);
                return (
                  <tr key={r.id} onClick={() => setSelectedId(r.id)}
                    className={`cursor-pointer border-b border-line transition last:border-0 hover:bg-surface-1 ${selected.id === r.id ? 'bg-maroon-50' : ''}`}>
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold tabular-nums text-ink">{r.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-ink">{r.judul.length > 56 ? r.judul.slice(0, 56) + '…' : r.judul}</div>
                      <div className="text-[.765rem] text-ink-3">{r.peneliti} · {r.institusi}</div>
                    </td>
                    <td className="px-4 py-3.5 text-ink-2">{BIDANG.find((b) => b.id === r.bidang)?.nama.split(' ')[0]}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-2">{r.tahun}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-ink-2">{rupiah(r.anggaran)}</td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-ink-2">{serapPct}%</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
                          <div className={`h-full rounded-r-[4px] bg-gradient-to-r ${sm.bar}`} style={{ width: `${r.progress}%` }} />
                        </div>
                        <span className="tabular-nums text-[.78rem] font-semibold text-ink-2">{r.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${sm.badge}`}>{sm.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {sorted.length} dari {total} riset yang dimonitor BRIDA.</p>
      </section>
    </div>
  );
}
