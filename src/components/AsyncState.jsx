import Icon from './Icon.jsx';
import { errorMessage } from '../services/api.js';

/** Kerangka abu-abu berdenyut selama data dimuat, agar tata letak tidak "loncat". */
export function SkeletonGrid({ count = 3, className = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3', itemClassName = 'h-64' }) {
  return (
    <div className={className} role="status" aria-live="polite" aria-label="Memuat data">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`animate-pulse rounded-xl border border-line bg-surface-2 ${itemClassName}`} />
      ))}
      <span className="sr-only">Memuat data…</span>
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'Gagal memuat data', compact = false }) {
  const offline = error?.kind === 'network' || error?.kind === 'timeout';
  return (
    <div role="alert" className={`flex flex-col items-center rounded-xl border border-danger-bg bg-danger-bg/40 text-center ${compact ? 'px-4 py-6' : 'px-6 py-12'}`}>
      <Icon name="alert" size={compact ? 28 : 40} className="mb-3 text-danger" />
      <h3 className="mb-1 text-[1rem] text-ink">{offline ? 'Server tidak dapat dihubungi' : title}</h3>
      <p className="mb-4 max-w-[480px] text-[.86rem] text-ink-2">{errorMessage(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-maroon-800 px-4.5 py-2.25 text-[.84rem] font-semibold text-white transition hover:bg-maroon-600">
          <Icon name="refresh" size={15} /> Coba lagi
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Belum ada data', text, icon = 'search', action }) {
  return (
    <div className="py-14 text-center text-ink-3">
      <Icon name={icon} size={44} className="mx-auto mb-3.5 opacity-40" />
      <h3 className="text-[1.02rem] text-ink-2">{title}</h3>
      {text && <p className="mb-0">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/**
 * Memilih tampilan sesuai status: loading pertama → skeleton, gagal tanpa data → error,
 * kosong → empty state, selain itu render children.
 */
export default function AsyncState({ loading, error, isEmpty, onRetry, skeleton, empty, children }) {
  if (loading && isEmpty) return skeleton || <SkeletonGrid />;
  if (error && isEmpty) return <ErrorState error={error} onRetry={onRetry} />;
  if (isEmpty) return empty || <EmptyState />;
  return (
    <>
      {error && <div className="mb-4"><ErrorState compact error={error} onRetry={onRetry} title="Gagal memperbarui data" /></div>}
      {children}
    </>
  );
}
