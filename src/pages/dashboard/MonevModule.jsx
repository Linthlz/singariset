import { useMemo, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { useMonev } from '../../context/MonevContext.jsx';
import { tanggal } from '../../lib/format.js';

function progressFor(record) {
  const done = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
  return Math.round((done / record.rekomendasi.length) * 100);
}

function RecommendationManager({ kajianList, onAddRecommendation, onAddKajian }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isKajianOpen, setIsKajianOpen] = useState(false);
  const [selectedOpd, setSelectedOpd] = useState(() => kajianList[0]?.opd || '');
  const [selectedKajianId, setSelectedKajianId] = useState(() => kajianList[0]?.id || '');
  const [judulPoin, setJudulPoin] = useState('');
  const [modeOpdKajian, setModeOpdKajian] = useState('existing');
  const [opdBaru, setOpdBaru] = useState('');
  const [judulKajianBaru, setJudulKajianBaru] = useState('');
  const [poinAwal, setPoinAwal] = useState('');
  const [kajianMessage, setKajianMessage] = useState(null);
  const [savedMessage, setSavedMessage] = useState('');
  const opdOptions = [...new Set(kajianList.map((item) => item.opd))].sort((a, b) => a.localeCompare(b));
  const kajianUntukOpd = kajianList.filter((item) => item.opd === selectedOpd);
  const selectedKajian = kajianList.find((item) => item.id === selectedKajianId) || kajianUntukOpd[0];

  function pilihOpd(opd) {
    setSelectedOpd(opd);
    setSelectedKajianId(kajianList.find((item) => item.opd === opd)?.id || '');
    setSavedMessage('');
  }

  function simpanRekomendasi(event) {
    event.preventDefault();
    const judul = judulPoin.trim();
    if (!selectedKajian || !judul) return;
    onAddRecommendation(selectedKajian.id, judul);
    setJudulPoin('');
    setSavedMessage('Poin tersimpan dan tersedia pada form Monev OPD.');
  }

  function simpanKajian(event) {
    event.preventDefault();
    const opd = modeOpdKajian === 'new' ? opdBaru.trim() : selectedOpd;
    const judul = judulKajianBaru.trim();
    const rekomendasi = poinAwal.trim();
    if (!opd || !judul || !rekomendasi) return;

    const sudahAda = kajianList.some((item) => item.opd.toLowerCase() === opd.toLowerCase() && item.judul.toLowerCase() === judul.toLowerCase());
    if (sudahAda) {
      setKajianMessage({ type: 'error', text: 'Judul kajian tersebut sudah terdaftar untuk OPD ini.' });
      return;
    }

    const kajian = onAddKajian({ opd, judul, rekomendasi });
    setSelectedOpd(opd);
    setSelectedKajianId(kajian.id);
    setOpdBaru('');
    setJudulKajianBaru('');
    setPoinAwal('');
    setKajianMessage({ type: 'success', text: 'OPD/kajian dan poin rekomendasi sudah tersedia pada form Monev.' });
    setIsKajianOpen(false);
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-[1.02rem]">Kelola poin rekomendasi Monev</h2>
          <p className="m-0 mt-1 text-[.8rem] text-ink-3">Tambahkan poin yang akan diisi dan dipantau OPD melalui form Monev.</p>
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
              <select value={selectedOpd} onChange={(event) => pilihOpd(event.target.value)} className="input-base" required>
                {opdOptions.map((opd) => <option key={opd} value={opd}>{opd}</option>)}
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
              <textarea value={judulPoin} onChange={(event) => setJudulPoin(event.target.value)} rows={3} className="input-base resize-y" placeholder="Tuliskan rekomendasi yang perlu dipantau" required />
            </label>
            {savedMessage && <p role="status" className="m-0 text-[.8rem] font-semibold text-success">{savedMessage}</p>}
            <button type="submit" disabled={!selectedKajian || !judulPoin.trim()} className="self-start rounded-lg bg-maroon-800 px-4 py-2.5 text-[.82rem] font-semibold text-white transition hover:bg-maroon-600 disabled:cursor-not-allowed disabled:opacity-50">
              Simpan poin rekomendasi
            </button>
          </form>

          <div>
            <h3 className="mb-2 text-[.88rem]">Poin aktif pada kajian</h3>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {(selectedKajian?.rekomendasi || []).map((item, index) => (
                <li key={item.id} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface-1 px-3 py-2.5">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-white text-[.7rem] font-bold text-ink-3">{index + 1}</span>
                  <span className="pt-0.5 text-[.8rem] leading-5 text-ink-2">{item.judul}</span>
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
            <p className="m-0 mt-1 text-[.78rem] text-ink-3">Kajian dan poin pertamanya langsung tersedia untuk pengisian form OPD.</p>
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
              <select value={selectedOpd} onChange={(event) => setSelectedOpd(event.target.value)} className="input-base" required>
                {opdOptions.map((opd) => <option key={opd} value={opd}>{opd}</option>)}
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
            <input value={judulKajianBaru} onChange={(event) => setJudulKajianBaru(event.target.value)} className="input-base" placeholder="Masukkan judul kajian yang akan dimonev" required />
          </label>
          <label className="flex flex-col gap-1.5 text-[.78rem] font-semibold text-ink-2 md:col-span-2">
            Poin rekomendasi pertama
            <textarea value={poinAwal} onChange={(event) => setPoinAwal(event.target.value)} rows={3} className="input-base resize-y" placeholder="Tuliskan rekomendasi pertama untuk kajian ini" required />
          </label>
          {kajianMessage && <p role="status" className={`m-0 text-[.8rem] font-semibold md:col-span-2 ${kajianMessage.type === 'error' ? 'text-danger' : 'text-success'}`}>{kajianMessage.text}</p>}
          <button type="submit" className="w-fit rounded-lg bg-maroon-800 px-4 py-2.5 text-[.82rem] font-semibold text-white transition hover:bg-maroon-600 md:col-span-2">
            Simpan OPD dan kajian
          </button>
        </form>
      )}
    </section>
  );
}

function RecommendationList({ records, canManage, onUpdateRecommendation, onSelectRecord }) {
  const opdList = useMemo(() => [...new Set(records.map((record) => record.opd))].map((nama) => ({
    nama,
    rekomendasi: records.filter((record) => record.opd === nama).flatMap((record) =>
      record.rekomendasi.map((item, index) => ({
        ...item,
        recordId: record.id,
        recordTitle: record.judul,
        recommendationIndex: index
      }))
    )
  })), [records]);
  const [selectedOpd, setSelectedOpd] = useState(() => records[0]?.opd || '');
  const opd = opdList.find((item) => item.nama === selectedOpd) || opdList[0];
  const items = opd?.rekomendasi || [];
  const total = records.reduce((sum, record) => sum + record.rekomendasi.length, 0);
  const done = records.reduce((sum, record) => sum + record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length, 0);
  const pending = total - done;
  const opdDone = items.filter((item) => item.monitoring === 'Sudah').length;
  const opdPercent = items.length ? Math.round((opdDone / items.length) * 100) : 0;
  const overallPercent = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="rounded-xl border border-line bg-white p-5">
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
              {items.map((item, index) => (
                <li key={`${item.recordId}-${item.recommendationIndex}`} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-all duration-200 hover:-translate-y-px hover:bg-maroon-50 hover:shadow-sm">
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
                    <button type="button" onClick={() => onUpdateRecommendation(item.recordId, item.recommendationIndex, item.monitoring === 'Sudah' ? 'Belum' : 'Sudah')} aria-pressed={item.monitoring === 'Sudah'}
                      className={`inline-flex min-w-37.5 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[.75rem] font-bold transition ${item.monitoring === 'Sudah' ? 'border-success-bg bg-success-bg text-success hover:border-success' : 'border-warning-bg bg-warning-bg text-warning hover:border-warning'}`}>
                      <Icon name={item.monitoring === 'Sudah' ? 'checkCircle' : 'clock'} size={14} />
                      {item.monitoring === 'Sudah' ? 'Sudah dilaksanakan' : 'Belum dilaksanakan'}
                    </button>
                  ) : (
                    <span className={`inline-flex min-w-37.5 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[.75rem] font-bold ${item.monitoring === 'Sudah' ? 'border-success-bg bg-success-bg text-success' : 'border-warning-bg bg-warning-bg text-warning'}`}>
                      <Icon name={item.monitoring === 'Sudah' ? 'checkCircle' : 'clock'} size={14} />
                      {item.monitoring === 'Sudah' ? 'Sudah dilaksanakan' : 'Belum dilaksanakan'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {records.length === 0 && <p className="m-0 text-sm text-ink-3">Belum ada data pengisian Monev.</p>}
    </section>
  );
}

function MonevDetail({ record }) {
  if (!record) {
    return (
      <section id="detail-monev-terpilih" className="rounded-xl border border-line bg-white p-5">
        <h2 className="m-0 text-[1.05rem]">Detail pengisian Monev</h2>
        <p className="mb-0 mt-2 text-sm text-ink-3">Pilih laporan Monev untuk melihat jawaban per poin rekomendasi.</p>
      </section>
    );
  }

  return (
    <section id="detail-monev-terpilih" className="scroll-mt-6 rounded-xl border border-line bg-white p-5">
      <div className="mb-5">
        <p className="mb-1 text-[.73rem] font-bold uppercase tracking-wide text-maroon-800">Detail pengisian Monev · {record.id}{record.risetKode ? ` · ${record.risetKode}` : ''}</p>
        <h2 className="m-0 text-[1.1rem] leading-snug">{record.judul}</h2>
        <p className="m-0 mt-2 text-[.8rem] text-ink-3">{record.opd} · {record.nama} · NIP {record.nip} · {tanggal(record.createdAt.slice(0, 10), true)}</p>
      </div>

      <div className="flex flex-col gap-3">
        {record.rekomendasi.map((item, index) => (
          <article key={`${record.id}-${index}`} className="rounded-lg border border-line bg-surface-1 p-4">
            <div className="mb-3 flex items-start gap-3">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-maroon-800 text-sm font-bold text-white">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 text-[.9rem] leading-5">{item.judul}</h3>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[.7rem] font-bold ${item.monitoring === 'Sudah' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>{item.monitoring} dilaksanakan</span>
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
              {item.fileName ? (
                <div className="flex items-center gap-2 text-[.78rem] font-semibold text-info"><Icon name="doc" size={15} />{item.fileName} · {item.fileSize}</div>
              ) : (
                <p className="m-0 text-[.78rem] text-ink-3">Tidak ada bukti yang diunggah untuk poin ini.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function statusLaporan(record) {
  const done = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
  if (done === record.rekomendasi.length) return 'Selesai';
  if (done === 0) return 'Belum dilaksanakan';
  return 'Sebagian dilaksanakan';
}

export default function MonevModule() {
  const { records, kajianList, canManage, addMonevRecommendation, addMonevKajian, updateRecommendation } = useMonev();
  const [selectedRecordId, setSelectedRecordId] = useState(() => records[0]?.id || null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const selectedRecord = records.find((record) => record.id === selectedRecordId) || records[0] || null;

  const filteredRecords = useMemo(() => records
    .filter((record) => {
      const query = search.toLowerCase();
      if (query && !`${record.id} ${record.risetKode || ''} ${record.judul} ${record.opd} ${record.nama}`.toLowerCase().includes(query)) return false;
      if (statusFilter && statusLaporan(record) !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => (sortDirection === 'asc' ? 1 : -1) * a.createdAt.localeCompare(b.createdAt)),
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
    const header = ['ID Monev', 'Kode riset', 'Judul kajian', 'OPD', 'Nama pengisi', 'NIP', 'Tanggal', 'Total poin', 'Sudah', 'Belum', 'Capaian (%)'];
    const rows = filteredRecords.map((record) => {
      const done = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
      return [record.id, record.risetKode || '', record.judul, record.opd, record.nama, record.nip, record.createdAt.slice(0, 10), record.rekomendasi.length, done, record.rekomendasi.length - done, progressFor(record)];
    });
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'rekap-monev-opd.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      {canManage ? (
        <RecommendationManager kajianList={kajianList} onAddRecommendation={addMonevRecommendation} onAddKajian={addMonevKajian} />
      ) : (
        <p className="m-0 flex items-center gap-2 rounded-xl border border-info-bg bg-info-bg/40 px-4 py-3 text-[.82rem] text-info">
          <Icon name="lock" size={16} /> Mode baca saja. Pengelolaan Monev hanya untuk Administrator dan Pegawai BRIDA.
        </p>
      )}
      <RecommendationList records={records} canManage={canManage} onUpdateRecommendation={updateRecommendation} onSelectRecord={openRecord} />
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
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul, kode riset, OPD, atau pengisi…" className="input-base" aria-label="Cari laporan Monev" />
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
                {['ID Monev', 'Judul kajian', 'OPD & pengisi', 'Tanggal', 'Capaian', 'Status'].map((heading) => (
                  <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const progress = progressFor(record);
                const status = statusLaporan(record);
                return (
                  <tr key={record.id} onClick={() => openRecord(record.id)} className={`cursor-pointer border-b border-line transition last:border-0 hover:bg-surface-1 ${selectedRecord?.id === record.id ? 'bg-maroon-50' : ''}`}>
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold tabular-nums text-ink">{record.id}{record.risetKode && <div className="text-[.72rem] font-normal text-ink-3">{record.risetKode}</div>}</td>
                    <td className="px-4 py-3.5"><div className="max-w-105 font-semibold text-ink">{record.judul}</div></td>
                    <td className="px-4 py-3.5"><div className="font-semibold text-ink-2">{record.opd}</div><div className="text-[.765rem] text-ink-3">{record.nama}</div></td>
                    <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-ink-2">{tanggal(record.createdAt.slice(0, 10), true)}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-2">{progress}%</td>
                    <td className="px-4 py-3.5"><span className="inline-flex rounded-full bg-surface-1 px-2.5 py-1 text-[.71rem] font-bold text-ink-2">{status}</span></td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-3">Belum ada laporan yang sesuai filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {filteredRecords.length} dari {records.length} laporan Monev.</p>
      </section>
    </div>
  );
}
