import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import Modal from '../components/Modal.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { BIDANG, RISET } from '../data/singaData.js';
import { useContent } from '../context/ContentContext.jsx';
import { bidangById, kecById, tanggal } from '../lib/format.js';

/** Ubah tautan YouTube apa pun menjadi URL sematan. */
function embedYoutube(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default function Publikasi() {
  const { dokumentasi: DOKUMENTASI } = useContent();
  const [bidang, setBidang] = useState('');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const hits = useMemo(
    () =>
      DOKUMENTASI.filter((d) => {
        if (bidang && d.bidang !== bidang) return false;
        if (q && !`${d.judul} ${d.narasi}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [DOKUMENTASI, bidang, q]
  );

  const totalFoto = DOKUMENTASI.reduce((s, d) => s + d.foto.length, 0);

  return (
    <>
      <PageHero
        crumb="Publikasi & Dokumentasi"
        title="Publikasi & Dokumentasi Riset"
        lead="Arsip visual pelaksanaan riset daerah, berupa foto lapangan, rekaman video, dan narasi proses dari hulu sampai hasilnya dipakai masyarakat Buleleng."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">{DOKUMENTASI.length} riset terdokumentasi</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">{totalFoto} foto lapangan</span>
        ]}
      />

      <section className="py-10">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Saring bidang riset">
              <button
                type="button" aria-pressed={bidang === ''} onClick={() => setBidang('')}
                className={`rounded-full border px-3.5 py-1.75 text-[.8rem] font-semibold transition ${
                  bidang === '' ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'
                }`}
              >
                Semua bidang
              </button>
              {BIDANG.map((b) => {
                const n = DOKUMENTASI.filter((d) => d.bidang === b.id).length;
                if (!n) return null;
                const aktif = bidang === b.id;
                return (
                  <button
                    key={b.id} type="button" aria-pressed={aktif} onClick={() => setBidang(b.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.75 text-[.8rem] font-semibold transition ${
                      aktif ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'
                    }`}
                  >
                    {b.nama.split(' ')[0]} <span className="opacity-70">{n}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari dokumentasi riset…" aria-label="Cari dokumentasi"
              className="input-base w-auto min-w-[240px]"
            />
          </Reveal>

          {hits.length === 0 ? (
            <div className="py-16 text-center text-ink-3">
              <Icon name="camera" size={46} className="mx-auto mb-3.5 opacity-40" />
              <h3 className="text-[1.02rem] text-ink-2">Belum ada dokumentasi yang cocok</h3>
              <p>Longgarkan filter atau gunakan kata kunci lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {hits.map((d, i) => {
                const b = bidangById(d.bidang);
                const riset = RISET.find((r) => r.id === d.risetId);
                return (
                  <Reveal key={d.id} delay={i * 50} className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-pop">
                    {/* Mozaik foto */}
                    <div className="grid grid-cols-3 gap-0.5 bg-line">
                      <SmartImage
                        src={d.foto[0]?.src} alt={d.foto[0]?.ket || d.judul} seed={i}
                        className="col-span-2 aspect-[4/3] cursor-pointer"
                      >
                        <button
                          type="button" onClick={() => setLightbox({ dok: d, idx: 0 })}
                          aria-label={`Perbesar foto: ${d.foto[0]?.ket || d.judul}`}
                          className="absolute inset-0 z-10 transition hover:bg-ink/15"
                        />
                      </SmartImage>
                      <div className="flex flex-col gap-0.5">
                        {d.foto.slice(1, 3).map((f, fi) => (
                          <SmartImage key={f.src} src={f.src} alt={f.ket} seed={i + fi + 1} className="flex-1 cursor-pointer">
                            <button
                              type="button" onClick={() => setLightbox({ dok: d, idx: fi + 1 })}
                              aria-label={`Perbesar foto: ${f.ket}`}
                              className="absolute inset-0 z-10 transition hover:bg-ink/15"
                            />
                            {fi === 1 && d.foto.length > 3 && (
                              <span className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-ink/55 text-[.95rem] font-extrabold text-white">
                                +{d.foto.length - 3}
                              </span>
                            )}
                          </SmartImage>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full px-2.5 py-1 text-[.715rem] font-bold" style={{ background: b.warna + '18', color: b.warna }}>
                          {b.nama.split(' ')[0]}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[.715rem] font-bold text-ink-2">
                          <Icon name="camera" size={12} /> {d.foto.length} foto
                        </span>
                        {d.video && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-bg px-2.5 py-1 text-[.715rem] font-bold text-danger">
                            <Icon name="play" size={12} /> Video
                          </span>
                        )}
                      </div>

                      <h3 className="mb-1.5 text-[1.05rem] leading-snug">{d.judul}</h3>
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-[.78rem] text-ink-3">
                        <span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={13} />{tanggal(d.tanggal)}</span>
                        <span className="inline-flex items-center gap-1.5"><Icon name="pin" size={13} />Kec. {kecById(d.kecamatan).nama}</span>
                      </div>

                      <p className="mb-4 flex-1 text-[.86rem] text-ink-2 line-clamp-3">{d.narasi}</p>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                        <button
                          type="button" onClick={() => setDetail(d)}
                          className="rounded-lg bg-maroon-800 px-4 py-2 text-[.83rem] font-semibold text-white transition hover:bg-maroon-600"
                        >
                          Lihat dokumentasi
                        </button>
                        {riset && (
                          <Link to={`/riset/${riset.id}`} className="flex items-center gap-1.5 text-[.8rem] font-semibold text-ink-2 no-underline hover:text-maroon-800">
                            Detail riset <Icon name="arrow" size={14} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal dokumentasi lengkap */}
      {detail && (
        <Modal title={detail.judul} wide onClose={() => setDetail(null)}>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[.8rem] text-ink-3">
            <span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={13} />{tanggal(detail.tanggal)}</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="pin" size={13} />Kec. {kecById(detail.kecamatan).nama}</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="flask" size={13} />{detail.risetId}</span>
          </div>

          <h4 className="mb-2 text-[.95rem]">Narasi pelaksanaan</h4>
          <p className="mb-6 text-[.9rem] leading-relaxed text-ink-2">{detail.narasi}</p>

          <h4 className="mb-3 text-[.95rem]">Dokumentasi foto</h4>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {detail.foto.map((f, i) => (
              <figure key={f.src} className="m-0">
                <SmartImage src={f.src} alt={f.ket} seed={i} className="aspect-[4/3] cursor-pointer rounded-lg">
                  <button
                    type="button" onClick={() => setLightbox({ dok: detail, idx: i })}
                    aria-label={`Perbesar foto: ${f.ket}`}
                    className="absolute inset-0 z-10 transition hover:bg-ink/15"
                  />
                </SmartImage>
                <figcaption className="mt-1.5 text-[.75rem] leading-snug text-ink-3">{f.ket}</figcaption>
              </figure>
            ))}
          </div>

          <h4 className="mb-3 text-[.95rem]">Dokumentasi video</h4>
          {embedYoutube(detail.video) ? (
            <div className="aspect-video overflow-hidden rounded-xl bg-ink">
              <iframe
                src={embedYoutube(detail.video)}
                title={`Video dokumentasi ${detail.judul}`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-dashed border-line-strong bg-surface-1 px-4 py-4 text-[.85rem] text-ink-2">
              <Icon name="video" size={19} className="mt-0.5 flex-none text-ink-3" />
              <p className="m-0">
                <strong className="mr-1 text-ink">{detail.galeriVideo || 'Video belum tersedia.'}</strong>
                Tambahkan tautan YouTube pada kolom <code className="rounded bg-white px-1.5 py-0.5 text-[.8rem]">video</code> di
                <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[.8rem]">src/data/singaData.js</code>
                untuk menampilkannya di sini.
              </p>
            </div>
          )}
        </Modal>
      )}

      {/* Lightbox foto */}
      {lightbox && (
        <Modal
          title={lightbox.dok.foto[lightbox.idx]?.ket || lightbox.dok.judul}
          wide
          onClose={() => setLightbox(null)}
          footer={
            <div className="flex w-full items-center justify-between gap-3">
              <span className="text-[.8rem] text-ink-3">
                Foto {lightbox.idx + 1} dari {lightbox.dok.foto.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLightbox((l) => ({ ...l, idx: (l.idx - 1 + l.dok.foto.length) % l.dok.foto.length }))}
                  className="rounded-lg border border-line-strong px-4 py-2 text-[.83rem] font-semibold text-ink-2 hover:border-maroon-600 hover:text-maroon-800"
                >
                  ← Sebelumnya
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox((l) => ({ ...l, idx: (l.idx + 1) % l.dok.foto.length }))}
                  className="rounded-lg bg-maroon-800 px-4 py-2 text-[.83rem] font-semibold text-white hover:bg-maroon-600"
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          }
        >
          <SmartImage
            src={lightbox.dok.foto[lightbox.idx]?.src}
            alt={lightbox.dok.foto[lightbox.idx]?.ket}
            seed={lightbox.idx}
            className="aspect-video rounded-xl"
            imgClassName="object-contain bg-ink"
          />
        </Modal>
      )}
    </>
  );
}
