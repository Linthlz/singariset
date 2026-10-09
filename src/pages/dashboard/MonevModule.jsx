import { useMemo, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import AsyncState, { EmptyState, SkeletonGrid } from '../../components/AsyncState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useMonevBatch, useMonevBatches, useOpds } from '../../hooks/useMonev.js';
import { errorMessage } from '../../services/api.js';
import { BATCH_STATUS, ENTRY_STATUS, canManageMonev, entriesToRecords, monevService } from '../../services/monevService.js';
import { tanggal } from '../../lib/format.js';

function progressFor(record) {
  if (!record.rekomendasi.length) return 0;
  const done = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
  return Math.round((done / record.rekomendasi.length) * 100);
}

function statusLaporan(record) {
  const done = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
  if (record.rekomendasi.length && done === record.rekomendasi.length) return 'Selesai';
  if (done === 0) return 'Belum dilaksanakan';
  return 'Sebagian dilaksanakan';
}

/** Menjalankan aksi tulis ke backend dengan toast sukses/gagal lalu memuat ulang data. */
function useAksi(onDone) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  async function run(fn, sukses) {
    setBusy(true);
    try {
      const hasil = await fn();
      if (sukses) toast('success', sukses);
      onDone?.();
      return hasil;
    } catch (err) {
      toast('danger', 'Gagal menyimpan', errorMessage(err));
      return undefined;
    } finally {
      setBusy(false);
    }
  }
  return { busy, run };
}

const tglPendek = (iso) => (iso ? tanggal(String(iso).slice(0, 10), true) : '-');

/* ---------------- Batch ---------------- */
function BatchBar({ batches, batch, onPilih, canManage, onChanged }) {
  const [buat, setBuat] = useState(batches.length === 0);
  const tahunIni = new Date().getFullYear();
  const [form, setForm] = useState({ tahun: String(tahunIni), judul: `Monev Hasil Riset/Kajian Tahun ${tahunIni}`, status: 'open' });
  const { busy, run } = useAksi(onChanged);

  async function simpan(event) {
    event.preventDefault();
    const baru = await run(() => monevService.createBatch(form), 'Batch Monev dibuat');
    if (baru) { onPilih(baru.id); setBuat(false); }
  }

  return (
    <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-[.76rem] font-semibold text-ink-3">
            Batch Monev
            <select value={batch?.id || ''} onChange={(e) => onPilih(e.target.value)} className="input-base min-w-60 text-ink" disabled={!batches.length}>
              {!batches.length && <option value="">Belum ada batch</option>}
              {batches.map((b) => <option key={b.id} value={b.id}>{b.tahun} · {b.judul}</option>)}
            </select>
          </label>
          {batch && (
            canManage ? (
              <label className="flex flex-col gap-1 text-[.76rem] font-semibold text-ink-3">
                Status batch
                <select value={batch.status} disabled={busy} className="input-base text-ink"
                  onChange={(e) => run(() => monevService.updateBatch(batch, { status: e.target.value }), 'Status batch diperbarui')}>
                  {Object.entries(BATCH_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </label>
            ) : <span className={`rounded-full px-2.5 py-1 text-[.72rem] font-bold ${BATCH_STATUS[batch.status]?.badge}`}>{BATCH_STATUS[batch.status]?.label}</span>
          )}
        </div>
        {canManage && (
          <button type="button" onClick={() => setBuat((v) => !v)} className="rounded-lg border border-line-strong px-3.5 py-2 text-[.8rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
            {buat ? 'Tutup' : 'Buat batch baru'}
          </button>
        )}
      </div>
      {batch?.status === 'draft' && <p className="m-0 mt-3 text-[.78rem] text-warning">Batch masih draf. Ubah status menjadi “Dibuka” agar OPD dapat mengisi form Monev.</p>}

      {canManage && buat && (
        <form onSubmit={simpan} className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-[120px_minmax(0,1fr)_160px_auto] sm:items-end">
          <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
            Tahun
            <input type="number" required min="2000" max="2100" value={form.tahun} onChange={(e) => setForm((f) => ({ ...f, tahun: e.target.value }))} className="input-base" />
          </label>
          <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
            Judul batch
            <input required value={form.judul} onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))} className="input-base" />
          </label>
          <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
            Status awal
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="input-base">
              {Object.entries(BATCH_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
          <button type="submit" disabled={busy} className="rounded-lg bg-maroon-800 px-4 py-2.5 text-[.82rem] font-semibold text-white hover:bg-maroon-600 disabled:opacity-60">Simpan batch</button>
        </form>
      )}
    </section>
  );
}

/* ---------------- Kelola poin ---------------- */
function RecommendationManager({ batch, onChanged }) {
  const entries = batch.entries;
  const opd = useOpds();
  const { busy, run } = useAksi(onChanged);
  const [isOpen, setIsOpen] = useState(false);
  const [isKajianOpen, setIsKajianOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(() => entries.find((e) => e.kajian.length)?.id || '');
  const [selectedKajianId, setSelectedKajianId] = useState('');
  const [judulPoin, setJudulPoin] = useState('');
  const [modeOpdKajian, setModeOpdKajian] = useState('existing');
  const [opdPilihan, setOpdPilihan] = useState('');
  const [opdBaru, setOpdBaru] = useState('');
  const [judulKajianBaru, setJudulKajianBaru] = useState('');
  const [poinAwal, setPoinAwal] = useState('');
  const [kajianMessage, setKajianMessage] = useState(null);

  const entryDenganKajian = entries.filter((e) => e.kajian.length);
  const selectedEntry = entries.find((e) => e.id === selectedEntryId) || entryDenganKajian[0];
  const kajianUntukOpd = selectedEntry?.kajian || [];
  const selectedKajian = kajianUntukOpd.find((k) => k.id === selectedKajianId) || kajianUntukOpd[0];
  const opdOptions = useMemo(() => {
    const semua = new Map((opd.data || []).map((o) => [o.id, o.nama]));
    entries.forEach((e) => { if (e.opd.id) semua.set(e.opd.id, e.opd.nama); });
    return [...semua].map(([value, nama]) => ({ value, nama })).sort((a, b) => a.nama.localeCompare(b.nama));
  }, [opd.data, entries]);
  const opdTerpilih = opdPilihan || opdOptions[0]?.value || '';

  async function simpanRekomendasi(event) {
    event.preventDefault();
    if (!selectedKajian || !judulPoin.trim()) return;
    const ok = await run(() => monevService.addPoint(selectedKajian.id, judulPoin), 'Poin rekomendasi ditambahkan');
    if (ok !== undefined) setJudulPoin('');
  }

  async function simpanKajian(event) {
    event.preventDefault();
    const judul = judulKajianBaru.trim();
    if (!judul || !poinAwal.trim()) return;
    const namaBaru = opdBaru.trim();
    if (modeOpdKajian === 'new' && !namaBaru) return;

    const hasil = await run(async () => {
      let opdId = opdTerpilih;
      if (modeOpdKajian === 'new') {
        const ada = opdOptions.find((o) => o.nama.toLowerCase() === namaBaru.toLowerCase());
        opdId = ada ? ada.value : (await monevService.createOpd(namaBaru)).id;
      }
      let entry = entries.find((e) => e.opd.id === opdId);
      if (entry?.kajian.some((k) => k.judul.toLowerCase() === judul.toLowerCase())) {
        throw new Error('duplikat');
      }
      const entryId = entry?.id || await monevService.addOpdToBatch(batch.id, opdId);
      const kajianId = await monevService.addKajian(entryId, judul);
      await monevService.addPoint(kajianId, poinAwal);
      return { entryId, kajianId };
    }, 'OPD/kajian dan poin rekomendasi tersimpan');

    if (hasil) {
      setSelectedEntryId(hasil.entryId);
      setSelectedKajianId(hasil.kajianId);
      setOpdBaru(''); setJudulKajianBaru(''); setPoinAwal('');
      setKajianMessage({ type: 'success', text: 'Kajian dan poin pertamanya sudah tersedia pada form Monev OPD.' });
      setIsKajianOpen(false);
      opd.reload();
    } else {
      setKajianMessage({ type: 'error', text: 'Kajian gagal disimpan. Pastikan judulnya belum terdaftar untuk OPD ini.' });
    }
  }

  return (
    <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-[1.02rem]">Kelola poin rekomendasi Monev</h2>
          <p className="m-0 mt-1 text-[.8rem] text-ink-3">Tambahkan OPD, kajian, dan poin yang akan diisi serta dipantau OPD melalui form Monev {batch.tahun}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setIsOpen((open) => !open)} className="rounded-lg border border-line-strong px-3.5 py-2 text-[.8rem] font-semibold text-maroon-800 transition hover:border-maroon-800 hover:bg-maroon-50">
            {isOpen ? 'Tutup pengelolaan' : 'Tambah rekomendasi'}
          </button>
          <button type="button" onClick={() => { setIsOpen(true); setIsKajianOpen((open) => !open); }} className="rounded-lg bg-maroon-800 px-3.5 py-2 text-[.8rem] font-semibold text-white transition hover:bg-maroon-600">
            Tambah OPD / kajian
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-5 grid gap-5 border-t border-line pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form onSubmit={simpanRekomendasi} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
              OPD pengampu
              <select value={selectedEntry?.id || ''} onChange={(event) => { setSelectedEntryId(event.target.value); setSelectedKajianId(''); }} className="input-base" required>
                {!entryDenganKajian.length && <option value="">Belum ada OPD dengan kajian</option>}
                {entryDenganKajian.map((e) => <option key={e.id} value={e.id}>{e.opd.nama}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
              Judul kajian Monev
              <select value={selectedKajian?.id || ''} onChange={(event) => setSelectedKajianId(event.target.value)} className="input-base" required>
                {kajianUntukOpd.map((kajian) => <option key={kajian.id} value={kajian.id}>{kajian.judul}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
              Poin rekomendasi baru
              <textarea value={judulPoin} onChange={(event) => setJudulPoin(event.target.value)} rows={3} maxLength={255} className="input-base resize-y" placeholder="Tuliskan rekomendasi yang perlu dipantau" required />
            </label>
            <button type="submit" disabled={busy || !selectedKajian || !judulPoin.trim()} className="self-start rounded-lg bg-maroon-800 px-4 py-2.5 text-[.82rem] font-semibold text-white transition hover:bg-maroon-600 disabled:cursor-not-allowed disabled:opacity-50">
              Simpan poin rekomendasi
            </button>
          </form>

          <div>
            <h3 className="mb-2 text-[.88rem]">Poin aktif pada kajian</h3>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {(selectedKajian?.rekomendasi || []).map((item, index) => (
                <li key={item.id} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface-1 px-3 py-2.5">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-white text-[.7rem] font-bold text-ink-3">{index + 1}</span>
                  <span className="flex-1 pt-0.5 text-[.8rem] leading-5 text-ink-2">{item.judul}</span>
                  <button type="button" disabled={busy} onClick={() => run(() => monevService.deletePoint(item.id), 'Poin dihapus')}
                    className="flex-none rounded px-1.5 text-[.72rem] font-semibold text-danger hover:bg-danger-bg" aria-label={`Hapus poin ${item.judul}`}>Hapus</button>
                </li>
              ))}
              {!selectedKajian?.rekomendasi.length && <li className="py-3 text-[.8rem] text-ink-3">Belum ada poin rekomendasi.</li>}
            </ol>
          </div>
        </div>
      )}

      {isKajianOpen && (
        <form onSubmit={simpanKajian} className="mt-5 grid gap-4 border-t border-line pt-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <h3 className="m-0 text-[.92rem]">Tambah OPD dan judul kajian Monev</h3>
            <p className="m-0 mt-1 text-[.78rem] text-ink-3">OPD otomatis ditambahkan ke batch {batch.tahun}; kajian dan poin pertamanya langsung tersedia untuk pengisian form OPD.</p>
          </div>
          <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
            OPD pengampu
            <select value={modeOpdKajian} onChange={(event) => setModeOpdKajian(event.target.value)} className="input-base">
              <option value="existing">Gunakan OPD yang sudah ada</option>
              <option value="new">Tambah OPD baru</option>
            </select>
          </label>
          {modeOpdKajian === 'existing' ? (
            <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
              Pilih OPD
              <select value={opdTerpilih} onChange={(event) => setOpdPilihan(event.target.value)} className="input-base" required>
                {!opdOptions.length && <option value="">Belum ada OPD terdaftar</option>}
                {opdOptions.map((o) => <option key={o.value} value={o.value}>{o.nama}</option>)}
              </select>
            </label>
          ) : (
            <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2">
              Nama OPD baru
              <input value={opdBaru} onChange={(event) => setOpdBaru(event.target.value)} className="input-base" placeholder="Contoh: Dinas Kesehatan Kabupaten Buleleng" required />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2 md:col-span-2">
            Judul lengkap kajian
            <input value={judulKajianBaru} onChange={(event) => setJudulKajianBaru(event.target.value)} maxLength={255} className="input-base" placeholder="Masukkan judul kajian yang akan dimonev" required />
          </label>
          <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2 md:col-span-2">
            Poin rekomendasi pertama
            <textarea value={poinAwal} onChange={(event) => setPoinAwal(event.target.value)} rows={3} maxLength={255} className="input-base resize-y" placeholder="Tuliskan rekomendasi pertama untuk kajian ini" required />
          </label>
          {kajianMessage && <p role="status" className={`m-0 text-[.8rem] font-semibold md:col-span-2 ${kajianMessage.type === 'error' ? 'text-danger' : 'text-success'}`}>{kajianMessage.text}</p>}
          <button type="submit" disabled={busy || (modeOpdKajian === 'existing' && !opdTerpilih)} className="w-fit rounded-lg bg-maroon-800 px-4 py-2.5 text-[.82rem] font-semibold text-white transition hover:bg-maroon-600 disabled:opacity-60 md:col-span-2">
            Simpan OPD dan kajian
          </button>
        </form>
      )}
    </section>
  );
}

/* ---------------- Rekap per OPD ---------------- */
function RecommendationList({ records, canManage, onChanged, onSelectRecord }) {
  const { busy, run } = useAksi(onChanged);
  const opdList = useMemo(() => [...new Set(records.map((record) => record.opd))].map((nama) => ({
    nama,
    rekomendasi: records.filter((record) => record.opd === nama).flatMap((record) =>
      record.rekomendasi.map((item) => ({ ...item, recordId: record.id, recordTitle: record.judul }))
    )
  })), [records]);
  const [selectedOpd, setSelectedOpd] = useState('');
  const opd = opdList.find((item) => item.nama === selectedOpd) || opdList[0];
  const items = opd?.rekomendasi || [];
  const total = records.reduce((sum, record) => sum + record.rekomendasi.length, 0);
  const done = records.reduce((sum, record) => sum + record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length, 0);
  const pending = total - done;
  const opdDone = items.filter((item) => item.monitoring === 'Sudah').length;
  const opdPercent = items.length ? Math.round((opdDone / items.length) * 100) : 0;
  const overallPercent = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-[1.05rem]">Penilaian tindak lanjut rekomendasi kajian</h2>
          <p className="m-0 mt-1 text-[.82rem] text-ink-3">Rekap berasal dari jawaban form Monev OPD.</p>
        </div>
        <label className="flex flex-col gap-1 text-[.76rem] font-semibold text-ink-3">
          OPD pengampu
          <select value={opd?.nama || ''} onChange={(event) => setSelectedOpd(event.target.value)} className="input-base min-w-65 text-ink" aria-label="Pilih OPD pengampu">
            {opdList.map((item) => <option key={item.nama} value={item.nama}>{item.nama}</option>)}
          </select>
        </label>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total rekomendasi', value: total, color: 'text-ink' },
          { label: 'Sudah dilaksanakan', value: done, color: 'text-success' },
          { label: 'Belum dilaksanakan', value: pending, color: 'text-warning' },
          { label: 'Capaian seluruh Monev', value: `${overallPercent}%`, color: 'text-maroon-800' }
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border border-line bg-surface-1 px-3.5 py-3">
            <div className="text-[.75rem] font-semibold text-ink-3">{metric.label}</div>
            <div className={`mt-1 text-[1.5rem] font-extrabold tabular-nums ${metric.color}`}>{metric.value}</div>
          </div>
        ))}
      </div>

      {opd && (
        <>
          <div className="mb-4 rounded-lg border border-line p-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="m-0 text-[.94rem]">{opd.nama}</h3>
                <p className="m-0 mt-0.5 text-[.78rem] text-ink-3">{opdDone} dari {items.length} rekomendasi telah dilaksanakan</p>
              </div>
              <strong className="text-[1.5rem] font-extrabold tabular-nums text-maroon-800">{opdPercent}%</strong>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`Capaian rekomendasi ${opd.nama}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={opdPercent}>
              <div className="h-full rounded-full bg-maroon-800 transition-[width]" style={{ width: `${opdPercent}%` }} />
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-line">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 bg-surface-1 px-4 py-2.5 text-[.7rem] font-bold uppercase tracking-wide text-ink-3">
              <span>Poin rekomendasi Monev</span><span>Status pelaksanaan</span>
            </div>
            <ul className="m-0 list-none divide-y divide-line p-0">
              {items.map((item, index) => {
                const sudah = item.monitoring === 'Sudah';
                const cls = sudah ? 'border-success-bg bg-success-bg text-success' : 'border-warning-bg bg-warning-bg text-warning';
                const isi = <><Icon name={sudah ? 'checkCircle' : 'clock'} size={14} />{sudah ? 'Sudah dilaksanakan' : 'Belum dilaksanakan'}</>;
                return (
                  <li key={item.id} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-all duration-200 hover:-translate-y-px hover:bg-maroon-50 hover:shadow-sm">
                    <span className="flex min-w-0 items-start gap-3">
                      <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-surface-1 text-[.76rem] font-bold tabular-nums text-ink-3">{index + 1}</span>
                      <button type="button" onClick={() => onSelectRecord(item.recordId)} aria-label={`Buka detail Monev: ${item.judul}`}
                        className="group/link flex min-w-0 items-center gap-2 rounded text-left text-ink hover:text-maroon-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-800">
                        <span className="min-w-0">
                          <span className="block text-[.84rem] font-semibold leading-5 transition-transform duration-200 group-hover:translate-x-1">{item.judul}</span>
                          <span className="mt-0.5 block text-[.73rem] leading-5 text-ink-3">{item.recordTitle}</span>
                        </span>
                        <Icon name="arrow" size={14} className="flex-none opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                      </button>
                    </span>
                    {canManage ? (
                      <button type="button" disabled={busy} aria-pressed={sudah}
                        onClick={() => run(() => monevService.updatePoint(item, { monitoring: sudah ? 'Belum' : 'Sudah' }), 'Status poin diperbarui')}
                        className={`inline-flex min-w-37.5 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[.75rem] font-bold transition disabled:opacity-60 ${cls}`}>{isi}</button>
                    ) : (
                      <span className={`inline-flex min-w-37.5 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[.75rem] font-bold ${cls}`}>{isi}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      {records.length === 0 && <p className="m-0 text-sm text-ink-3">Belum ada kajian pada batch ini.</p>}
    </section>
  );
}

function MonevDetail({ record }) {
  if (!record) {
    return (
      <section id="detail-monev-terpilih" className="rounded-xl border border-line bg-white p-4 sm:p-5">
        <h2 className="m-0 text-[1.05rem]">Detail pengisian Monev</h2>
        <p className="mb-0 mt-2 text-sm text-ink-3">Pilih laporan Monev untuk melihat jawaban per poin rekomendasi.</p>
      </section>
    );
  }
  const st = ENTRY_STATUS[record.status] || ENTRY_STATUS.pending;

  return (
    <section id="detail-monev-terpilih" className="scroll-mt-6 rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="mb-5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="m-0 text-[.73rem] font-bold uppercase tracking-wide text-maroon-800">Detail pengisian Monev{record.batch ? ` · ${record.batch.tahun}` : ''}</p>
          <span className={`rounded-full px-2 py-0.5 text-[.68rem] font-bold ${st.badge}`}>{st.label}</span>
        </div>
        <h2 className="m-0 text-[1.1rem] leading-snug">{record.judul}</h2>
        <p className="m-0 mt-2 text-[.8rem] text-ink-3">
          {record.opd} · {record.nama || 'Wakil OPD belum diisi'}{record.nip ? ` · NIP ${record.nip}` : ''} · {tglPendek(record.tanggal)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {record.rekomendasi.map((item, index) => (
          <article key={item.id} className="rounded-lg border border-line bg-surface-1 p-4">
            <div className="mb-3 flex items-start gap-3">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-maroon-800 text-sm font-bold text-white">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 text-[.9rem] leading-5">{item.judul}</h3>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[.7rem] font-bold ${item.monitoring === 'Sudah' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                  {item.terisi ? `${item.monitoring} dilaksanakan` : 'Belum diisi OPD'}
                </span>
              </div>
            </div>
            <div className="grid gap-4 border-t border-line pt-3 sm:grid-cols-3">
              {[
                ['Uraian hasil monitoring', item.uraian],
                ['Kendala pelaksanaan', item.kendala],
                ['Manfaat kajian', item.manfaat]
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 text-[.72rem] font-bold text-ink-3">{label}</div>
                  <p className="m-0 text-[.82rem] leading-5 text-ink-2">{value || '-'}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <div className="mb-1 text-[.72rem] font-bold text-ink-3">Bukti tindak lanjut</div>
              {item.fileUrl ? (
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[.78rem] font-semibold text-info hover:underline"><Icon name="doc" size={15} />{item.fileName}</a>
              ) : (
                <p className="m-0 text-[.78rem] text-ink-3">Tidak ada bukti yang diunggah untuk poin ini.</p>
              )}
            </div>
          </article>
        ))}
        {!record.rekomendasi.length && <p className="m-0 text-[.82rem] text-ink-3">Kajian ini belum memiliki poin rekomendasi.</p>}
      </div>
    </section>
  );
}

/* ---------------- Modul ---------------- */
function MonevBatchView({ batch, canManage, onChanged }) {
  const { busy, run } = useAksi(onChanged);
  const records = useMemo(() => entriesToRecords(batch.entries), [batch.entries]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const selectedRecord = records.find((record) => record.id === selectedRecordId) || records[0] || null;
  const tanpaKajian = batch.entries.filter((e) => !e.kajian.length);

  const filteredRecords = useMemo(() => records
    .filter((record) => {
      const query = search.toLowerCase();
      if (query && !`${record.judul} ${record.opd} ${record.nama}`.toLowerCase().includes(query)) return false;
      if (statusFilter && statusLaporan(record) !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => (sortDirection === 'asc' ? 1 : -1) * String(a.tanggal).localeCompare(String(b.tanggal))),
  [records, search, statusFilter, sortDirection]);

  function openRecord(recordId) {
    setSelectedRecordId(recordId);
    const detail = document.getElementById('detail-monev-terpilih');
    const main = detail?.closest('main');
    if (detail && main) {
      const top = main.scrollTop + detail.getBoundingClientRect().top - main.getBoundingClientRect().top - 16;
      main.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function exportCsv() {
    const header = ['Batch', 'Judul kajian', 'OPD', 'Nama wakil', 'NIP', 'Tanggal', 'Status laporan', 'Total poin', 'Sudah', 'Belum', 'Capaian (%)'];
    const rows = filteredRecords.map((record) => {
      const done = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
      return [batch.tahun, record.judul, record.opd, record.nama, record.nip, String(record.tanggal).slice(0, 10), ENTRY_STATUS[record.status]?.label || record.status,
        record.rekomendasi.length, done, record.rekomendasi.length - done, progressFor(record)];
    });
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `rekap-monev-opd-${batch.tahun}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {canManage && <RecommendationManager key={batch.id} batch={batch} onChanged={onChanged} />}
      {canManage && tanpaKajian.length > 0 && (
        <p className="m-0 rounded-xl border border-warning-bg bg-warning-bg/50 px-4 py-3 text-[.8rem] text-warning">
          OPD tanpa kajian: {tanpaKajian.map((e) => e.opd.nama).join(', ')}. Tambahkan kajian agar OPD dapat mengisi form.
        </p>
      )}
      <RecommendationList key={`rekap-${batch.id}`} records={records} canManage={canManage} onChanged={onChanged} onSelectRecord={openRecord} />
      <MonevDetail record={selectedRecord} />

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="m-0 text-[1.2rem]">Daftar pengisian Monev</h2>
            <p className="m-0 text-[.84rem] text-ink-2">Data laporan berasal dari form Monev OPD.</p>
          </div>
          <button type="button" onClick={exportCsv} className="rounded-lg border border-line-strong bg-white px-5 py-2.5 text-sm font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
            Ekspor rekapitulasi (CSV)
          </button>
        </div>

        <div className="mb-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul, OPD, atau pengisi…" className="input-base" aria-label="Cari laporan Monev" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input-base" aria-label="Saring status laporan">
            <option value="">Semua status</option>
            <option value="Selesai">Selesai</option>
            <option value="Sebagian dilaksanakan">Sebagian dilaksanakan</option>
            <option value="Belum dilaksanakan">Belum dilaksanakan</option>
          </select>
          <button type="button" onClick={() => setSortDirection((value) => value === 'asc' ? 'desc' : 'asc')} className="rounded-lg border border-line-strong px-3 py-2 text-sm font-semibold text-ink-2 hover:bg-surface-1">
            Tanggal {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-220 border-collapse text-[.845rem]">
            <caption className="sr-only">Daftar laporan monitoring dan evaluasi dari OPD</caption>
            <thead>
              <tr className="border-b border-line bg-surface-1">
                {['Judul kajian', 'OPD & pengisi', 'Tanggal', 'Capaian', 'Status', 'Laporan'].map((heading) => (
                  <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const st = ENTRY_STATUS[record.status] || ENTRY_STATUS.pending;
                return (
                  <tr key={record.id} onClick={() => openRecord(record.id)} className={`cursor-pointer border-b border-line transition last:border-0 hover:bg-surface-1 ${selectedRecord?.id === record.id ? 'bg-maroon-50' : ''}`}>
                    <td className="px-4 py-3.5"><div className="max-w-105 font-semibold text-ink">{record.judul}</div></td>
                    <td className="px-4 py-3.5"><div className="font-semibold text-ink-2">{record.opd}</div><div className="text-[.765rem] text-ink-3">{record.nama || 'Belum diisi'}</div></td>
                    <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-ink-2">{tglPendek(record.tanggal)}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-2">{progressFor(record)}%</td>
                    <td className="px-4 py-3.5"><span className="inline-flex rounded-full bg-surface-1 px-2.5 py-1 text-[.71rem] font-bold text-ink-2">{statusLaporan(record)}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.badge}`}>{st.label}</span>
                        {canManage && record.status === 'submitted' && (
                          <button type="button" disabled={busy} onClick={(e) => { e.stopPropagation(); run(() => monevService.verifyEntry(record.entryId), `Laporan ${record.opd} diverifikasi`); }}
                            className="rounded-lg bg-success px-2.5 py-1 text-[.72rem] font-semibold text-white hover:opacity-90 disabled:opacity-60">Verifikasi</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-3">Belum ada laporan yang sesuai filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {filteredRecords.length} dari {records.length} kajian Monev {batch.tahun}.</p>
      </section>
    </>
  );
}

export default function MonevModule() {
  const { user } = useAuth();
  const canManage = canManageMonev(user);
  const batches = useMonevBatches();
  const [batchId, setBatchId] = useState(null);
  const daftar = batches.data || [];
  const aktifId = batchId || daftar[0]?.id || null;
  const batch = useMonevBatch(aktifId);

  function segarkan() {
    batches.reload();
    batch.reload();
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {!canManage && (
        <p className="m-0 flex items-center gap-2 rounded-xl border border-info-bg bg-info-bg/40 px-4 py-3 text-[.82rem] text-info">
          <Icon name="lock" size={16} /> Mode baca saja. Pengelolaan Monev hanya untuk Administrator dan Pegawai BRIDA.
        </p>
      )}
      <AsyncState loading={batches.loading} error={batches.error} isEmpty={!batches.data} onRetry={batches.reload}
        skeleton={<SkeletonGrid count={1} className="flex flex-col" itemClassName="h-24" />}>
        <BatchBar key={daftar.length} batches={daftar} batch={batch.data} onPilih={setBatchId} canManage={canManage} onChanged={segarkan} />
      </AsyncState>

      {aktifId && (
        <AsyncState loading={batch.loading} error={batch.error} isEmpty={!batch.data} onRetry={batch.reload}
          skeleton={<SkeletonGrid count={3} className="flex flex-col gap-4" itemClassName="h-40" />}>
          {batch.data && <MonevBatchView key={batch.data.id} batch={batch.data} canManage={canManage} onChanged={segarkan} />}
        </AsyncState>
      )}
      {batches.data && !daftar.length && !canManage && (
        <EmptyState icon="chart" title="Belum ada batch Monev" text="Batch Monev dibuat oleh Administrator atau Pegawai BRIDA." />
      )}
    </div>
  );
}
