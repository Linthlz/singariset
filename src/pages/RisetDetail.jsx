import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import RisetCard from '../components/RisetCard.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { ErrorState, SkeletonGrid } from '../components/AsyncState.jsx';
import NotFound from './NotFound.jsx';
import { useDocumentations, usePublicResearch, usePublicResearches } from '../hooks/useResearch.js';
import { bidangById, rupiah } from '../lib/format.js';

export default function RisetDetail() {
  const { id: slug } = useParams();
  const { data: r, loading, error, reload } = usePublicResearch(slug);
  const dokumentasi = useDocumentations({ research: slug, limit: 1 });
  const terkait = usePublicResearches({ category: r?.bidang || '', limit: 4 });

  if (error?.status === 404) return <NotFound message={`Riset "${slug}" tidak ditemukan dalam katalog publik.`} />;
  if (loading && !r) {
    return <div className="mx-auto max-w-[1240px] px-5 py-12"><SkeletonGrid count={3} className="flex flex-col gap-5" itemClassName="h-48" /></div>;
  }
  if (error && !r) {
    return <div className="mx-auto max-w-[1240px] px-5 py-12"><ErrorState error={error} onRetry={reload} title="Gagal memuat detail riset" /></div>;
  }

  const b = r.bidangId ? bidangById(r.bidangId) : { nama: r.bidang || 'Umum', warna: '#6B7280' };
  const dok = dokumentasi.data?.[0];
  const related = (terkait.data || []).filter((x) => x.id !== r.id).slice(0, 3);
  const tim = r.grup?.anggota || [];

  return (
    <>
      <section className="relative overflow-hidden bg-maroon-900 py-10 text-white" style={{ backgroundImage: 'linear-gradient(135deg,#7A1616 0%,#6B1414 55%,#3B0A0A 100%)' }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(560px 300px at 92% 12%, rgba(249,199,79,.18), transparent 62%)' }} />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-[.78rem] text-white/60">
            <Link to="/" className="text-white/82 hover:text-gold-500">Beranda</Link><span className="opacity-50">/</span>
            <Link to="/riset" className="text-white/82 hover:text-gold-500">Riset Daerah</Link><span className="opacity-50">/</span>
            <span>{r.kode}</span>
          </nav>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-[.78rem] font-bold" style={{ background: b.warna + '30', color: '#fff' }}>{b.nama}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-[.78rem] font-bold text-success before:h-1.5 before:w-1.5 before:rounded-full before:bg-current">Berjalan</span>
            <span className="rounded-full bg-white/14 px-3 py-1 text-[.78rem] font-bold text-white">{r.kode}</span>
          </div>
          <h1 className="max-w-[900px] text-[clamp(1.5rem,3vw,2.2rem)] text-white">{r.judul}</h1>
          <p className="mt-2 max-w-[720px] text-white/80">
            {[r.pengusul, r.institusi, r.lokasi && `Kec. ${r.lokasi}`, r.periode].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-[1240px] gap-6 px-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <Reveal className="rounded-xl border border-line bg-white p-6 shadow-card">
              {r.abstrak && (
                <>
                  <h2 className="text-[1.15rem]">Abstrak</h2>
                  <p className="mb-5 whitespace-pre-line text-[.92rem] leading-relaxed">{r.abstrak}</p>
                </>
              )}
              <h2 className="text-[1.15rem]">Urgensi &amp; tujuan riset</h2>
              <p className="whitespace-pre-line text-[.92rem] leading-relaxed">{r.tujuan || '-'}</p>
              {r.signifikansi && (
                <>
                  <h2 className="mt-5 text-[1.15rem]">Signifikansi</h2>
                  <p className="whitespace-pre-line text-[.92rem] leading-relaxed">{r.signifikansi}</p>
                </>
              )}
              {r.rpjmd && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-info-bg bg-info-bg px-4 py-3.5 text-[.855rem] text-[#1E3A8A]">
                  <Icon name="target" size={19} className="mt-0.5 flex-none text-info" />
                  <p className="m-0"><strong className="mr-1">Sasaran RPJMD.</strong>{r.rpjmd}</p>
                </div>
              )}
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="text-[1.15rem]">Luaran yang dijanjikan</h2>
              <ul className="mb-0 list-none space-y-2 p-0 text-[.87rem]">
                {(r.luaranList.length ? r.luaranList : ['-']).map((l) => (
                  <li key={l} className="flex items-start gap-2 text-ink-2"><Icon name="check" size={15} className="mt-0.5 flex-none text-success" />{l}</li>
                ))}
              </ul>
              {r.penerimaManfaat && <p className="mb-0 mt-4 border-t border-line pt-4 text-[.86rem] text-ink-2"><b>Penerima manfaat langsung:</b> {r.penerimaManfaat}</p>}
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="text-[1.15rem]">Tim Peneliti</h2>
              <ul className="m-0 list-none space-y-2 p-0 text-[.87rem]">
                {(tim.length ? tim : [{ nama: r.pengusul, institusi: r.institusi, peran: 'leader' }]).map((t) => (
                  <li key={t.nama} className="flex items-start gap-2.5">
                    <Icon name="user" size={16} className={`mt-0.5 flex-none ${t.peran === 'leader' ? 'text-maroon-800' : 'text-ink-3'}`} />
                    <span><b>{t.nama}</b> · {t.peran === 'leader' ? 'Ketua Peneliti' : 'Anggota'}{t.institusi ? ` · ${t.institusi}` : ''}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <aside className="flex flex-col gap-5">
            <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
              <h3 className="mb-3.5 text-[1rem]">Dokumentasi kegiatan</h3>
              {dok ? (
                <>
                  <div className="mb-3 grid grid-cols-3 gap-1.5">
                    {dok.foto.slice(0, 3).map((f, i) => (
                      <SmartImage key={f.src} src={f.src} alt={f.ket} seed={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                  <p className="mb-1 text-[.86rem] font-semibold text-ink">{dok.judul}</p>
                  <p className="mb-3 text-[.84rem] leading-relaxed text-ink-2 line-clamp-3">{dok.narasi}</p>
                  <Link to={`/publikasi?dok=${dok.id}`} className="flex items-center justify-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2.5 text-center text-[.85rem] font-semibold text-white no-underline hover:bg-maroon-600">
                    Lihat dokumentasi lengkap <Icon name="arrow" size={15} />
                  </Link>
                </>
              ) : (
                <p className="m-0 text-[.84rem] text-ink-2">{dokumentasi.loading ? 'Memuat dokumentasi…' : 'Dokumentasi pelaksanaan riset ini belum diunggah oleh tim peneliti.'}</p>
              )}
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
              <h3 className="mb-3.5 text-[1rem]">Informasi pendanaan</h3>
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[.84rem]">
                <dt className="text-ink-3">Skema</dt><dd className="m-0 font-semibold">{r.skema || '-'}</dd>
                <dt className="text-ink-3">Anggaran</dt><dd className="m-0 font-semibold">{r.dana ? rupiah(r.dana) : '-'}</dd>
                <dt className="text-ink-3">Lokasi</dt><dd className="m-0 font-semibold">{r.alamat || r.lokasi || '-'}</dd>
              </dl>
            </Reveal>

            {r.mitraList.length > 0 && (
              <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
                <h3 className="mb-3.5 text-[1rem]">Mitra Pelaksana</h3>
                <ul className="m-0 list-none space-y-2 p-0 text-[.84rem]">
                  {[...new Set(r.mitraList)].map((m) => (
                    <li key={m} className="flex items-start gap-2.5"><Icon name="handshake" size={15} className="mt-0.5 flex-none text-maroon-800" />{m}</li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-10 max-w-[1240px] px-5">
            <h2 className="mb-4.5 text-[1.25rem]">Riset terkait</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((x) => <RisetCard key={x.id} r={x} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
