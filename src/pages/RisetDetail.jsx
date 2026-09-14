import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import RisetCard from '../components/RisetCard.jsx';
import SmartImage from '../components/SmartImage.jsx';
import NotFound from './NotFound.jsx';
import { RISET } from '../data/singaData.js';
import { useContent } from '../context/ContentContext.jsx';
import { bidangById, kecById, statusMeta } from '../lib/format.js';

export default function RisetDetail() {
  const { id } = useParams();
  const { dokumentasi: DOKUMENTASI } = useContent();
  const r = RISET.find((x) => x.id === id);
  if (!r) return <NotFound message={`Riset dengan kode "${id}" tidak ditemukan dalam katalog.`} />;

  const b = bidangById(r.bidang);
  const sm = statusMeta(r.status);
  const dok = DOKUMENTASI.find((d) => d.risetId === r.id);
  const related = RISET.filter((x) => x.id !== r.id && (x.bidang === r.bidang || x.kecamatan === r.kecamatan)).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-maroon-900 py-10 text-white" style={{ backgroundImage: 'linear-gradient(135deg,#7A1616 0%,#6B1414 55%,#3B0A0A 100%)' }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(560px 300px at 92% 12%, rgba(249,199,79,.18), transparent 62%)' }} />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-[.78rem] text-white/60">
            <Link to="/" className="text-white/82 hover:text-gold-500">Beranda</Link><span className="opacity-50">/</span>
            <Link to="/riset" className="text-white/82 hover:text-gold-500">Riset Daerah</Link><span className="opacity-50">/</span>
            <span>{r.id}</span>
          </nav>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-[.78rem] font-bold" style={{ background: b.warna + '30', color: '#fff' }}>{b.nama}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[.78rem] font-bold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${sm.badge}`}>{sm.label}</span>
            <span className="rounded-full bg-white/14 px-3 py-1 text-[.78rem] font-bold text-white">{r.id}</span>
          </div>
          <h1 className="max-w-[900px] text-[clamp(1.5rem,3vw,2.2rem)] text-white">{r.judul}</h1>
          <p className="mt-2 max-w-[720px] text-white/80">{r.peneliti} · {r.institusi} · Kec. {kecById(r.kecamatan).nama} · Tahun Anggaran {r.tahun}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-[1240px] gap-6 px-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <Reveal className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="text-[1.15rem]">Abstrak</h2>
              <p className="text-[.92rem] leading-relaxed">{r.abstrak}</p>
              <h2 className="mt-5 text-[1.15rem]">Rekomendasi</h2>
              <p className="text-[.92rem] leading-relaxed">{r.metodologi}</p>
              {r.catatanKendala && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning-bg bg-warning-bg px-4 py-3.5 text-[.855rem] text-[#78350F]">
                  <Icon name="alert" size={19} className="mt-0.5 flex-none text-warning" />
                  <p className="m-0"><strong className="mr-1">Catatan kendala.</strong>{r.catatanKendala}</p>
                </div>
              )}
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="text-[1.15rem]">Luaran &amp; Dampak</h2>
              <div className="mb-1.5 text-[.84rem] font-bold text-ink-3">Luaran yang dijanjikan</div>
              <ul className="mb-4 list-none space-y-2 p-0 text-[.87rem]">
                {r.luaran.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-ink-2"><Icon name="check" size={15} className="mt-0.5 flex-none text-success" />{l}</li>
                ))}
              </ul>
              <div className="mb-1.5 text-[.84rem] font-bold text-ink-3">Dampak lapangan</div>
              <p className="text-[.87rem] text-ink-2">{r.dampak}</p>
              <div className="mt-4 flex flex-wrap gap-3.5 border-t border-line pt-4 text-[.83rem]">
                <span className="rounded-full bg-info-bg px-3 py-1.25 font-semibold text-info">{r.publikasi} publikasi dihasilkan</span>
                {r.adopsi && <span className="rounded-full bg-success-bg px-3 py-1.25 font-semibold text-success">Rekomendasi diadopsi kebijakan</span>}
              </div>
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="text-[1.15rem]">Tim Peneliti</h2>
              <ul className="m-0 list-none space-y-2 p-0 text-[.87rem]">
                <li className="flex items-start gap-2.5"><Icon name="user" size={16} className="mt-0.5 flex-none text-maroon-800" /><span><b>{r.peneliti}</b> · Ketua Peneliti · NIDN {r.nidn}</span></li>
                {r.tim.map((t) => (
                  <li key={t} className="flex items-start gap-2.5"><Icon name="user" size={16} className="mt-0.5 flex-none text-ink-3" /><span>{t}</span></li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="flex flex-wrap gap-2">
              {r.tags.map((t) => <span key={t} className="rounded-full bg-surface-2 px-3 py-1.25 text-[.78rem] font-semibold text-ink-2">#{t}</span>)}
            </Reveal>
          </div>

          <aside className="flex flex-col gap-5">
            <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
              <h3 className="mb-3.5 text-[1rem]">Hasil Riset</h3>
              <div className="mb-4 flex justify-between text-[.76rem] font-semibold text-ink-3">
                <span>Capaian tahap {r.tahap}/7</span><b className="text-ink">{r.progress}%</b>
              </div>
              <div className="-mt-2.5 mb-4 h-2 overflow-hidden rounded-full bg-line"><div className={`h-full rounded-full bg-gradient-to-r ${sm.bar}`} style={{ width: `${r.progress}%` }} /></div>

              {dok ? (
                <>
                  <div className="mb-3 grid grid-cols-3 gap-1.5">
                    {dok.foto.slice(0, 3).map((f, i) => (
                      <SmartImage key={f.src} src={f.src} alt={f.ket} seed={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                  <p className="mb-3 text-[.84rem] leading-relaxed text-ink-2 line-clamp-3">{dok.narasi}</p>
                  <Link
                    to={`/publikasi?dok=${dok.id}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2.5 text-center text-[.85rem] font-semibold text-white no-underline hover:bg-maroon-600"
                  >
                    Lihat dokumentasi lengkap <Icon name="arrow" size={15} />
                  </Link>
                </>
              ) : (
                <p className="m-0 text-[.84rem] text-ink-2">Dokumentasi hasil riset ini sedang disiapkan dan akan tayang di Galeri Kegiatan BRIDA.</p>
              )}
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
              <h3 className="mb-3.5 text-[1rem]">Mitra Pelaksana</h3>
              <ul className="m-0 list-none space-y-2 p-0 text-[.84rem]">
                {r.mitra.map((m) => (
                  <li key={m} className="flex items-start gap-2.5"><Icon name="handshake" size={15} className="mt-0.5 flex-none text-maroon-800" />{m}</li>
                ))}
              </ul>
            </Reveal>
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
