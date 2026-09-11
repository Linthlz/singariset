export default function ScoreRing({ value, size = 128 }) {
  const r = 54, cx = 64, cy = 64, C = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const color = value >= 85 ? '#15803D' : value >= 70 ? '#8E1B1B' : value >= 55 ? '#B45309' : '#B91C1C';

  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" width={size} height={size} aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${(C * pct).toFixed(1)} ${(C * (1 - pct)).toFixed(1)}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <b className="block font-head text-[2rem] font-extrabold leading-none tabular-nums" style={{ color }}>
            {value.toFixed(1).replace('.', ',')}
          </b>
          <span className="text-[.68rem] font-bold uppercase tracking-widest text-ink-3">Nilai Akhir</span>
        </div>
      </div>
    </div>
  );
}
