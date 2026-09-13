import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.jsx';
import { KECAMATAN, RISET, BIDANG } from '../data/singaData.js';
import { bidangById } from '../lib/format.js';

/* Bentuk batas administratif 9 kecamatan Buleleng (disederhanakan untuk web),
   viewBox 0 0 1048 364.4 — sumbu peta menghadap Laut Bali di bagian atas. */
const KEC_PATHS = {
  Gerokgak: 'M286.7 161.2L282.4 166.6L277.6 167.9L278.3 178.2L268.8 191.4L255.8 181.9L241.3 187.3L236.6 181.5L219.1 174.2L207.6 156.1L199.8 149.3L198.2 143.5L192.1 138.4L185.1 137.1L174.5 139.1L173.3 144.3L167.2 149.8L150.6 152.4L141.9 158.1L136.7 150.7L130.0 154.4L127.5 151.8L121.5 153.2L110.0 164.2L94.4 169.8L93.2 163.2L81.5 152.1L72.1 157.5L51.0 155.3L47.7 151.7L47.0 138.0L50.0 132.7L57.4 127.4L58.9 129.9L58.6 127.1L61.4 126.7L56.5 126.5L54.1 123.0L50.6 124.0L49.7 120.5L43.5 122.1L35.8 117.6L37.5 106.4L35.6 96.9L24.0 80.4L27.2 59.1L31.0 56.1L42.2 54.3L71.2 58.0L77.8 55.3L84.3 57.8L100.8 77.2L112.2 94.9L112.7 100.1L106.2 106.0L109.1 106.4L107.0 110.8L111.9 115.4L117.9 114.3L128.9 101.9L134.3 100.4L143.8 92.3L147.4 94.3L146.5 98.8L151.1 104.4L155.0 101.2L156.9 102.2L158.9 99.9L150.0 97.4L150.4 93.1L168.1 82.2L178.6 81.6L182.6 85.0L181.4 90.3L174.5 90.7L177.1 94.1L180.7 92.5L182.8 100.7L186.8 97.1L188.3 99.8L191.5 99.4L192.1 95.3L199.9 93.3L199.5 88.9L205.3 84.2L207.5 88.1L220.4 92.0L225.5 99.0L230.7 96.5L231.7 92.0L243.7 105.1L248.5 103.5L252.1 106.8L260.0 108.4L266.8 105.2L279.1 105.3L295.3 116.3L300.4 111.1L300.8 116.7L319.4 121.0L332.4 129.4L363.3 134.8L387.2 142.7L391.9 146.5L398.8 145.5L405.5 152.4L410.0 152.0L414.1 147.6L414.3 151.7L417.7 154.1L423.8 150.9L441.9 156.7L451.8 155.8L453.4 160.9L451.8 165.3L456.3 165.9L457.0 176.2L466.5 196.3L461.1 206.5L453.3 213.1L450.5 219.9L453.0 229.7L448.9 235.1L453.2 246.6L437.4 257.7L431.0 258.8L418.5 266.3L406.0 276.2L402.9 276.2L400.7 272.8L402.7 258.8L398.5 251.7L399.3 242.1L396.0 237.6L393.9 224.1L398.6 221.0L395.0 211.2L384.2 211.2L378.3 216.0L369.6 211.9L365.2 216.3L355.4 217.3L345.8 209.0L335.7 183.3L315.7 182.2L286.7 161.2ZM196.6 83.1L197.2 84.5L196.4 82.6L196.6 83.1ZM104.8 53.7L116.2 54.2L117.8 56.9L107.4 62.0L91.3 57.3L104.8 53.7Z',
  Seririt: 'M526.5 216.4L519.0 225.0L523.4 231.5L525.7 244.5L522.7 247.6L517.6 248.6L511.8 239.8L506.5 238.7L502.9 238.5L499.4 243.4L494.2 245.4L488.5 242.2L472.3 241.5L469.6 244.4L472.1 252.4L458.2 260.9L441.7 277.0L434.2 285.6L433.5 292.0L429.5 295.8L425.8 293.2L420.3 296.2L405.7 290.7L404.3 283.3L407.5 274.6L430.3 259.2L437.4 257.7L443.3 252.2L449.4 250.4L453.5 245.8L449.0 236.0L453.0 229.7L450.5 219.9L453.3 213.1L461.1 206.5L466.5 196.3L457.0 176.2L456.3 165.9L451.8 165.3L453.4 160.9L451.8 155.8L457.3 155.5L472.9 148.5L482.5 148.4L486.7 142.9L495.0 144.4L508.8 141.0L515.4 143.8L540.5 142.5L538.6 145.5L543.8 155.7L538.1 163.7L538.3 170.5L532.0 178.6L536.3 179.3L543.3 189.0L553.8 197.5L559.8 195.1L572.6 202.6L576.6 205.9L577.6 212.1L582.1 213.0L583.9 216.7L589.9 220.0L584.2 221.7L583.1 224.2L573.3 222.5L565.1 216.7L559.5 217.3L554.2 214.7L547.9 207.7L538.4 206.6L532.2 201.4L530.6 206.6L527.3 205.4L524.7 207.4L527.1 210.4L526.5 216.4Z',
  Busungbiu: 'M515.1 316.2L511.2 321.7L508.4 334.6L512.6 338.3L506.3 340.4L482.0 329.1L476.8 315.3L469.3 311.5L452.5 296.2L445.9 293.8L439.7 300.2L432.6 295.2L429.5 295.8L433.5 292.0L434.2 285.6L441.7 277.0L458.2 260.9L472.1 252.4L469.6 244.4L472.3 241.5L488.5 242.2L494.2 245.4L505.5 238.6L511.8 239.8L517.6 248.6L525.1 246.2L523.4 231.6L519.1 221.9L525.7 218.5L527.2 211.6L524.7 207.4L527.3 205.4L530.6 206.6L531.3 201.5L535.5 202.3L538.4 206.7L547.9 207.7L554.2 214.7L559.5 217.3L565.1 216.7L573.3 222.5L580.1 222.8L588.1 226.5L594.2 225.6L604.5 231.8L611.4 230.7L610.8 233.7L617.7 234.2L620.9 239.5L640.9 253.3L641.1 260.7L648.8 263.3L648.8 273.2L645.2 273.9L610.0 260.3L609.1 266.0L604.0 269.5L594.5 265.8L590.5 271.1L576.9 259.0L572.1 258.3L565.1 248.2L559.7 248.2L561.8 255.4L554.3 260.6L550.5 259.8L540.6 273.0L537.3 282.0L539.4 289.8L534.4 296.3L534.6 303.9L531.1 308.8L529.2 318.4L526.4 319.6L515.1 316.2Z',
  Banjar: 'M589.8 218.5L577.6 212.1L576.5 205.8L561.0 195.6L553.8 197.5L543.3 189.0L536.3 179.3L531.7 177.8L538.3 170.5L538.1 163.7L543.8 155.7L538.6 145.5L540.6 142.4L561.1 141.6L576.7 137.0L582.9 133.8L587.2 126.4L594.2 126.2L601.2 122.6L608.9 131.1L609.7 134.4L606.4 139.0L612.5 143.9L615.7 156.0L613.7 156.8L616.0 160.8L627.5 167.4L631.6 175.1L638.4 175.2L642.8 186.5L648.5 191.0L648.7 195.1L659.4 180.8L662.7 183.7L673.3 185.1L676.7 198.3L676.1 205.9L682.0 212.8L684.0 227.8L681.8 237.3L687.3 239.7L684.4 245.3L684.2 257.2L679.6 258.2L677.8 267.1L671.2 266.1L660.6 271.9L648.8 273.2L648.8 263.3L640.9 260.5L640.9 253.3L620.9 239.5L617.7 234.2L610.8 233.7L611.4 230.7L604.5 231.8L598.4 226.9L583.1 224.2L589.8 218.5ZM601.2 122.5L601.2 122.5L601.1 122.6L601.2 122.5Z',
  Buleleng: 'M623.2 123.1L616.9 126.6L612.9 124.9L608.8 127.6L608.5 130.8L601.1 122.7L605.0 115.4L625.8 104.2L627.9 98.7L634.6 93.0L641.4 82.6L651.0 76.1L653.4 71.1L670.1 62.1L691.9 42.9L695.5 61.4L702.4 75.5L710.6 77.8L715.4 88.4L720.6 90.3L722.5 95.1L724.7 94.3L726.8 104.8L729.6 105.1L729.0 118.3L724.0 121.1L721.2 116.2L718.6 114.2L714.8 115.5L715.0 113.3L703.4 104.9L700.4 105.3L701.9 112.9L699.8 115.2L694.1 108.3L686.4 108.2L678.8 89.9L678.5 94.1L673.0 96.4L674.1 101.1L663.5 89.6L658.5 96.0L649.6 91.3L645.6 97.1L637.9 101.7L641.1 108.8L636.3 112.6L637.3 118.2L627.1 126.1L623.2 123.1Z',
  Sukasada: 'M673.5 185.6L662.7 183.7L659.1 180.9L648.7 195.1L648.5 191.0L642.8 186.5L638.4 175.2L631.6 175.1L627.5 167.4L616.0 160.8L613.7 156.8L615.7 156.0L612.5 143.9L606.4 139.0L609.7 134.1L609.4 127.1L613.3 124.7L616.9 126.6L624.6 122.6L627.1 126.1L637.3 118.2L636.3 112.6L641.1 108.8L637.9 101.7L645.6 97.1L649.6 91.3L658.5 96.0L663.5 89.6L674.1 101.1L673.0 96.4L678.5 94.1L678.8 89.9L683.5 98.4L682.1 101.3L685.0 107.1L687.9 109.1L694.1 108.3L699.8 115.2L701.9 113.0L699.9 109.6L702.1 104.6L715.0 113.3L714.8 115.5L718.7 114.2L723.5 120.9L728.9 118.4L730.3 112.9L730.3 123.8L745.1 143.1L738.5 153.9L740.7 171.9L738.7 183.1L752.5 202.8L741.3 214.8L724.8 220.9L721.0 226.1L713.1 230.2L703.6 252.7L700.7 267.0L693.1 264.8L684.0 257.5L684.4 245.3L687.3 240.1L681.8 237.3L684.0 227.8L682.0 212.8L676.1 205.9L676.7 198.3L673.5 185.6Z',
  Sawan: 'M725.7 97.7L720.6 90.3L715.4 88.4L709.3 76.5L702.4 75.5L695.5 61.4L691.9 42.9L705.3 40.5L732.8 26.2L747.0 24.8L739.5 39.9L747.7 51.7L738.2 53.0L737.7 67.6L742.4 69.2L742.4 75.1L745.0 73.9L751.4 79.3L755.0 85.5L755.9 96.5L758.9 102.0L766.0 106.5L766.6 112.2L774.0 117.4L780.4 118.4L785.7 131.4L795.6 137.3L796.5 139.9L795.9 145.6L790.9 154.3L790.7 166.7L781.6 178.8L765.3 193.1L757.4 204.8L747.8 198.5L738.7 183.1L740.7 171.9L738.5 153.9L745.1 143.2L730.3 123.8L729.6 105.1L726.8 104.8L725.7 97.7Z',
  Kubutambahan: 'M817.4 136.4L814.3 147.9L817.3 156.6L814.6 175.3L809.4 192.6L804.6 199.5L788.6 201.4L782.3 205.7L769.5 203.1L757.4 204.8L765.3 193.1L781.6 178.8L790.7 166.7L790.9 154.3L795.9 145.6L796.5 139.9L795.6 137.3L785.7 131.4L780.4 118.4L774.0 117.4L766.6 112.2L766.0 106.5L758.9 102.0L755.9 96.5L755.0 85.5L751.4 79.3L745.0 73.9L742.4 75.1L742.4 69.2L737.7 67.6L738.2 53.0L747.7 51.7L739.5 39.9L747.0 24.8L759.4 24.0L779.2 36.2L807.4 45.1L824.8 47.8L826.9 55.0L823.2 61.3L822.4 67.2L824.8 69.3L822.4 77.1L839.6 82.1L831.0 91.1L828.4 98.0L835.1 105.1L838.1 121.6L837.7 125.6L833.0 132.0L828.9 133.2L827.3 138.4L821.9 135.6L817.4 136.4Z',
  Tejakula: 'M890.2 102.8L885.5 108.4L889.6 112.2L889.7 115.5L882.1 124.9L873.5 129.0L873.5 133.3L866.5 131.0L864.1 127.5L860.0 131.2L855.8 131.0L852.0 127.5L851.2 121.4L837.7 125.6L835.1 105.1L828.4 98.0L831.0 91.1L839.6 82.1L822.4 77.1L824.8 69.3L822.4 67.2L823.2 61.3L826.9 55.0L824.8 47.8L835.7 49.6L847.0 57.9L864.6 66.2L878.0 67.5L892.6 74.1L908.7 73.2L926.8 89.6L959.5 97.6L972.2 103.8L983.1 112.8L1003.6 116.4L1020.5 123.2L1024.0 127.2L1010.1 133.2L1008.9 137.8L1004.4 141.4L985.3 146.1L982.5 143.9L986.2 136.2L979.7 132.4L971.2 131.4L965.7 137.3L952.8 131.5L945.0 124.2L940.6 129.2L932.1 120.2L927.7 125.2L924.5 119.5L926.2 114.8L924.2 112.1L923.1 115.1L917.6 118.4L913.5 109.9L907.7 109.0L902.2 121.0L898.7 122.2L897.9 111.6L890.2 102.8Z'
};

/* Titik label kira-kira di tengah tiap bentuk, untuk nama singkat + jumlah riset. */
const LABELS = {
  Gerokgak: [186, 132], Seririt: [500, 195], Busungbiu: [560, 275], Banjar: [615, 195],
  Buleleng: [672, 90], Sukasada: [695, 165], Sawan: [755, 115], Kubutambahan: [808, 130], Tejakula: [935, 100]
};

const MAROON = [142, 27, 27]; // #8E1B1B

function mixMaroon(ratio) {
  const base = 250;
  const r = Math.round(base + (MAROON[0] - base) * ratio);
  const g = Math.round(base + (MAROON[1] - base) * ratio);
  const b = Math.round(base + (MAROON[2] - base) * ratio);
  return `rgb(${r},${g},${b})`;
}

function BarRow({ label, value, max, warna }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(max ? Math.round((value / max) * 100) : 0), 60);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className="mb-1.5 grid grid-cols-[86px_1fr_20px] items-center gap-2 text-[.72rem]">
      <span className="truncate text-ink-3">{label}</span>
      <span className="h-1.5 overflow-hidden rounded-full bg-maroon-50">
        <span className="block h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${w}%`, background: warna }} />
      </span>
      <span className="text-right font-semibold tabular-nums text-ink-2">{value}</span>
    </div>
  );
}

export default function KecamatanMap() {
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const wrapRef = useRef(null);

  const maxRiset = useMemo(() => Math.max(1, ...KECAMATAN.map((k) => k.riset)), []);
  const kAktif = KECAMATAN.find((k) => k.id === active);
  const terkait = kAktif ? RISET.filter((r) => r.kecamatan === kAktif.id) : [];
  const kHover = KECAMATAN.find((k) => k.id === hover);

  function moveTip(e) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <>
      <div
        ref={wrapRef}
        onMouseMove={moveTip}
        className="relative overflow-visible rounded-3xl border border-line bg-gradient-to-br from-white to-maroon-50 p-6 shadow-[0_45px_80px_-35px_rgba(142,27,27,0.35)] sm:p-9"
      >
        <svg viewBox="0 0 1048 364.4" role="img" aria-label="Peta sebaran riset di 9 kecamatan Kabupaten Buleleng" className="w-full">
            <text x="524" y="18" textAnchor="middle" style={{ font: '600 11px var(--font-sans)', fill: '#B0473F', letterSpacing: '.16em' }}>
              LAUT BALI · PESISIR UTARA BULELENG
            </text>
            {KECAMATAN.map((k, i) => {
              const ratio = 0.16 + (k.riset / maxRiset) * 0.84;
              const isActive = active === k.id;
              const isHover = hover === k.id;
              return (
                <path
                  key={k.id}
                  d={KEC_PATHS[k.nama]}
                  fill={mixMaroon(ratio)}
                  stroke={isActive ? '#C98A2D' : isHover ? '#F9C74F' : '#FFFDF8'}
                  strokeWidth={isActive ? 3.2 : isHover ? 2.6 : 1.4}
                  strokeLinejoin="round"
                  tabIndex={0}
                  role="button"
                  aria-label={`Kecamatan ${k.nama}, ${k.riset} riset`}
                  className="animate-[petaIn_.6s_cubic-bezier(.16,1,.3,1)_backwards] cursor-pointer outline-none transition-[filter,transform] duration-200 ease-out"
                  style={{
                    animationDelay: `${i * 65}ms`,
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    transform: isHover ? 'scale(1.035)' : 'none',
                    filter: isHover || isActive ? 'drop-shadow(0 10px 16px rgba(142,27,27,.55))' : 'drop-shadow(0 2px 4px rgba(142,27,27,.12))',
                    outline: 'none'
                  }}
                  onMouseEnter={() => setHover(k.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setActive(k.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(k.id); } }}
                />
              );
            })}
            {KECAMATAN.map((k) => {
              const p = LABELS[k.nama];
              const ratio = 0.16 + (k.riset / maxRiset) * 0.84;
              const dark = ratio > 0.55;
              return (
                <g key={k.id} style={{ pointerEvents: 'none' }}>
                  <text x={p[0]} y={p[1]} textAnchor="middle" style={{ font: '700 10px var(--font-sans)', fill: dark ? '#FFF6EA' : '#5C1010' }}>{k.nama}</text>
                  <text x={p[0]} y={p[1] + 12} textAnchor="middle" style={{ font: '9px var(--font-sans)', fill: dark ? '#FCE7E7' : '#8E1B1B', opacity: 0.9 }}>{k.riset} riset</text>
                </g>
              );
            })}
          </svg>

          {kHover && !kAktif && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap text-[.85rem] font-bold text-[#4A0D0D]"
              style={{ left: tip.x, top: tip.y, textShadow: '0 1px 0 rgba(255,255,255,.9), 0 2px 10px rgba(255,255,255,.85)' }}
            >
              {kHover.nama} — {kHover.riset} riset · {kHover.fokus}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3.5 text-[.76rem] text-ink-3">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: mixMaroon(0.18) }} />Riset sedikit</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: mixMaroon(0.45) }} />Sedang</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: mixMaroon(0.72) }} />Tinggi</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: mixMaroon(1) }} />Terpadat</span>
          </div>
          <span className="text-[.78rem] font-medium text-ink-3">Klik salah satu wilayah pada peta untuk melihat detailnya.</span>
        </div>
      {kAktif && (
        <Modal title={`Kecamatan ${kAktif.nama}`} onClose={() => setActive(null)}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[.85rem] text-ink-2">Sebaran riset &amp; potensi wilayah</span>
            <span className="rounded-full bg-maroon-50 px-2.5 py-1 text-[.715rem] font-bold text-maroon-800">{kAktif.riset} riset</span>
          </div>
          <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[.845rem]">
            <dt className="font-semibold text-ink-3">Desa/kelurahan</dt><dd className="m-0 font-semibold text-ink">{kAktif.desa}</dd>
            <dt className="font-semibold text-ink-3">Fokus riset</dt><dd className="m-0 font-semibold text-ink">{kAktif.fokus}</dd>
          </dl>

          <div className="mb-3">
            <div className="mb-1.5 text-[.76rem] font-bold uppercase tracking-wide text-ink-3">Sebaran per bidang prioritas</div>
            {BIDANG.map((b) => (
              <BarRow
                key={b.id}
                label={b.nama.split(' ')[0]}
                value={terkait.filter((r) => r.bidang === b.id).length}
                max={Math.max(1, ...BIDANG.map((bb) => terkait.filter((r) => r.bidang === bb.id).length))}
                warna={bidangById(b.id).warna}
              />
            ))}
          </div>

          {terkait.length ? (
            <>
              <div className="mb-1.5 text-[.79rem] text-ink-3">Riset dalam katalog:</div>
              {terkait.slice(0, 3).map((r) => (
                <Link key={r.id} to={`/riset/${r.id}`} onClick={() => setActive(null)} className="mb-1.5 block text-[.82rem] font-semibold text-ink no-underline hover:text-maroon-800">• {r.judul}</Link>
              ))}
            </>
          ) : (
            <p className="m-0 text-[.82rem] text-ink-2">Belum ada riset katalog aktif. Kecamatan ini menjadi prioritas penjaringan usulan batch berikutnya.</p>
          )}
          <Link to={`/riset?kecamatan=${kAktif.id}`} onClick={() => setActive(null)} className="mt-2.5 block rounded-lg border border-line-strong px-3 py-2 text-center text-[.83rem] font-semibold text-maroon-800 no-underline hover:border-maroon-800 hover:bg-maroon-50">
            Lihat semua riset {kAktif.nama}
          </Link>
        </Modal>
      )}
    </>
  );
}
