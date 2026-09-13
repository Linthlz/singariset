import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import Modal from '../components/Modal.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { SOSMED_RESMI } from '../data/singaData.js';
import { useContent } from '../context/ContentContext.jsx';
import { tanggal } from '../lib/format.js';

const KAT_WARNA = {
  Kebijakan: '#8E1B1B', Pendanaan: '#15803D', Monev: '#B45309',
  Kolaborasi: '#1D4ED8', Inovasi: '#0E7490', Diseminasi: '#7C3AED'
};

const KANAL = [
  { id: 'instagram', nama: 'Instagram', href: SOSMED_RESMI.instagram, warna: 'hover:bg-[#C13584] hover:border-[#C13584]' },
  { id: 'facebook', nama: 'Facebook', href: SOSMED_RESMI.facebook, warna: 'hover:bg-[#1877F2] hover:border-[#1877F2]' },
  { id: 'tiktok', nama: 'TikTok', href: SOSMED_RESMI.tiktok, warna: 'hover:bg-[#111827] hover:border-[#111827]' },
  { id: 'youtube', nama: 'YouTube', href: SOSMED_RESMI.youtube, warna: 'hover:bg-[#FF0000] hover:border-[#FF0000]' }
];

/** Tombol kanal sosial media untuk satu berita. */
function TautanSosmed({ ukuran = 'kecil' }) {
  const kecil = ukuran === 'kecil';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {KANAL.map((k) => (
        <a
          key={k.id}
          href={k.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Lihat unggahan berita ini di ${k.nama}`}
          title={`Buka di ${k.nama}`}
          className={`grid place-items-center rounded-lg border border-line text-ink-2 transition hover:text-white ${k.warna} ${
            kecil ? 'h-8 w-8' : 'h-9.5 w-9.5'
          }`}
        >
          <Icon name={k.id} size={kecil ? 15 : 17} />
        </a>
      ))}
    </div>
  );
}

export default function Berita() {
  const { berita: BERITA } = useContent();
  const [kategori, setKategori] = useState('');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState(null);

  const kategoriList = useMemo(() => ['', ...new Set(BERITA.map((b) => b.kategori))], [BERITA]);

  const hits = BERITA.filter((n) => {
    if (kategori && n.kategori !== kategori) return false;
    if (q && !`${n.judul} ${n.ringkas} ${n.penulis}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const [utama, ...sisa] = hits;

  return (
    <>
      <PageHero
        crumb="Berita & Diseminasi"
        title="Berita & Diseminasi Riset"
        lead="Kabar terkini ekosistem riset Kabupaten Buleleng, mulai dari pengumuman pendanaan, hasil monitoring, adopsi kebijakan, hingga agenda diseminasi hasil riset kepada masyarakat."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">{BERITA.length} kabar terbit</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">Humas BRIDA Buleleng</span>
        ]}
      />

      <section className="py-10">
        <div className="mx-auto max-w-[1240px] px-5">
          {/* Penyaring */}
          <Reveal className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Saring kategori berita">
              {kategoriList.map((k) => {
                const aktif = kategori === k;
                return (
                  <button
                    key={k || 'semua'} type="button" aria-pressed={aktif} onClick={() => setKategori(k)}
                    className={`rounded-full border px-3.5 py-1.75 text-[.8rem] font-semibold transition ${
                      aktif ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'
                    }`}
                  >
                    {k || 'Semua kategori'}
                  </button>
                );
              })}
            </div>
            <input
              type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari judul atau isi berita…" aria-label="Cari berita"
              className="input-base w-auto min-w-[240px]"
            />
          </Reveal>

          {hits.length === 0 ? (
            <div className="py-16 text-center text-ink-3">
              <Icon name="search" size={46} className="mx-auto mb-3.5 opacity-40" />
              <h3 className="text-[1.02rem] text-ink-2">Tidak ada berita yang cocok</h3>
              <p>Coba kata kunci lain atau pilih kategori berbeda.</p>
            </div>
          ) : (
            <>
              {/* Berita utama */}
              <Reveal className="mb-8 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                <div className="grid lg:grid-cols-2">
                  <SmartImage
                    src={utama.gambar} alt={utama.judul} seed={0}
                    className="aspect-video lg:aspect-auto lg:min-h-[340px]"
                  />
                  <div className="flex flex-col p-6 sm:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2.5">
                      <span className="rounded-full px-2.5 py-1 text-[.715rem] font-bold text-white" style={{ background: KAT_WARNA[utama.kategori] || '#8E1B1B' }}>
                        {utama.kategori}
                      </span>
                      <span className="rounded-full bg-gold-50 px-2.5 py-1 text-[.715rem] font-bold text-[#8A6400]">Berita utama</span>
                    </div>
                    <h2 className="mb-2.5 text-[clamp(1.2rem,2.2vw,1.6rem)] leading-snug">{utama.judul}</h2>
                    <div className="mb-3 flex items-center gap-1.75 text-[.78rem] font-semibold text-ink-3">
                      <Icon name="calendar" size={13} />{tanggal(utama.tanggal)} · {utama.penulis}
                    </div>
                    <p className="mb-5 flex-1 text-[.9rem] text-ink-2">{utama.ringkas}</p>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                      <button
                        type="button" onClick={() => setDetail(utama)}
                        className="rounded-lg bg-maroon-800 px-5 py-2.5 text-[.85rem] font-semibold text-white transition hover:bg-maroon-600"
                      >
                        Baca selengkapnya
                      </button>
                      <div>
                        <div className="mb-1.5 text-[.72rem] font-bold uppercase tracking-wide text-ink-3">Lihat di kanal kami</div>
                        <TautanSosmed ukuran="besar" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Daftar berita lain */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sisa.map((n, i) => (
                  <Reveal key={n.id} delay={i * 50} className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-pop">
                    <SmartImage src={n.gambar} alt={n.judul} seed={i + 1} className="aspect-video">
                      <span
                        className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[.715rem] font-bold text-white"
                        style={{ background: KAT_WARNA[n.kategori] || '#8E1B1B' }}
                      >
                        {n.kategori}
                      </span>
                    </SmartImage>

                    <div className="flex flex-1 flex-col p-4.5">
                      <div className="mb-1.75 flex items-center gap-1.75 text-[.74rem] font-semibold text-ink-3">
                        <Icon name="calendar" size={13} />{tanggal(n.tanggal)}
                      </div>
                      <h3 className="text-[.98rem] leading-snug">{n.judul}</h3>
                      <p className="mb-3.5 flex-1 text-[.835rem] line-clamp-3">{n.ringkas}</p>

                      <div className="flex items-center justify-between gap-3 border-t border-line pt-3.5">
                        <button
                          type="button" onClick={() => setDetail(n)}
                          className="flex items-center gap-1.5 text-[.8rem] font-semibold text-maroon-800 hover:underline"
                        >
                          Baca <Icon name="arrow" size={14} />
                        </button>
                        <TautanSosmed />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Ajakan mengikuti kanal */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="rounded-2xl p-7 text-white sm:p-9" style={{ backgroundImage: 'linear-gradient(135deg,#8E1B1B,#6B1414)' }}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-[560px]">
                <h2 className="mb-2 text-[1.35rem] text-white">Ikuti kanal resmi BRIDA Buleleng</h2>
                <p className="m-0 text-white/80">
                  Dokumentasi kegiatan, pengumuman pendanaan, dan cuplikan hasil riset juga kami bagikan
                  melalui media sosial. Pilih kanal yang paling nyaman Anda ikuti.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {KANAL.map((k) => (
                  <a
                    key={k.id} href={k.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-[.85rem] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20"
                  >
                    <Icon name={k.id} size={17} /> {k.nama}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {detail && (
        <Modal
          title={detail.judul}
          wide
          onClose={() => setDetail(null)}
          footer={
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <span className="text-[.8rem] text-ink-3">Bagikan / lihat di kanal kami</span>
              <TautanSosmed />
            </div>
          }
        >
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full px-2.5 py-1 text-[.715rem] font-bold text-white" style={{ background: KAT_WARNA[detail.kategori] || '#8E1B1B' }}>
              {detail.kategori}
            </span>
            <span className="text-[.78rem] text-ink-3">{tanggal(detail.tanggal)} · {detail.penulis}</span>
          </div>

          <SmartImage src={detail.gambar} alt={detail.judul} className="mb-5 aspect-video rounded-xl" />

          {(detail.isi || [detail.ringkas]).map((p, i) => (
            <p key={i} className="text-[.92rem] leading-relaxed text-ink-2">{p}</p>
          ))}
        </Modal>
      )}
    </>
  );
}
