import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KECAMATAN, RISET } from '../data/singaData.js';

const SHAPES = {
  gerokgak:     '20,120 42,74 92,58 152,68 174,96 180,182 132,216 62,206 22,168',
  seririt:      '174,96 240,78 268,104 274,168 216,186 180,182',
  busungbiu:    '180,182 216,186 274,168 296,214 252,264 192,250 170,212',
  banjar:       '268,104 330,86 366,110 372,176 300,200 274,168',
  sukasada:     '372,176 300,200 296,214 252,264 320,302 398,292 442,242 450,184',
  buleleng:     '366,110 432,96 470,120 458,180 450,184 372,176',
  sawan:        '470,120 540,104 574,130 558,198 470,190 458,180',
  kubutambahan: '574,130 652,112 688,140 674,202 558,198',
  tejakula:     '688,140 772,122 852,140 882,178 862,212 674,202'
};
const LABELS = {
  gerokgak: [96, 142], seririt: [224, 136], busungbiu: [232, 216], banjar: [318, 148],
  sukasada: [356, 250], buleleng: [414, 148], sawan: [514, 156], kubutambahan: [618, 162], tejakula: [776, 176]
};

function kecColor(n) {
  if (n >= 31) return '#8E1B1B';
  if (n >= 21) return '#C62828';
  if (n >= 11) return '#E88A8A';
  return '#FCE7E7';
}
function kecTextColor(n) { return n >= 11 ? '#fff' : '#8E1B1B'; }

export default function KecamatanMap() {
  const [active, setActive] = useState(null);
  const kAktif = KECAMATAN.find((k) => k.id === active);
  const terkait = kAktif ? RISET.filter((r) => r.kecamatan === kAktif.id) : [];

  return (
    <div className="grid gap-5.5 lg:grid-cols-[1.35fr_1fr]">
      <div>
        <svg viewBox="0 0 900 330" role="img" aria-label="Peta sebaran riset di 9 kecamatan Kabupaten Buleleng" className="w-full rounded-xl border border-line bg-surface-2">
          <text x="450" y="26" textAnchor="middle" style={{ font: '600 11px var(--font-sans)', fill: '#6B7280', letterSpacing: '.14em' }}>
            LAUT BALI · PESISIR UTARA
          </text>
          {KECAMATAN.map((k) => (
            <polygon
              key={k.id}
              points={SHAPES[k.id]}
              fill={kecColor(k.riset)}
              stroke={active === k.id ? '#4A0D0D' : '#fff'}
              strokeWidth={active === k.id ? 2.6 : 1.5}
              tabIndex={0}
              role="button"
              aria-label={`Kecamatan ${k.nama}, ${k.riset} riset`}
              className="cursor-pointer transition-all"
              onClick={() => setActive(k.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(k.id); } }}
            >
              <title>{k.nama}: {k.riset} riset · {k.fokus}</title>
            </polygon>
          ))}
          {KECAMATAN.map((k) => {
            const p = LABELS[k.id];
            return (
              <g key={k.id} style={{ pointerEvents: 'none' }}>
                <text x={p[0]} y={p[1]} textAnchor="middle" style={{ font: '700 10.5px var(--font-sans)', fill: kecTextColor(k.riset) }}>{k.nama}</text>
                <text x={p[0]} y={p[1] + 13} textAnchor="middle" style={{ font: '9.5px var(--font-sans)', fill: kecTextColor(k.riset), opacity: 0.85 }}>{k.riset} riset</text>
              </g>
            );
          })}
        </svg>
        <div className="mt-3 flex flex-wrap gap-3.5 text-[.76rem] text-ink-3">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#FCE7E7' }} />1–10 riset</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#E88A8A' }} />11–20 riset</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#C62828' }} />21–30 riset</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#8E1B1B' }} />31+ riset</span>
        </div>
      </div>

      <div>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {KECAMATAN.map((k) => (
            <li key={k.id}>
              <button
                type="button"
                onClick={() => setActive(k.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition ${
                  active === k.id ? 'border-maroon-800 bg-maroon-50 shadow-card' : 'border-line bg-white hover:border-maroon-600 hover:bg-maroon-50'
                }`}
              >
                <span className="h-2.5 w-2.5 flex-none rounded-sm" style={{ background: kecColor(k.riset) }} />
                <span className="flex-1 text-[.855rem] font-semibold text-ink">
                  {k.nama}<br /><span className="text-[.75rem] font-medium text-ink-3">{k.fokus}</span>
                </span>
                <span className="text-[.78rem] font-bold tabular-nums text-maroon-800">{k.riset}</span>
              </button>
            </li>
          ))}
        </ul>

        {kAktif && (
          <div className="mt-3 rounded-xl bg-surface-1 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <b className="text-[.95rem]">Kecamatan {kAktif.nama}</b>
              <span className="rounded-full bg-maroon-50 px-2.5 py-1 text-[.715rem] font-bold text-maroon-800">{kAktif.riset} riset</span>
            </div>
            <dl className="mb-2.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[.845rem]">
              <dt className="font-semibold text-ink-3">Desa/kelurahan</dt><dd className="m-0 font-semibold text-ink">{kAktif.desa}</dd>
              <dt className="font-semibold text-ink-3">Fokus riset</dt><dd className="m-0 font-semibold text-ink">{kAktif.fokus}</dd>
            </dl>
            {terkait.length ? (
              <>
                <div className="mb-1.5 text-[.79rem] text-ink-3">Riset dalam katalog:</div>
                {terkait.slice(0, 3).map((r) => (
                  <Link key={r.id} to={`/riset/${r.id}`} className="mb-1.5 block text-[.82rem] font-semibold text-ink no-underline hover:text-maroon-800">• {r.judul}</Link>
                ))}
              </>
            ) : (
              <p className="m-0 text-[.82rem] text-ink-2">Belum ada riset katalog aktif. Kecamatan ini menjadi prioritas penjaringan usulan batch berikutnya.</p>
            )}
            <Link to={`/riset?kecamatan=${kAktif.id}`} className="mt-2.5 block rounded-lg border border-line-strong px-3 py-2 text-center text-[.83rem] font-semibold text-maroon-800 no-underline hover:border-maroon-800 hover:bg-maroon-50">
              Lihat semua riset {kAktif.nama}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
