import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import RisetCard from '../components/RisetCard.jsx';
import KecamatanMap from '../components/KecamatanMap.jsx';
import Icon from '../components/Icon.jsx';
import { RISET, BIDANG, KECAMATAN, SKEMA } from '../data/singaData.js';

const STATUSES = [
  { id: '', l: 'Semua status' },
  { id: 'ontrack', l: 'On Track' },
  { id: 'warning', l: 'Warning / Koreksi' },
  { id: 'delayed', l: 'Delayed' },
  { id: 'selesai', l: 'Selesai & Adopsi' }
];

const PAGE_SIZE = 9;

export default function Riset() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [bidang, setBidang] = useState(params.get('bidang') || '');
  const [kec, setKec] = useState(params.get('kecamatan') || '');
  const [skema, setSkema] = useState(params.get('skema') || '');
  const [status, setStatus] = useState(params.get('status') || '');
  const [tahun, setTahun] = useState(params.get('tahun') || '');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQ(params.get('q') || '');
    setKec(params.get('kecamatan') || '');
  }, [params]);

  useEffect(() => { setPage(1); }, [q, bidang, kec, skema, status, tahun]);

  const hits = useMemo(() => {
    const qq = q.toLowerCase();
    return RISET.filter((r) => {
      if (bidang && r.bidang !== bidang) return false;
      if (kec && r.kecamatan !== kec) return false;
      if (skema && r.skema !== skema) return false;
      if (status && r.status !== status) return false;
      if (tahun && String(r.tahun) !== tahun) return false;
      if (qq) {
        const hay = `${r.judul} ${r.peneliti} ${r.tags.join(' ')} ${r.abstrak} ${r.institusi}`.toLowerCase();
        if (!hay.includes(qq)) return false;
      }
      return true;
    });
  }, [q, bidang, kec, skema, status, tahun]);

  const totalPages = Math.max(1, Math.ceil(hits.length / PAGE_SIZE));
  const shown = hits.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tahunOpts = [...new Set(RISET.map((r) => r.tahun))].sort((a, b) => b - a);

  function reset() {
    setQ(''); setBidang(''); setKec(''); setSkema(''); setStatus(''); setTahun('');
    setParams({});
  }

  return (
    <>
      <PageHero
        crumb="Riset Daerah"
        title="Direktori Riset Daerah"
        lead="Katalog lengkap riset yang dibiayai dan difasilitasi BRIDA Kabupaten Buleleng. Saring berdasarkan bidang prioritas, kecamatan, skema pendanaan, dan status monitoring."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">{RISET.length} riset terkatalog</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">9 kecamatan Buleleng</span>
        ]}
      />

      {/* Peta sebaran riset — section tersendiri, lebih besar */}
      <section className="bg-surface-1 py-14 sm:py-18">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 text-center">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Peta Sebaran Riset</span>
            <h2 className="mx-auto max-w-[46ch] text-[clamp(1.45rem,2.7vw,2.05rem)]">Sebaran riset di 9 kecamatan Kabupaten Buleleng</h2>
            <p className="mx-auto mb-0 max-w-[62ch] text-[1.02rem] text-ink-2">Klik salah satu wilayah pada peta untuk membuka detail fokus riset, sebaran per bidang prioritas, dan judul riset yang sedang berjalan di kecamatan tersebut.</p>
          </Reveal>
        </div>
        <div className="mx-auto max-w-[2280px] px-5">
          <Reveal>
            <KecamatanMap />
          </Reveal>
        </div>
      </section>

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 rounded-xl border border-line-strong bg-surface-2 p-5">
            <div className="mb-3.5 flex flex-wrap gap-2.5">
              <input
                type="search" placeholder="Cari judul riset, peneliti, atau kata kunci…" value={q}
                onChange={(e) => setQ(e.target.value)}
                className="min-w-[240px] flex-1 rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600 focus:ring-3 focus:ring-maroon-600/12"
              />
              <select value={bidang} onChange={(e) => setBidang(e.target.value)} className="min-w-[180px] rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600">
                <option value="">Semua bidang</option>
                {BIDANG.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select>
              <select value={kec} onChange={(e) => setKec(e.target.value)} className="min-w-[160px] rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600">
                <option value="">Semua kecamatan</option>
                {KECAMATAN.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
              <select value={skema} onChange={(e) => setSkema(e.target.value)} className="min-w-[170px] rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600">
                <option value="">Semua skema</option>
                {SKEMA.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
              </select>
              <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="min-w-[130px] rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600">
                <option value="">Semua TA</option>
                {tahunOpts.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Saring status riset">
              {STATUSES.map((s) => {
                const n = s.id ? RISET.filter((r) => r.status === s.id).length : RISET.length;
                const active = status === s.id;
                return (
                  <button key={s.id || 'all'} type="button" aria-pressed={active} onClick={() => setStatus(s.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.75 text-[.8rem] font-semibold transition ${active ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'}`}>
                    {s.l} <span className="opacity-70">{n}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-[.8rem] text-ink-3">Menampilkan <b>{shown.length}</b> dari <b>{hits.length}</b> riset yang cocok.</span>
              <button type="button" onClick={reset} className="rounded-lg px-3 py-1.5 text-[.82rem] font-semibold text-ink-2 hover:bg-surface-1">Atur ulang filter</button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.length ? shown.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 90} className="h-full">
                <RisetCard r={r} />
              </Reveal>
            )) : (
              <Reveal className="col-span-full py-14 text-center text-ink-3">
                <Icon name="search" size={46} className="mx-auto mb-3.5 opacity-40" />
                <h3 className="text-[1.02rem] text-ink-2">Tidak ada riset yang cocok</h3>
                <p>Longgarkan filter atau gunakan kata kunci lain.</p>
              </Reveal>
            )}
          </div>

          {totalPages > 1 && (
            <Reveal className="mt-8 flex items-center justify-center gap-2">
              <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-line-strong px-3.5 py-2 text-sm font-semibold disabled:opacity-40 hover:border-maroon-600">←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} type="button" onClick={() => setPage(p)} className={`h-9 w-9 rounded-lg text-sm font-semibold ${p === page ? 'bg-maroon-800 text-white' : 'border border-line-strong text-ink-2 hover:border-maroon-600'}`}>{p}</button>
              ))}
              <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-line-strong px-3.5 py-2 text-sm font-semibold disabled:opacity-40 hover:border-maroon-600">→</button>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
