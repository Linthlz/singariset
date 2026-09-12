import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';
import SmartImage from './SmartImage.jsx';
import Icon from './Icon.jsx';
import { HERO_SLIDES, HERO_INTERVAL } from '../data/heroSlides.js';

const POPULER = ['IoT Subak', 'Konservasi Lovina', 'Kopi Robusta Wanagiri', 'Satu Data Buleleng'];

export default function HeroSlider() {
  const [aktif, setAktif] = useState(0);
  const total = HERO_SLIDES.length;
  const timerRef = useRef(null);

  const ke = useCallback((i) => setAktif(((i % total) + total) % total), [total]);

  // Slide berganti otomatis setiap HERO_INTERVAL, tanpa jeda saat kursor
  // berada di atas hero (pergantian tetap berjalan meski pengguna membaca
  // atau mengarahkan kursor ke tombol pencarian).
  useEffect(() => {
    if (total <= 1) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    timerRef.current = setInterval(() => setAktif((a) => (a + 1) % total), HERO_INTERVAL);

    // Jangan buang waktu putaran saat tab tidak aktif; lanjutkan saat kembali.
    function onVisibility() {
      clearInterval(timerRef.current);
      if (!document.hidden) {
        timerRef.current = setInterval(() => setAktif((a) => (a + 1) % total), HERO_INTERVAL);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [total]);

  const slide = HERO_SLIDES[aktif];

  return (
    <section
      className="relative overflow-hidden bg-maroon-950 text-white"
      aria-roledescription="carousel"
      aria-label="Sorotan utama portal"
    >
      {/* Lapisan gambar — perpindahan lambat dan halus (crossfade panjang
          disertai zoom perlahan/Ken Burns) agar terasa sinematik. */}
      {HERO_SLIDES.map((s, i) => {
        const iniAktif = i === aktif;
        return (
          <div
            key={s.gambar}
            className={`absolute inset-0 transition-opacity duration-1800 ease-in-out ${iniAktif ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={!iniAktif}
          >
            <SmartImage
              src={s.gambar}
              alt={s.alt}
              seed={i}
              className="h-full w-full"
              imgClassName={`transition-transform ease-linear ${iniAktif ? 'scale-110 duration-9000' : 'scale-100 duration-0'}`}
            />
          </div>
        );
      })}

      {/* Overlay agar teks tetap terbaca di atas foto apa pun */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(58,9,9,.72) 0%, rgba(74,13,13,.56) 42%, rgba(74,13,13,.32) 68%, rgba(74,13,13,.14) 100%)'
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(620px 360px at 88% 10%, rgba(249,199,79,.20), transparent 62%)' }}
      />

      {/* Isi */}
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 py-14 sm:py-20">
        <div className="grid items-center gap-9 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-3.5 text-[.77rem] font-semibold text-white/94 backdrop-blur">
              <b className="rounded-full bg-gold-500 px-2.5 py-1 text-[.68rem] font-extrabold tracking-wide text-[#4A2D00]">BRIDA</b>
              Kabupaten Buleleng · Provinsi Bali
            </span>

            <div key={aktif} className="animate-[heroIn_1.3s_cubic-bezier(.16,1,.3,1)]">
              <h1 className="mb-4 text-[clamp(1.9rem,4.4vw,3.05rem)] font-extrabold leading-[1.1] text-white">
                {slide.judul}{' '}
                <span style={{ backgroundImage: 'linear-gradient(180deg,#FFDE8A,#F9C74F)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {slide.sorot}
                </span>
                {slide.ekor ? ` ${slide.ekor}` : ''}
              </h1>
              <p className="mb-6.5 max-w-[590px] text-[1.045rem] text-white/85">{slide.teks}</p>
            </div>

            <div className="mb-5 max-w-[590px]">
              <SearchBox variant="hero" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[.78rem] text-white/60">
              <span>Populer:</span>
              {POPULER.map((t) => (
                <Link
                  key={t}
                  to={`/riset?q=${encodeURIComponent(t)}`}
                  className="rounded-full border border-white/16 bg-white/9 px-3 py-1.25 text-[.765rem] text-white/90 no-underline transition hover:border-gold-500 hover:bg-gold-500/20 hover:text-white"
                >
                  {t}
                </Link>
              ))}
            </div>

            {/* Kendali slide */}
            {total > 1 && (
              <div className="mt-7 flex items-center gap-3">
                <button
                  type="button" onClick={() => ke(aktif - 1)} aria-label="Slide sebelumnya"
                  className="grid h-9 w-9 flex-none place-items-center rounded-full border border-white/25 text-white/80 transition hover:border-gold-500 hover:bg-white/10 hover:text-white"
                >
                  <Icon name="arrow" size={16} className="rotate-180" />
                </button>
                <button
                  type="button" onClick={() => ke(aktif + 1)} aria-label="Slide berikutnya"
                  className="grid h-9 w-9 flex-none place-items-center rounded-full border border-white/25 text-white/80 transition hover:border-gold-500 hover:bg-white/10 hover:text-white"
                >
                  <Icon name="arrow" size={16} />
                </button>

                <div className="flex items-center gap-2" role="tablist" aria-label="Pilih slide">
                  {HERO_SLIDES.map((s, i) => (
                    <button
                      key={s.gambar}
                      type="button"
                      role="tab"
                      aria-selected={i === aktif}
                      aria-label={`Slide ${i + 1} dari ${total}`}
                      onClick={() => ke(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === aktif ? 'w-8 bg-gold-500' : 'w-4 bg-white/35 hover:bg-white/60'}`}
                    />
                  ))}
                </div>

                <span className="ml-1 text-[.75rem] tabular-nums text-white/55">
                  {String(aktif + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-white/16 bg-black/25 p-5.5 backdrop-blur-md" aria-label="Ringkasan ekosistem riset">
            <div className="mb-3.5 text-[.72rem] font-bold uppercase tracking-widest text-gold-500">Ekosistem Riset Hari Ini</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['169', 'Riset daerah terdaftar'],
                ['34', 'Riset aktif dimonitor'],
                ['412', 'Peneliti terdaftar'],
                ['27', 'Policy brief tersedia']
              ].map(([v, l]) => (
                <div key={l} className="rounded-lg border border-white/10 bg-black/30 px-3.5 py-3">
                  <div className="font-head text-[1.62rem] font-extrabold leading-tight text-white">{v}</div>
                  <div className="mt-0.5 text-[.72rem] leading-tight text-white/68">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-3.5 flex items-start gap-2.5 border-t border-white/14 pt-3.5 text-[.78rem] text-white/72">
              <span className="mt-1.5 h-2 w-2 flex-none animate-pulse-dot rounded-full bg-emerald-400" />
              <span><b className="text-white">Batch I Hibah Riset Prioritas 2026</b> dibuka, pengajuan ditutup 28 November 2025.</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
