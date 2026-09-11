export default function LineChart({ rows, height = 240, aria = 'Grafik garis', fmtAxis }) {
  const W = 640, H = height, PADL = 58, PADB = 32, PADT = 16, PADR = 14;
  const vals = rows.map((r) => r.value);
  const max = Math.max(...vals, 1);
  const niceMax = max * 1.12;
  const plotW = W - PADL - PADR, plotH = H - PADT - PADB;
  const stepX = rows.length > 1 ? plotW / (rows.length - 1) : 0;
  const pts = rows.map((r, i) => [PADL + i * stepX, PADT + plotH - (r.value / niceMax) * plotH]);
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const areaPath = `${path} L${pts[pts.length - 1][0].toFixed(1)} ${PADT + plotH} L${pts[0][0].toFixed(1)} ${PADT + plotH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria} className="w-full min-w-[380px]" style={{ height: 'auto' }}>
      <defs>
        <linearGradient id="lgFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C62828" stopOpacity=".28" />
          <stop offset="100%" stopColor="#C62828" stopOpacity="0" />
        </linearGradient>
      </defs>
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
      <path d={areaPath} fill="url(#lgFill)" />
      <path d={path} fill="none" stroke="#C62828" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={rows[i].label}>
          <circle cx={p[0]} cy={p[1]} r={4.5} fill="#fff" stroke="#8E1B1B" strokeWidth="2.4">
            <title>{rows[i].label}: {rows[i].tip || rows[i].value}</title>
          </circle>
          <text x={p[0]} y={H - PADB + 19} textAnchor="middle" className="fill-ink-3" style={{ font: '11px var(--font-sans)' }}>
            {rows[i].label}
          </text>
        </g>
      ))}
      <line x1={PADL} y1={PADT + plotH} x2={W - PADR} y2={PADT + plotH} stroke="var(--color-line)" />
    </svg>
  );
}
