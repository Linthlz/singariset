import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import KecamatanMap from '../components/KecamatanMap.jsx';
import SmartImage from '../components/SmartImage.jsx';
import Modal from '../components/Modal.jsx';
import {
  ROADMAP, MITRA_LOGO
} from '../data/singaData.js';
import AsyncState, { EmptyState, ErrorState, SkeletonGrid } from '../components/AsyncState.jsx';
import { useFunding, useStats } from '../hooks/useContent.js';
import { usePublishedNews } from '../hooks/useNews.js';
import { tanggal, hariMenuju } from '../lib/format.js';

const QUICK = [
  { ico: 'flask', t: 'Riset Daerah', s: '169 riset terkatalog dari 9 kecamatan Buleleng', h: '/riset' },
  { ico: 'target', t: 'Peta Jalan Riset', s: 'Prioritas riset daerah 2025–2029 per sektor', h: '/roadmap' },
  { ico: 'money', t: 'Peluang Pendanaan', s: '6 skema hibah & insentif sedang dibuka', h: '/pendanaan' },
  { ico: 'handshake', t: 'Pengajuan Kolaborasi', s: 'Formulir usulan riset & mitra sasaran', h: '/kolaborasi' }
];

function buildEko(st) {
  const m = st.manual || {};
  return [
    { ico: 'flask', v: st.total_research, l: 'Riset daerah terdaftar', s: 'Seluruh usulan & riset yang tercatat' },
    { ico: 'users', v: st.researchers, l: 'Peneliti terdaftar', s: `Dari ${st.institutions} institusi mitra` },
    { ico: 'book', v: m.stat_publikasi || 0, l: 'Publikasi & luaran ilmiah', s: `${m.stat_hki || 0} HKI dan paten terdaftar` },
    { ico: 'pin', v: m.stat_desa_terdampak || 0, l: 'Desa/kelurahan terdampak', s: 'Dari total 148 desa & kelurahan' },
    { ico: 'award', v: m.stat_adopsi_kebijakan || 0, l: 'Rekomendasi diadopsi', s: 'Menjadi Perbup, Renja, atau SOP OPD' },
    { ico: 'doc', v: m.stat_policy_brief || 0, l: 'Policy brief tersedia', s: 'Ringkasan kebijakan siap pakai OPD' },
    { ico: 'chart', v: st.active_research, l: 'Riset aktif dimonitor', s: 'Disetujui dan sedang berjalan' },
    { ico: 'network', v: st.institutions, l: 'Institusi mitra', s: 'Perguruan tinggi, litbang, OPD, komunitas' }
  ];
}

/* Gambar kegiatan BRIDA untuk sisi depan kartu — taruh berkas di
   public/images/profil/. Bila belum ada, latar bermotif otomatis tampil. */
const PILAR = [
  { ico: 'handshake', t: 'Kolaborasi', img: '/images/profil/1.jpg',
    p: 'Menjodohkan kebutuhan nyata OPD dan komunitas dengan kapasitas peneliti perguruan tinggi.',
    li: ['Formulir usulan satu pintu', 'Pemilihan mitra sasaran terstruktur', 'Verifikasi 4 tahap yang transparan'] },
  { ico: 'lightbulb', t: 'Inovasi', img: '/images/profil/2.jpg',
    p: 'Mendorong riset naik dari laporan menjadi purwarupa dan produk yang dipakai masyarakat.',
    li: ['Pendampingan hilirisasi UMKM', 'Fasilitasi HKI dan paten', 'Uji lapangan bersama mitra'] },
  { ico: 'layers', t: 'Data', img: '/images/profil/3.jpg',
    p: 'Menyatukan seluruh jejak riset daerah dalam basis data tunggal yang dapat diaudit.',
    li: ['Integrasi Satu Data Buleleng', 'Repositori publikasi terbuka', 'Dashboard anggaran real-time'] },
  { ico: 'award', t: 'Dampak', img: '/images/profil/4.jpeg',
    p: 'Mengukur apakah riset benar-benar mengubah kebijakan dan kondisi lapangan.',
    li: ['Policy brief wajib per riset', 'Pelacakan adopsi kebijakan', 'Evaluasi manfaat bagi sasaran'] }
];

const KAT_WARNA = {
  Kebijakan: '#8E1B1B', Pendanaan: '#15803D', Monev: '#B45309',
  Kolaborasi: '#1D4ED8', Inovasi: '#0E7490', Diseminasi: '#7C3AED'
};

const FUND_STATUS = {
  open: { l: 'Dibuka', c: 'bg-success-bg text-success', border: 'before:bg-success' },
  closing: { l: 'Segera Tutup', c: 'bg-danger-bg text-danger', border: 'before:bg-danger' },
  soon: { l: 'Akan Dibuka', c: 'bg-info-bg text-info', border: 'before:bg-gold-500' }
};

/* Kartu pilar dengan foto kegiatan BRIDA di depan; membalik saat disentuh
   atau diklik untuk menampilkan narasinya. */
function PilarCard({ p, i }) {
  const [flip, setFlip] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flip}
      aria-label={`${p.t} — tampilkan penjelasan`}
      onClick={() => setFlip((f) => !f)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip((f) => !f); } }}
      className={`flip-card h-[320px] cursor-pointer rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-maroon-600/30 sm:h-[430px] lg:h-[390px] ${flip ? 'is-flipped' : ''}`}
    >
      <div className="flip-inner">
        {/* Sisi depan — foto kegiatan */}
        <div className="flip-face rounded-2xl border border-line bg-white shadow-card">
          <SmartImage src={p.img} alt={`Kegiatan BRIDA — ${p.t}`} seed={i} className="h-full w-full" />
          <span className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(180deg, rgba(26,4,4,.12) 35%, rgba(26,4,4,.88) 100%)' }} />
          <span className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-xl text-gold-500" style={{ backgroundImage: 'linear-gradient(140deg,#8E1B1B,#C62828)' }}>
            <Icon name={p.ico} size={22} />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-[1.3rem] leading-tight text-white">{p.t}</h3>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[.78rem] font-semibold text-gold-500">
              Lihat penjelasan <Icon name="refresh" size={13} />
            </span>
          </div>
        </div>

        {/* Sisi belakang — narasi */}
        <div className="flip-face flip-face-back flex flex-col rounded-2xl border border-maroon-900 p-5" style={{ backgroundImage: 'linear-gradient(150deg,#8E1B1B,#4A0D0D)' }}>
          <h3 className="mb-2.5 text-[1.15rem] text-white">{p.t}</h3>
          <p className="mb-3 text-[.86rem] leading-relaxed text-white/85">{p.p}</p>
          <ul className="m-0 list-none space-y-1.5 p-0 text-[.82rem]">
            {p.li.map((l) => (
              <li key={l} className="flex items-start gap-2 text-white/78">
                <span className="mt-0.5 flex-none font-extrabold text-gold-500">✓</span>{l}
              </li>
            ))}
          </ul>
          <span className="mt-auto pt-3 text-[.74rem] font-semibold text-white/55">Klik lagi untuk kembali</span>
        </div>
      </div>
    </div>
  );
}

/* Kartu berita bergaya foto penuh — seluruh kartu bisa diklik untuk membuka detail. */
function NewsCard({ n, i, big, onOpen }) {
  const c = KAT_WARNA[n.kategori] || '#8E1B1B';
  return (
    <button
      type="button"
      onClick={() => onOpen(n)}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-line text-left shadow-card transition hover:-translate-y-1 hover:shadow-pop ${
        big ? 'aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[420px]' : 'aspect-[4/5] sm:aspect-[4/3]'
      }`}
    >
      <div className="absolute inset-0">
        <SmartImage src={n.gambar} alt={n.judul} seed={i} className="h-full w-full" imgClassName="transition duration-500 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <span
        className="absolute left-3 top-3 z-10 rounded-full px-2 py-0.75 text-[.62rem] sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[.7rem] font-bold uppercase tracking-wide text-white"
        style={{ background: c }}
      >
        {n.kategori}
      </span>
      <div className={`absolute inset-x-0 bottom-0 z-10 sm:p-5.5 ${big ? 'p-4' : 'p-3'}`}>
        <h3 className={`mb-1.5 leading-snug text-white ${big ? 'text-[1.15rem] sm:text-[1.55rem]' : 'line-clamp-4 text-[.86rem] sm:line-clamp-none sm:text-[1rem]'}`}>{n.judul}</h3>
        <div className="flex items-center gap-1.5 text-[.7rem] font-semibold text-white/78 sm:text-[.78rem]">
          <Icon name="calendar" size={13} />{tanggal(n.tanggal)}
        </div>
      </div>
    </button>
  );
}

/** Logo mitra dengan jaring pengaman — kotak polos bila berkas logo belum diunggah. */
function MitraLogo({ src }) {
  const [gagal, setGagal] = useState(!src);
  if (gagal) return <div className="h-full w-full rounded-lg border border-dashed border-line-strong" aria-hidden="true" />;
  return (
    <img
      src={src} alt="" loading="lazy" onError={() => setGagal(true)}
      className="max-h-14 max-w-full object-contain grayscale transition duration-300 hover:grayscale-0"
    />
  );
}

/** Baris logo mitra yang bergeser otomatis ke kiri (marquee) dan bisa digeser manual. */
function MitraCarousel({ items }) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half - 4) track.scrollLeft -= half;
      track.scrollBy({ left: 176, behavior: 'smooth' });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  function geser(arah) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: arah * 352, behavior: 'smooth' });
  }

  return (
    <div className="relative" onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }}>
      <button
        type="button" onClick={() => geser(-1)} aria-label="Geser logo mitra ke kiri"
        className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-maroon-800 shadow-lift transition hover:border-maroon-600 hover:bg-maroon-50 sm:grid"
      >
        <Icon name="arrow" size={16} className="rotate-180" />
      </button>

      <div ref={trackRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-1 py-1">
        {[...items, ...items].map((m, i) => (
          <div
            key={`${m.id}-${i}`}
            className="grid h-24 w-40 flex-none place-items-center rounded-xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-lift"
          >
            <MitraLogo src={m.logo} />
          </div>
        ))}
      </div>

      <button
        type="button" onClick={() => geser(1)} aria-label="Geser logo mitra ke kanan"
        className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-line bg-white text-maroon-800 shadow-lift transition hover:border-maroon-600 hover:bg-maroon-50 sm:grid"
      >
        <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}

export default function Home() {
  const pendanaan = useFunding();
  const PENDANAAN = (pendanaan.data || []).filter((f) => f.status !== 'soon');
  const stats = useStats();
  const EKO = stats.data ? buildEko(stats.data) : null;
  const [detailBerita, setDetailBerita] = useState(null);
  const mitraTrackRef = useRef(null);

  const berita = usePublishedNews({ limit: 5 });
  const beritaSorot = berita.data || [];
  const beritaBesar = beritaSorot[0];
  const beritaKecil = beritaSorot.slice(1, 5);

  return (
    <>
      {/* ===== 1.1 HERO — slider gambar otomatis 7 detik ===== */}
      <HeroSlider />

      {/* ===== 1.2 QUICK ACCESS ===== */}
      <section className="relative z-20 -mt-10 sm:-mt-8">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {QUICK.map((q, i) => (
              <Reveal key={q.t} as={Link} delay={i * 90} to={q.h} className="group flex flex-col items-start gap-2.5 rounded-xl border border-line bg-white p-3.5 no-underline shadow-lift sm:flex-row sm:gap-3.5 sm:p-4.5 transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-pop">
                <span className="grid h-9.5 w-9.5 flex-none place-items-center rounded-[10px] bg-maroon-50 sm:h-10.5 sm:w-10.5 text-maroon-800 transition group-hover:bg-maroon-800 group-hover:text-gold-500">
                  <Icon name={q.ico} size={21} />
                </span>
                <span>
                  <strong className="mb-0.5 block text-[.86rem] font-bold leading-snug text-ink sm:text-[.93rem]">{q.t}</strong>
                  <span className="block text-[.75rem] leading-snug text-ink-3 sm:text-[.785rem]">{q.s}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 1.3 EKOSISTEM RISET ===== */}
      <section className="py-10 sm:py-14 lg:py-18" id="ekosistem">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <Reveal className="mx-auto mb-6 sm:mb-8.5 max-w-[760px] text-center">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Ekosistem Riset Buleleng</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Riset daerah yang terhitung, terpantau, dan tercatat dampaknya</h2>
            <p className="text-[.95rem] text-ink-2 sm:text-[1.02rem]">Setiap angka ditarik dari basis data tunggal BRIDA sehingga capaian riset, serapan anggaran, dan jangkauan wilayah dapat diaudit publik kapan saja.</p>
          </Reveal>
          {!EKO ? (
            stats.error
              ? <ErrorState error={stats.error} onRetry={stats.reload} title="Statistik belum dapat dimuat" />
              : <SkeletonGrid count={8} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" itemClassName="h-36" />
          ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {EKO.map((e) => (
              <Reveal key={e.l} className="rounded-xl border border-line bg-white p-4 sm:p-5.5 shadow-card transition hover:-translate-y-1 hover:shadow-pop">
                <span className="mb-2.5 grid h-9 w-9 place-items-center rounded-[10px] bg-gold-50 sm:mb-3 sm:h-9.5 sm:w-9.5 text-gold-600"><Icon name={e.ico} size={19} /></span>
                <CountUp value={e.v} className="font-head text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-tight text-maroon-800" />
                <div className="mt-1 text-[.8rem] font-bold leading-snug text-ink sm:text-[.84rem]">{e.l}</div>
                <div className="mt-0.5 text-[.72rem] leading-snug text-ink-3 sm:text-[.755rem]">{e.s}</div>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ===== 1.4 EMPAT PILAR ===== */}
      <section className="py-10 sm:py-14 lg:py-18" id="pilar">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <Reveal className="mb-8.5 max-w-[760px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Profil Sinergi Riset</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Empat pilar kerja SINGA RISET BULELENG</h2>
            <p className="text-[.95rem] text-ink-2 sm:text-[1.02rem]">Platform ini bukan sekadar arsip. Ia menjadi mesin tata kelola yang menautkan usulan riset dengan prioritas pembangunan daerah, lalu mengawalnya sampai terpakai di lapangan.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {PILAR.map((p, i) => (
              <Reveal key={p.t} delay={i * 110}>
                <PilarCard p={p} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 1.7 PETA JALAN RISET — kartu foto kegiatan ===== */}
      <section className="py-10 sm:py-14 lg:py-18" id="petajalan">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <Reveal className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Peta Jalan Riset 2025–2029</span>
              <h2 className="max-w-[18ch] text-[clamp(1.45rem,2.7vw,2.05rem)]">Lima tahap menuju ekosistem riset mandiri Bali Utara</h2>
            </div>
            <p className="mb-0 self-center text-[.95rem] text-ink-2 sm:text-[1.02rem]">
              Setiap tahun punya fokus program tersendiri, mulai dari penataan tata kelola sampai kemandirian pendanaan riset. Peta jalan ini juga menjadi indikator pertama dalam penilaian usulan riset oleh tim pakar BRIDA.
            </p>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 self-center justify-self-start rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink no-underline transition hover:border-maroon-800 hover:text-maroon-800 lg:justify-self-end"
            >
              Detail peta jalan <Icon name="arrow" size={15} />
            </Link>
          </Reveal>

          {/* HP: kartu digeser ke samping (snap) agar lima tahap tidak menumpuk setinggi ±1900px */}
          <div className="no-scrollbar -mx-4 grid snap-x snap-mandatory auto-cols-[80%] grid-flow-col gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 sm:mx-0 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {ROADMAP.map((r, i) => (
              <Reveal key={r.tahun} delay={i * 100} className="snap-start">
                <article className="group relative h-[340px] overflow-hidden sm:h-[380px] rounded-2xl border border-line shadow-card transition duration-500 hover:-translate-y-1.5 hover:shadow-pop">
                  <div className="absolute inset-0">
                    <SmartImage
                      src={r.gambar} alt={`Kegiatan BRIDA — ${r.tema}`} seed={i}
                      className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(180deg, rgba(26,4,4,.72) 0%, rgba(26,4,4,.28) 42%, rgba(26,4,4,.92) 100%)' }} />

                  <div className="absolute inset-x-0 top-0 p-4.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.7rem] font-bold uppercase tracking-widest ${
                      r.status === 'current' ? 'bg-gold-500 text-[#4A2D00]' : 'bg-white/18 text-white backdrop-blur'
                    }`}>
                      {r.tahun}{r.status === 'current' ? ' · berjalan' : ''}
                    </span>
                    <h3 className="mt-2.5 text-[1.12rem] leading-snug text-white">{r.tema}</h3>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4.5">
                    <p className="mb-2.5 text-[.84rem] leading-relaxed text-white/85">{r.target}</p>
                    <div className="flex items-start gap-2 border-t border-white/20 pt-2.5 text-[.76rem] font-semibold text-gold-500">
                      <Icon name="target" size={14} className="mt-0.5 flex-none" />{r.indikator}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 1.8 PELUANG PENDANAAN ===== */}
      <section className="py-10 sm:py-14 lg:py-18" id="pendanaan">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <Reveal className="mb-8.5 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[640px]">
              <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Peluang Pendanaan Riset</span>
              <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Skema hibah dan insentif yang sedang dibuka</h2>
              <p className="mb-0 text-[.95rem] text-ink-2 sm:text-[1.02rem]">Pantau tenggat dan persyaratan tiap skema. Rincian pagu serta tata cara pengajuan mengikuti pengumuman resmi di situs penyelenggara masing-masing.</p>
            </div>
            <Link to="/pendanaan" className="rounded-lg border border-line-strong bg-white px-5 py-2.5 text-sm font-semibold text-maroon-800 no-underline transition hover:border-maroon-800 hover:bg-maroon-50">
              Lihat semua skema →
            </Link>
          </Reveal>
          <AsyncState loading={pendanaan.loading} error={pendanaan.error} isEmpty={PENDANAAN.length === 0} onRetry={pendanaan.reload}
            empty={<EmptyState icon="money" title="Belum ada skema yang dibuka" text="Pantau halaman Peluang Pendanaan untuk pengumuman berikutnya." />}>
          <Reveal className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {PENDANAAN.slice(0, 3).map((f) => {
              const sisa = hariMenuju(f.deadline);
              const fs = FUND_STATUS[f.status] || FUND_STATUS.open;
              const dlCls = sisa < 0 ? 'bg-surface-1 text-ink-2' : sisa <= 30 ? 'bg-danger-bg text-danger font-semibold' : sisa <= 75 ? 'bg-warning-bg text-warning font-semibold' : 'bg-surface-1 text-ink-2';
              return (
                <article key={f.id} className={`relative flex flex-col overflow-hidden rounded-xl border border-line bg-white p-4 sm:p-5.5 shadow-card transition hover:-translate-y-1 hover:shadow-pop before:absolute before:inset-x-0 before:top-0 before:h-1 ${fs.border}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.715rem] font-bold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${fs.c}`}>{fs.l}</span>
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[.715rem] font-bold text-ink-2">{f.kuota} kuota</span>
                  </div>
                  <h3 className="text-[1rem] leading-snug">{f.nama}</h3>
                  <p className="mb-3 text-[.8rem] text-ink-3">{f.penyelenggara}</p>
                  <div className={`mb-3 flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[.8rem] ${dlCls}`}>
                    <Icon name="clock" size={16} />
                    <span>{sisa < 0 ? `Pendaftaran ditutup ${tanggal(f.deadline)}` : <>Ditutup {tanggal(f.deadline)} · <b>{sisa} hari lagi</b></>}</span>
                  </div>
                  <ul className="m-0 mb-3.5 list-none space-y-1.5 p-0 text-[.81rem]">
                    {f.syarat.slice(0, 3).map((s) => (
                      <li key={s} className="flex items-start gap-2 text-ink-2"><Icon name="check" size={14} className="mt-0.5 flex-none text-success" />{s}</li>
                    ))}
                  </ul>
                  <p className="mb-3.5 text-[.79rem] text-ink-3">{f.ket}</p>
                  {f.situs && <div className="mt-auto flex gap-2">
                    <a
                      href={f.situs} target="_blank" rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-maroon-800 px-3 py-2 text-center text-[.82rem] font-semibold text-white no-underline hover:bg-maroon-600"
                    >
                      Kunjungi penyelenggara <Icon name="external" size={14} />
                    </a>
                    <a
                      href={f.situs} target="_blank" rel="noopener noreferrer"
                      title={`Syarat lengkap di situs ${f.situsNama}`}
                      className="flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-2 text-[.82rem] font-semibold text-ink-2 no-underline hover:border-maroon-600 hover:text-maroon-800"
                    >
                      Syarat <Icon name="external" size={13} />
                    </a>
                  </div>}
                </article>
              );
            })}
          </Reveal>
          </AsyncState>
        </div>
      </section>

      {/* ===== 1.9 BERITA & DISEMINASI ===== */}
      <section className="py-10 sm:py-14 lg:py-18" id="berita">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <Reveal className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
            <div className="max-w-[640px]">
              <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Berita &amp; Diseminasi Riset</span>
              <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Kabar terkini ekosistem riset Buleleng</h2>
              <p className="mb-0 text-[.95rem] text-ink-2 sm:text-[1.02rem]">Pengumuman pendanaan, hasil monev, adopsi kebijakan, dan agenda diseminasi dari BRIDA Kabupaten Buleleng.</p>
            </div>
            <Link to="/berita" className="rounded-lg border border-line-strong bg-white px-5 py-2.5 text-sm font-semibold text-maroon-800 no-underline transition hover:border-maroon-800 hover:bg-maroon-50">
              Lihat semua berita →
            </Link>
          </Reveal>
          <AsyncState
            loading={berita.loading}
            error={berita.error}
            isEmpty={beritaSorot.length === 0}
            onRetry={berita.reload}
            skeleton={<SkeletonGrid count={2} className="grid grid-cols-1 gap-5 lg:grid-cols-2" itemClassName="h-[280px] rounded-2xl sm:h-[420px]" />}
            empty={<EmptyState icon="doc" title="Belum ada berita terbit" text="Kabar terbaru dari BRIDA Buleleng akan tampil di sini." />}
          >
            {beritaBesar && (
              <Reveal className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-2">
                <NewsCard key={beritaBesar.id} n={beritaBesar} i={0} big onOpen={setDetailBerita} />
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  {beritaKecil.map((n, i) => (
                    <NewsCard key={n.id} n={n} i={i + 1} onOpen={setDetailBerita} />
                  ))}
                </div>
              </Reveal>
            )}
          </AsyncState>
        </div>
      </section>

      {/* ===== 1.12 MITRA STRATEGIS ===== */}
      <section className="py-10 sm:py-14 lg:py-18" id="mitra">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <Reveal className="mx-auto mb-6 sm:mb-8.5 max-w-[760px] text-center">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Mitra Strategis Pentahelix</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Perguruan tinggi, pemerintah, komunitas, dan dunia usaha</h2>
            <p className="text-[.95rem] text-ink-2 sm:text-[1.02rem]">Lebih dari 30 lembaga litbang dan perguruan tinggi bekerja sama dengan dinas teknis, kelompok subak, pengelola wisata, dan pelaku UMKM di Kabupaten Buleleng.</p>
          </Reveal>
          <Reveal>
            <MitraCarousel items={MITRA_LOGO} />
          </Reveal>

          <Reveal className="mt-6 rounded-xl border-none p-4.5 sm:p-6.5 text-white" style={{ backgroundImage: 'linear-gradient(135deg,#8E1B1B,#6B1414)' }}>
            <div className="flex flex-wrap items-center justify-between gap-5 sm:gap-6">
              <div className="max-w-[620px]">
                <h3 className="mb-2 text-white">Punya kebutuhan riset di instansi atau komunitas Anda?</h3>
                <p className="m-0 text-white/80">Sampaikan persoalan lapangan yang dihadapi dinas, subak, pokdarwis, atau UMKM Anda. BRIDA akan menjodohkannya dengan peneliti yang relevan pada batch pendanaan berikutnya.</p>
              </div>
              <div className="grid w-full gap-2.5 sm:flex sm:w-auto sm:flex-wrap">
                <Link to="/kolaborasi" className="rounded-lg bg-gold-500 px-6.5 py-3.25 text-center text-[.92rem] sm:py-3.5 sm:text-[.96rem] font-semibold text-[#4A2D00] no-underline transition hover:bg-gold-600">Ajukan kolaborasi riset</Link>
                <Link to="/etika-regulasi" className="rounded-lg border border-white/28 bg-white/10 px-6.5 py-3.25 text-center text-[.92rem] sm:py-3.5 sm:text-[.96rem] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20">Pelajari tata kelola</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {detailBerita && (
        <Modal title={detailBerita.judul} wide onClose={() => setDetailBerita(null)}>
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full px-2.5 py-1 text-[.715rem] font-bold text-white" style={{ background: KAT_WARNA[detailBerita.kategori] || '#8E1B1B' }}>
              {detailBerita.kategori}
            </span>
            <span className="text-[.78rem] text-ink-3">{tanggal(detailBerita.tanggal)} · {detailBerita.penulis}</span>
          </div>
          <SmartImage src={detailBerita.gambar} alt={detailBerita.judul} className="mb-5 aspect-video rounded-xl" />
          {(detailBerita.isi || [detailBerita.ringkas]).map((p, i) => (
            <p key={i} className="text-[.92rem] leading-relaxed text-ink-2">{p}</p>
          ))}
          <Link to="/berita" onClick={() => setDetailBerita(null)} className="mt-4 inline-flex items-center gap-1.5 text-[.85rem] font-semibold text-maroon-800 no-underline hover:underline">
            Lihat semua berita <Icon name="arrow" size={14} />
          </Link>
        </Modal>
      )}
    </>
  );
}
