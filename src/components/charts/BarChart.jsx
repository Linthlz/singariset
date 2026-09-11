export default function BarChart({ rows, height = 260, aria = 'Grafik batang', fmtAxis }) {
  const W = 640, H = height, PADL = 52, PADB = 34, PADT = 14, PADR = 10;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const niceMax = Math.ceil(max / 4) * 4 || 4;
  const plotW = W - PADL - PADR, plotH = H - PADT - PADB;
  const bw = plotW / rows.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria} className="w-full min-w-[380px]" style={{ height: 'auto' }}>
      {[0, 1, 2, 3, 4].map((g) => {
        const y = PADT + plotH - (plotH / 4) * g;
        const lv = (niceMax / 4) * g;
        return (
          <g key={g}>
            <line x1={PADL} y1={y} x2={W - PADR} y2={y} stroke="var(--color-line)" strokeWidth="1" strokeDasharray="3 4" />
            <text x={PADL - 9} y={y + 4} textAnchor="end" className="fill-ink-3" style={{ font: '11px var(--font-sans)' }}>
              {fmtAxis ? fmtAxis(lv) : Math.round(lv)}
            </text>
          </g>
        );
      })}
      {rows.map((r, i) => {
        const h = (r.value / niceMax) * plotH;
        const x = PADL + i * bw + bw * 0.22;
        const w = bw * 0.56;
        const y = PADT + plotH - h;
        return (
          <g key={r.label} className="cursor-pointer opacity-100 transition-opacity hover:opacity-75">
            <rect x={x} y={y} width={w} height={Math.max(h, 1)} rx={4} fill={r.color || '#8E1B1B'}>
              <title>{r.label}: {r.tip || r.value}</title>
            </rect>
            <text x={x + w / 2} y={y - 7} textAnchor="middle" style={{ font: '700 11px var(--font-sans)', fill: '#111827' }}>
              {r.top != null ? r.top : r.value}
            </text>
            <text x={x + w / 2} y={H - PADB + 19} textAnchor="middle" className="fill-ink-3" style={{ font: '11px var(--font-sans)' }}>
              {r.label}
            </text>
          </g>
        );
      })}
      <line x1={PADL} y1={PADT + plotH} x2={W - PADR} y2={PADT + plotH} stroke="var(--color-line)" />
    </svg>
  );
}
