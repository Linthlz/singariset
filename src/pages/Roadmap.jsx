import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import { ROADMAP, SEKTOR_ROADMAP } from '../data/singaData.js';

export default function Roadmap() {
  return (
    <>
      <PageHero
        crumb="Peta Jalan Riset"
        title="Peta Jalan Riset 2025–2029"
        lead="Lima tahap menuju ekosistem riset mandiri Bali Utara, dari fondasi tata kelola hingga Buleleng sebagai pusat unggulan riset Smart Island."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">5 tahun perencanaan</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">5 sektor prioritas</span>
        ]}
      />

      <section className="py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-8 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Garis Waktu</span>
            <h2 className="text-[1.6rem]">Tahapan tahunan 2025–2029</h2>
            <p className="mb-0 text-ink-2">Setiap usulan riset dinilai kesesuaiannya terhadap tahap berjalan pada garis waktu ini, indikator pertama dalam matriks evaluasi tim pakar BRIDA.</p>
          </Reveal>

          <div className="relative pl-7.5 before:absolute before:bottom-2 before:left-2.25 before:top-2 before:w-0.5 before:rounded-full" style={{ }}>
            <div className="absolute bottom-2 left-2.25 top-2 w-0.5 rounded-full" style={{ backgroundImage: 'linear-gradient(180deg,#8E1B1B,#F9C74F)' }} />
            {ROADMAP.map((r, i) => (
              <Reveal key={r.tahun} delay={i * 70} className="relative mb-7 last:mb-0">
                <span className={`absolute -left-7.5 top-1.5 grid h-5 w-5 place-items-center rounded-full border-3 bg-white ${
                  r.status === 'current' ? 'border-maroon-800' : r.status === 'next' ? 'border-line-strong' : 'border-line-strong'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${r.status === 'current' ? 'bg-maroon-800' : 'bg-line-strong'}`} />
                </span>
                <div className="rounded-xl border border-line bg-white p-5.5 shadow-card">
                  <div className="mb-2.5 flex flex-wrap items-center gap-3">
                    <span className={`font-head text-[1.15rem] font-extrabold ${r.status === 'current' ? 'text-maroon-800' : 'text-ink-3'}`}>{r.tahun}</span>
                    <h3 className="m-0 text-[1.05rem]">{r.tema}</h3>
                    {r.status === 'current' && <span className="rounded-full bg-gold-50 px-2.5 py-1 text-[.7rem] font-bold text-[#8A6400]">Tahun berjalan</span>}
                  </div>
                  <p className="mb-3 text-[.87rem] text-ink-2">{r.target}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {r.butir.map((b) => (
                      <div key={b} className="flex items-start gap-2 text-[.83rem] text-ink-2"><Icon name="check" size={14} className="mt-0.5 flex-none text-success" />{b}</div>
                    ))}
                  </div>
                  <div className="mt-3.5 border-t border-line pt-3 text-[.78rem] font-semibold text-ink-3">Indikator capaian: {r.indikator}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-1 py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-8 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">Sektor Prioritas</span>
            <h2 className="text-[1.6rem]">Lima sektor riset unggulan Buleleng</h2>
            <p className="mb-0 text-ink-2">Peta jalan lintas tahun diterjemahkan ke dalam sasaran per sektor, menjadi rujukan utama tim pakar saat menilai kesesuaian usulan riset dengan prioritas daerah.</p>
          </Reveal>

          <div className="flex flex-col gap-5">
            {SEKTOR_ROADMAP.map((s, i) => (
              <Reveal key={s.id} id={`sektor-${s.id}`} delay={i * 60} className="scroll-mt-24 rounded-xl border border-line bg-white p-6 shadow-card">
                <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto]">
                  <span className="grid h-13 w-13 flex-none place-items-center rounded-xl text-gold-500" style={{ backgroundImage: 'linear-gradient(140deg,#8E1B1B,#C62828)' }}>
                    <Icon name={s.ikon} size={26} />
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-[1.08rem]">{s.nama}</h3>
                    <p className="mb-3 text-[.87rem] text-ink-2">{s.deskripsi}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.target.map((t) => <span key={t} className="rounded-full bg-surface-2 px-3 py-1.25 text-[.78rem] font-semibold text-ink-2">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2 lg:flex-col lg:items-end lg:justify-center">
                    <div className="font-head text-[1.8rem] font-extrabold leading-none text-maroon-800">{s.riset}</div>
                    <div className="text-[.76rem] font-semibold text-ink-3">riset terkatalog</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
