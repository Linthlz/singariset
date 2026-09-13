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
  ROADMAP, STATS, MITRA_LOGO
} from '../data/singaData.js';
import { useContent } from '../context/ContentContext.jsx';
import { tanggal, hariMenuju } from '../lib/format.js';

const QUICK = [
  { ico: 'flask', t: 'Riset Daerah', s: '169 riset terkatalog dari 9 kecamatan Buleleng', h: '/riset' },
  { ico: 'target', t: 'Peta Jalan Riset', s: 'Prioritas riset daerah 2025–2029 per sektor', h: '/roadmap' },
  { ico: 'money', t: 'Peluang Pendanaan', s: '6 skema hibah & insentif sedang dibuka', h: '/#pendanaan' },
  { ico: 'handshake', t: 'Pengajuan Kolaborasi', s: 'Formulir usulan riset & mitra sasaran', h: '/kolaborasi' }
];

const EKO = [
  { ico: 'flask', v: STATS.totalRiset, l: 'Riset daerah terdaftar', s: 'Sejak 2021, lintas skema pendanaan' },
  { ico: 'users', v: STATS.peneliti, l: 'Peneliti terdaftar', s: `Ber-NIDN/NIP dari ${STATS.institusi} institusi mitra` },
  { ico: 'book', v: STATS.publikasi, l: 'Publikasi & luaran ilmiah', s: `${STATS.hki} HKI dan paten terdaftar` },
  { ico: 'pin', v: STATS.desaTerdampak, l: 'Desa/kelurahan terdampak', s: 'Dari total 148 desa & kelurahan' },
  { ico: 'award', v: STATS.adopsiKebijakan, l: 'Rekomendasi diadopsi', s: 'Menjadi Perbup, Renja, atau SOP OPD' },
  { ico: 'doc', v: STATS.policyBrief, l: 'Policy brief tersedia', s: 'Ringkasan kebijakan siap pakai OPD' },
  { ico: 'chart', v: STATS.risetAktif, l: 'Riset aktif dimonitor', s: 'Tahun anggaran berjalan 2025' },
  { ico: 'network', v: STATS.institusi, l: 'Institusi mitra', s: 'Perguruan tinggi, litbang, OPD, komunitas' }
];

const PILAR = [
  { ico: 'handshake', t: 'Kolaborasi', p: 'Menjodohkan kebutuhan nyata OPD dan komunitas dengan kapasitas peneliti perguruan tinggi.',
    li: ['Formulir usulan satu pintu', 'Pemilihan mitra sasaran terstruktur', 'Verifikasi 4 tahap yang transparan'] },
  { ico: 'lightbulb', t: 'Inovasi', p: 'Mendorong riset naik dari laporan menjadi purwarupa dan produk yang dipakai masyarakat.',
    li: ['Pendampingan hilirisasi UMKM', 'Fasilitasi HKI dan paten', 'Uji lapangan bersama mitra'] },
  { ico: 'layers', t: 'Data', p: 'Menyatukan seluruh jejak riset daerah dalam basis data tunggal yang dapat diaudit.',
    li: ['Integrasi Satu Data Buleleng', 'Repositori publikasi terbuka', 'Dashboard anggaran real-time'] },
  { ico: 'award', t: 'Dampak', p: 'Mengukur apakah riset benar-benar mengubah kebijakan dan kondisi lapangan.',
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

/* Kartu berita bergaya foto penuh — seluruh kartu bisa diklik untuk membuka detail. */
function NewsCard({ n, i, big, onOpen }) {
  const c = KAT_WARNA[n.kategori] || '#8E1B1B';
  return (
    <button
      type="button"
      onClick={() => onOpen(n)}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-line text-left shadow-card transition hover:-translate-y-1 hover:shadow-pop ${
        big ? 'aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[420px]' : 'aspect-[4/3]'
      }`}
    >
      <div className="absolute inset-0">
        <SmartImage src={n.gambar} alt={n.judul} seed={i} className="h-full w-full" imgClassName="transition duration-500 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <span
        className="absolute left-4 top-4 z-10 rounded-full px-2.5 py-1 text-[.7rem] font-bold uppercase tracking-wide text-white"
        style={{ background: c }}
      >
        {n.kategori}
      </span>
      <div className="absolute inset-x-0 bottom-0 z-10 p-4.5 sm:p-5.5">
        <h3 className={`mb-1.5 leading-snug text-white ${big ? 'text-[1.2rem] sm:text-[1.55rem]' : 'text-[1rem]'}`}>{n.judul}</h3>
        <div className="flex items-center gap-1.5 text-[.78rem] font-semibold text-white/78">
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
  const { berita: BERITA, pendanaan: PENDANAAN } = useContent();
  const [detailBerita, setDetailBerita] = useState(null);
  const mitraTrackRef = useRef(null);

  const beritaSorot = BERITA.slice(0, 5);
  const beritaBesar = beritaSorot[0];
  const beritaKecil = beritaSorot.slice(1, 5);

  return (
    <>
      {/* ===== 1.1 HERO — slider gambar otomatis 7 detik ===== */}
      <HeroSlider />

      {/* ===== 1.2 QUICK ACCESS ===== */}
      <section className="relative z-20 -mt-8">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK.map((q) => (
              <Link key={q.t} to={q.h} className="group flex items-start gap-3.5 rounded-xl border border-line bg-white p-4.5 no-underline shadow-lift transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-pop">
                <span className="grid h-10.5 w-10.5 flex-none place-items-center rounded-[10px] bg-maroon-50 text-maroon-800 transition group-hover:bg-maroon-800 group-hover:text-gold-500">
                  <Icon name={q.ico} size={21} />
                </span>
                <span>
                  <strong className="mb-0.5 block text-[.93rem] font-bold text-ink">{q.t}</strong>
                  <span className="block text-[.785rem] leading-snug text-ink-3">{q.s}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 1.3 EKOSISTEM RISET ===== */}
      <section className="py-14 sm:py-18" id="ekosistem">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mx-auto mb-8.5 max-w-[760px] text-center">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Ekosistem Riset Buleleng</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Riset daerah yang terhitung, terpantau, dan tercatat dampaknya</h2>
            <p className="text-[1.02rem] text-ink-2">Setiap angka ditarik dari basis data tunggal BRIDA sehingga capaian riset, serapan anggaran, dan jangkauan wilayah dapat diaudit publik kapan saja.</p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {EKO.map((e) => (
              <Reveal key={e.l} className="rounded-xl border border-line bg-white p-5.5 shadow-card transition hover:-translate-y-1 hover:shadow-pop">
                <span className="mb-3 grid h-9.5 w-9.5 place-items-center rounded-[10px] bg-gold-50 text-gold-600"><Icon name={e.ico} size={19} /></span>
                <CountUp value={e.v} className="font-head text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-tight text-maroon-800" />
                <div className="mt-1 text-[.84rem] font-bold text-ink">{e.l}</div>
                <div className="text-[.755rem] text-ink-3">{e.s}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 1.4 EMPAT PILAR ===== */}
      <section className="py-14 sm:py-18" id="pilar">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-8.5 max-w-[760px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Profil Sinergi Riset</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Empat pilar kerja SINGA RISET BULELENG</h2>
            <p className="text-[1.02rem] text-ink-2">Platform ini bukan sekadar arsip. Ia menjadi mesin tata kelola yang menautkan usulan riset dengan prioritas pembangunan daerah, lalu mengawalnya sampai terpakai di lapangan.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILAR.map((p, i) => (
              <Reveal key={p.t} delay={i * 60} className="relative overflow-hidden rounded-xl border border-line bg-white p-5.5 pt-6.5 shadow-card transition hover:-translate-y-1 hover:shadow-pop">
                <span className="pointer-events-none absolute right-4.5 top-[-6px] font-head text-[3.1rem] font-extrabold leading-none text-surface-2">0{i + 1}</span>
                <span className="relative z-10 mb-3.5 grid h-11.5 w-11.5 place-items-center rounded-xl text-gold-500" style={{ backgroundImage: 'linear-gradient(140deg,#8E1B1B,#C62828)' }}><Icon name={p.ico} size={23} /></span>
                <h3 className="relative z-10 text-[1.05rem]">{p.t}</h3>
                <p className="relative z-10 mb-3 text-[.875rem]">{p.p}</p>
                <ul className="relative z-10 m-0 list-none space-y-1.5 p-0 text-[.81rem]">
                  {p.li.map((l) => (
                    <li key={l} className="flex items-start gap-2 text-ink-2"><span className="mt-0.5 flex-none font-extrabold text-success">✓</span>{l}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 1.5a PETA SEBARAN RISET — section tersendiri ===== */}
      <section className="py-14 sm:py-18" id="peta-sebaran">
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

      {/* ===== 1.7 PETA JALAN RISET — panel merah ===== */}
      <section className="py-14 text-white sm:py-18" style={{ backgroundImage: 'linear-gradient(160deg,#5C1010 0%,#6B1414 45%,#3E0B0B 100%)' }} id="petajalan">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[640px]">
              <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-gold-500 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Peta Jalan Riset 2025–2029</span>
              <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)] text-white">Lima tahap menuju ekosistem riset mandiri Bali Utara</h2>
              <p className="mb-0 text-[1.02rem] text-white/78">Peta jalan ini menjadi rujukan penilaian kesesuaian setiap usulan riset, indikator pertama dalam matriks evaluasi tim pakar BRIDA.</p>
            </div>
            <Link to="/roadmap" className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-[#4A2D00] no-underline transition hover:bg-gold-600">
              Detail peta jalan per sektor →
            </Link>
          </Reveal>

          <Reveal className="grid gap-3.5 lg:grid-cols-5">
            {ROADMAP.map((r) => (
              <div
                key={r.tahun}
                className={`flex flex-col overflow-hidden rounded-xl border bg-white/7 backdrop-blur-sm transition hover:bg-white/10 ${
                  r.status === 'current' ? 'border-gold-500 shadow-[0_0_0_3px_rgba(249,199,79,.22)]' : 'border-white/15'
                }`}
              >
                <div className={`px-4 py-3.5 ${r.status === 'current' ? 'bg-gold-500 text-[#4A2D00]' : 'bg-white/10 text-white'}`}>
                  <div className={`text-[.7rem] font-bold uppercase tracking-widest ${r.status === 'current' ? 'text-[#4A2D00]/75' : 'text-white/70'}`}>
                    {r.tahun}{r.status === 'current' ? ' · berjalan' : ''}
                  </div>
                  <div className="mt-0.5 font-head text-[1.02rem] font-extrabold">{r.tema}</div>
                </div>
                <div className="flex-1 p-4">
                  <p className="mb-2.5 text-[.82rem] text-white/80">{r.target}</p>
                  <ul className="m-0 list-none space-y-1.75 p-0 text-[.81rem]">
                    {r.butir.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-white/75">
                        <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-gold-500" />{b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-white/12 px-4 py-2.75 text-[.76rem] text-white/60">{r.indikator}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== 1.8 PELUANG PENDANAAN ===== */}
      <section className="py-14 sm:py-18" id="pendanaan">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-8.5 max-w-[760px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Peluang Pendanaan Riset</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Skema hibah dan insentif yang sedang dibuka</h2>
            <p className="text-[1.02rem] text-ink-2">Pantau tenggat dan persyaratan tiap skema. Rincian pagu serta tata cara pengajuan mengikuti pengumuman resmi di situs penyelenggara masing-masing.</p>
          </Reveal>
          <Reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PENDANAAN.map((f) => {
              const sisa = hariMenuju(f.deadline);
              const fs = FUND_STATUS[f.status] || FUND_STATUS.open;
              const dlCls = sisa < 0 ? 'bg-surface-1 text-ink-2' : sisa <= 30 ? 'bg-danger-bg text-danger font-semibold' : sisa <= 75 ? 'bg-warning-bg text-warning font-semibold' : 'bg-surface-1 text-ink-2';
              return (
                <article key={f.id} className={`relative flex flex-col overflow-hidden rounded-xl border border-line bg-white p-5.5 shadow-card transition hover:-translate-y-1 hover:shadow-pop before:absolute before:inset-x-0 before:top-0 before:h-1 ${fs.border}`}>
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
                  <div className="mt-auto flex gap-2">
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
                  </div>
                </article>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ===== 1.9 BERITA & DISEMINASI ===== */}
      <section className="py-14 sm:py-18" id="berita">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[640px]">
              <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Berita &amp; Diseminasi Riset</span>
              <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Kabar terkini ekosistem riset Buleleng</h2>
              <p className="mb-0 text-[1.02rem] text-ink-2">Pengumuman pendanaan, hasil monev, adopsi kebijakan, dan agenda diseminasi dari BRIDA Kabupaten Buleleng.</p>
            </div>
            <Link to="/berita" className="rounded-lg border border-line-strong bg-white px-5 py-2.5 text-sm font-semibold text-maroon-800 no-underline transition hover:border-maroon-800 hover:bg-maroon-50">
              Lihat semua berita →
            </Link>
          </Reveal>
          {beritaBesar && (
            <Reveal className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <NewsCard n={beritaBesar} i={0} big onOpen={setDetailBerita} />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {beritaKecil.map((n, i) => (
                  <NewsCard key={n.id} n={n} i={i + 1} onOpen={setDetailBerita} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ===== 1.12 MITRA STRATEGIS ===== */}
      <section className="py-14 sm:py-18" id="mitra">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mx-auto mb-8.5 max-w-[760px] text-center">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Mitra Strategis Pentahelix</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Perguruan tinggi, pemerintah, komunitas, dan dunia usaha</h2>
            <p className="text-[1.02rem] text-ink-2">Lebih dari 30 lembaga litbang dan perguruan tinggi bekerja sama dengan dinas teknis, kelompok subak, pengelola wisata, dan pelaku UMKM di Kabupaten Buleleng.</p>
          </Reveal>
          <Reveal>
            <MitraCarousel items={MITRA_LOGO} />
          </Reveal>

          <Reveal className="mt-8 rounded-xl border-none p-6.5 text-white" style={{ backgroundImage: 'linear-gradient(135deg,#8E1B1B,#6B1414)' }}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-[620px]">
                <h3 className="mb-2 text-white">Punya kebutuhan riset di instansi atau komunitas Anda?</h3>
                <p className="m-0 text-white/80">Sampaikan persoalan lapangan yang dihadapi dinas, subak, pokdarwis, atau UMKM Anda. BRIDA akan menjodohkannya dengan peneliti yang relevan pada batch pendanaan berikutnya.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link to="/kolaborasi" className="rounded-lg bg-gold-500 px-6.5 py-3.5 text-[.96rem] font-semibold text-[#4A2D00] no-underline transition hover:bg-gold-600">Ajukan kolaborasi riset</Link>
                <Link to="/etika-regulasi" className="rounded-lg border border-white/28 bg-white/10 px-6.5 py-3.5 text-[.96rem] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20">Pelajari tata kelola</Link>
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
