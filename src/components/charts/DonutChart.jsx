export default function DonutChart({ rows, size = 190, thick = 30, centerTop, centerSub, aria = 'Grafik donat' }) {
  const r = size / 2 - 16, cx = size / 2, cy = size / 2;
  const total = rows.reduce((a, b) => a + b.value, 0) || 1;
  const C = 2 * Math.PI * r;
  let off = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={aria} className="w-full" style={{ maxWidth: size, height: 'auto' }}>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {rows.map((row) => {
          const frac = row.value / total, len = C * frac;
          const el = (
            <circle
              key={row.label}
              cx={cx} cy={cy} r={r} fill="none"
              stroke={row.color} strokeWidth={thick}
              strokeDasharray={`${len.toFixed(2)} ${(C - len).toFixed(2)}`}
              strokeDashoffset={(-off).toFixed(2)}
            >
              <title>{row.label}: {row.value}%</title>
            </circle>
          );
          off += len;
          return el;
        })}
      </g>
      {centerTop && (
        <>
          <text x={cx} y={cy - 2} textAnchor="middle" style={{ font: '800 26px var(--font-head)', fill: '#8E1B1B' }}>{centerTop}</text>
          <text x={cx} y={cy + 17} textAnchor="middle" style={{ font: '600 10.5px var(--font-sans)', fill: '#6B7280', letterSpacing: '.08em' }}>{centerSub}</text>
        </>
      )}
    </svg>
  );
}
