import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { bidangById, kecById, statusMeta, rupiahRingkas } from '../lib/format.js';

export default function RisetCard({ r }) {
  const b = bidangById(r.bidang);
  const sm = statusMeta(r.status);

  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5.5 shadow-card transition hover:-translate-y-1 hover:border-line-strong hover:shadow-pop">
      <div className="mb-2.5 flex items-start justify-between gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.715rem] font-bold" style={{ background: b.warna + '18', color: b.warna }}>
          {b.nama.split(' ')[0]}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.715rem] font-bold before:h-1.5 before:w-1.5 before:flex-none before:rounded-full before:bg-current ${sm.badge}`}>
          {sm.label}
        </span>
      </div>

      <h3 className="mb-2 text-[1.03rem] font-bold leading-snug">
        <Link to={`/riset/${r.id}`} className="text-ink no-underline hover:text-maroon-800">{r.judul}</Link>
      </h3>

      <p className="mb-3.5 flex-1 text-[.845rem] leading-relaxed text-ink-2 line-clamp-3">{r.abstrak}</p>

      <div className="mb-3.5 flex flex-col gap-1.5 text-[.79rem] text-ink-3">
        <div className="flex items-start gap-2"><Icon name="user" size={14} className="mt-0.5 flex-none" /><span>{r.peneliti} · {r.institusi}</span></div>
        <div className="flex items-start gap-2"><Icon name="pin" size={14} className="mt-0.5 flex-none" /><span>Kec. {kecById(r.kecamatan).nama} · TA {r.tahun}</span></div>
      </div>

      <div className="mb-1 flex justify-between text-[.76rem] font-semibold text-ink-3">
        <span>Capaian tahap {r.tahap}/7</span><b className="text-ink">{r.progress}%</b>
      </div>
      <div className="h-1.75 overflow-hidden rounded-full bg-line">
        <div className={`h-full rounded-full bg-gradient-to-r ${sm.bar}`} style={{ width: `${r.progress}%` }} />
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2.5 border-t border-line pt-3.5">
        <span className="text-[.82rem] font-bold tabular-nums text-maroon-800">{rupiahRingkas(r.anggaran)}</span>
        <Link to={`/riset/${r.id}`} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[.8rem] font-semibold text-ink-2 no-underline hover:bg-surface-1 hover:text-ink">
          Detail <Icon name="arrow" size={14} />
        </Link>
      </div>
    </article>
  );
}
