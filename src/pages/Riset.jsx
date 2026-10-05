import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import RisetCard from '../components/RisetCard.jsx';
import AsyncState, { EmptyState } from '../components/AsyncState.jsx';
import { BIDANG, KECAMATAN } from '../data/singaData.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { usePublicResearches } from '../hooks/useResearch.js';
import { bidangById, kecById } from '../lib/format.js';

const PAGE_SIZE = 9;

export default function Riset() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [bidang, setBidang] = useState(params.get('bidang') || '');
  const [kec, setKec] = useState(params.get('kecamatan') || '');
  const [page, setPage] = useState(1);
  const cari = useDebounce(q.trim(), 400);

  useEffect(() => {
    setQ(params.get('q') || '');
    setKec(params.get('kecamatan') || '');
  }, [params]);

  useEffect(() => { setPage(1); }, [cari, bidang, kec]);

  const { data, meta, loading, error, reload } = usePublicResearches({
    page, limit: PAGE_SIZE, q: cari,
    category: bidang ? bidangById(bidang).nama : '',
    location: kec ? kecById(kec).nama : ''
  });
  const shown = data || [];
  const totalPages = Math.max(1, meta?.total_page || 1);
  const adaFilter = !!(cari || bidang || kec);

  function reset() {
    setQ(''); setBidang(''); setKec('');
    setParams({});
  }

  return (
    <>
      <PageHero
        crumb="Riset Daerah"
        title="Direktori Riset Daerah"
        lead="Katalog riset yang dibiayai dan difasilitasi BRIDA Kabupaten Buleleng. Saring berdasarkan bidang prioritas dan kecamatan lokasi riset."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">{meta ? `${meta.total} riset berjalan` : 'Memuat katalog…'}</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">9 kecamatan Buleleng</span>
        ]}
      />
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 rounded-xl border border-line-strong bg-surface-2 p-5">
            <div className="flex flex-wrap gap-2.5">
              <input
                type="search" placeholder="Cari judul riset…" value={q}
                onChange={(e) => setQ(e.target.value)}
                className="min-w-[240px] flex-1 rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600 focus:ring-3 focus:ring-maroon-600/12"
              />
              <select value={bidang} onChange={(e) => setBidang(e.target.value)} className="min-w-[180px] rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600">
                <option value="">Semua bidang</option>
                {BIDANG.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select>
              <select value={kec} onChange={(e) => setKec(e.target.value)} className="min-w-[170px] rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600">
                <option value="">Semua kecamatan</option>
                {KECAMATAN.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
            </div>
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-[.8rem] text-ink-3">Menampilkan <b>{shown.length}</b> dari <b>{meta?.total ?? 0}</b> riset yang cocok.</span>
              <button type="button" onClick={reset} className="rounded-lg px-3 py-1.5 text-[.82rem] font-semibold text-ink-2 hover:bg-surface-1">Atur ulang filter</button>
            </div>
          </Reveal>

          <AsyncState
            loading={loading}
            error={error}
            isEmpty={shown.length === 0}
            onRetry={reload}
            empty={adaFilter
              ? <EmptyState title="Tidak ada riset yang cocok" text="Longgarkan filter atau gunakan kata kunci lain." />
              : <EmptyState icon="flask" title="Belum ada riset berjalan" text="Riset yang telah disetujui BRIDA akan tampil di katalog ini." />}
          >
            <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
              {shown.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 90} className="h-full">
                  <RisetCard r={r} />
                </Reveal>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button type="button" disabled={page === 1 || loading} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-line-strong px-3.5 py-2 text-sm font-semibold disabled:opacity-40 hover:border-maroon-600">←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} type="button" onClick={() => setPage(p)} className={`h-9 w-9 rounded-lg text-sm font-semibold ${p === page ? 'bg-maroon-800 text-white' : 'border border-line-strong text-ink-2 hover:border-maroon-600'}`}>{p}</button>
                ))}
                <button type="button" disabled={page === totalPages || loading} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-line-strong px-3.5 py-2 text-sm font-semibold disabled:opacity-40 hover:border-maroon-600">→</button>
              </div>
            )}
          </AsyncState>
        </div>
      </section>
    </>
  );
}
