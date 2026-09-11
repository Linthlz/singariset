/**
 * Ranked horizontal bars, satu hue.
 * Identitas dibawa label langsung (teks), bukan warna — jadi tidak perlu
 * palet kategorikal maupun kotak legenda untuk seri tunggal.
 */
export default function HBarChart({ rows, fmt = (v) => v, ariaLabel = 'Grafik batang horizontal' }) {
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div role="img" aria-label={ariaLabel} className="flex flex-col gap-3">
      {rows.map((r) => {
        const pct = (r.value / max) * 100;
        return (
          <div key={r.label} className="group grid grid-cols-[minmax(120px,auto)_1fr_auto] items-center gap-3">
            <span className="truncate text-[.82rem] font-medium text-ink-2" title={r.label}>{r.label}</span>
            <span className="h-5 w-full rounded-[2px] bg-surface-1" title={`${r.label}: ${fmt(r.value)}`}>
              <span
                className="block h-full rounded-r-[4px] bg-maroon-800 transition-opacity group-hover:opacity-80"
                style={{ width: `${Math.max(pct, 1.5)}%` }}
              />
            </span>
            <span className="w-14 text-right text-[.82rem] font-semibold tabular-nums text-ink">{fmt(r.value)}</span>
          </div>
        );
      })}
    </div>
  );
}
