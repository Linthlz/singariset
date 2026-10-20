import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import HeroSlider from '../components/HeroSlider.jsx';

const FITUR = [
  { ico: 'target', t: 'Peta Jalan Riset', s: 'Lihat tahapan dan prioritas riset daerah 2025–2029.', h: '/roadmap' },
  { ico: 'money', t: 'Peluang Pendanaan', s: 'Temukan skema hibah, syarat, dan tenggat pengajuan.', h: '/pendanaan' },
  { ico: 'chart', t: 'Monev Riset', s: 'Pantau kemajuan dan evaluasi capaian penelitian.', h: '/monev' },
  { ico: 'handshake', t: 'Ajukan Kolaborasi', s: 'Sampaikan kebutuhan riset dan jangkau mitra yang relevan.', h: '/kolaborasi' },
  { ico: 'layers', t: 'Lontar Riset Buleleng', s: 'Jelajahi pengetahuan dan warisan riset lokal.', soon: true }
];

export default function Home() {
  return (
    <>
      {/* ===== 1.1 HERO — slider gambar otomatis 7 detik ===== */}
      <HeroSlider />

      {/* ===== 1.12 FITUR SINGA RISET ===== */}
      <section className="bg-white py-14 sm:py-18" id="fitur">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-8 max-w-[760px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Fitur SINGA RISET</span>
            <h2 className="text-[clamp(1.45rem,2.7vw,2.05rem)]">Dari gagasan riset hingga dampak nyata</h2>
            <p className="text-[1.02rem] text-ink-2">SINGA RISET BULELENG menghubungkan peneliti, pemerintah, dan masyarakat. Jelajahi publikasi dan prioritas daerah, temukan pendanaan, ajukan kolaborasi, serta pantau evaluasi riset.</p>
          </Reveal>

          <div className="grid items-start gap-3.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
            <Reveal className="self-start">
              <Link to="/login" className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-xl border border-maroon-800 bg-maroon-900 p-6 text-white no-underline shadow-pop transition hover:-translate-y-1 hover:bg-maroon-800 sm:p-7">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-gold-500"><Icon name="chart" size={22} /></span>
                  <span className="rounded-full bg-gold-500 px-3 py-1 text-[.7rem] font-bold uppercase tracking-wide text-maroon-950">Ruang kerja terintegrasi</span>
                </div>
                <h3 className="mb-2 max-w-[18ch] text-[1.45rem] leading-tight text-white">Dashboard Penelitian</h3>
                <p className="mb-6 max-w-[42ch] text-[.9rem] text-white/78">Kelola usulan, pantau kemajuan kegiatan, dan tinjau luaran penelitian sesuai peran Anda.</p>
                <div className="mb-6 grid grid-cols-3 gap-2 border-y border-white/20 py-4 text-[.72rem] font-semibold text-white/85 sm:text-[.78rem]">
                  <span className="flex items-center gap-1.5"><Icon name="doc" size={15} className="text-gold-500" />Usulan</span>
                  <span className="flex items-center gap-1.5"><Icon name="chart" size={15} className="text-gold-500" />Monitoring</span>
                  <span className="flex items-center gap-1.5"><Icon name="award" size={15} className="text-gold-500" />Luaran</span>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-gold-500">Masuk ke dashboard <Icon name="arrow" size={16} /></span>
              </Link>
            </Reveal>

            <div className="grid gap-3.5 sm:grid-cols-2">
              {FITUR.map((f, i) => (
                <Reveal key={f.t} delay={i * 80}>
                  {f.soon ? (
                    <article aria-label={`${f.t}, segera hadir`} className="flex h-full min-h-[158px] flex-col rounded-xl border border-maroon-800 bg-maroon-900 p-5 text-white/75">
                      <span className="mb-4 flex items-center justify-between">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-gold-500"><Icon name={f.ico} size={20} /></span>
                        <span className="rounded-full border border-gold-500/40 px-2.5 py-1 text-[.66rem] font-bold uppercase tracking-wide text-gold-500">Coming soon</span>
                      </span>
                      <strong className="mb-1 text-[.96rem] text-white">{f.t}</strong>
                      <span className="text-[.78rem] leading-relaxed text-white/60">{f.s}</span>
                    </article>
                  ) : (
                    <Link to={f.h} className="group flex h-full min-h-[158px] flex-col rounded-xl border border-maroon-800 bg-maroon-900 p-5 text-white no-underline transition hover:-translate-y-1 hover:border-gold-500 hover:bg-maroon-800">
                      <span className="mb-4 flex items-center justify-between">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-gold-500"><Icon name={f.ico} size={20} /></span>
                        <Icon name="arrow" size={16} className="text-white/45 transition group-hover:translate-x-1 group-hover:text-gold-500" />
                      </span>
                      <strong className="mb-1 text-[.96rem]">{f.t}</strong>
                      <span className="text-[.78rem] leading-relaxed text-white/68">{f.s}</span>
                    </Link>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
