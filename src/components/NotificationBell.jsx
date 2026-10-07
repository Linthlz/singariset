import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../hooks/useData.js';
import { notificationService } from '../services/notificationService.js';
import { errorMessage } from '../services/api.js';

// Backend belum menyimpan status "dibaca"; penanda terakhir dilihat disimpan per browser.
const seenKey = (userId) => `singa.notif.seen.${userId}`;

function readSeen(userId) {
  try { return localStorage.getItem(seenKey(userId)) || ''; } catch { return ''; }
}

function waktuRelatif(iso) {
  const t = new Date(iso).getTime();
  if (!t) return '';
  const menit = Math.round((Date.now() - t) / 60000);
  if (menit < 1) return 'baru saja';
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.round(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => readSeen(user.publicId));
  const { data, loading, error, reload } = useData(({ signal }) => notificationService.list({ limit: 10, signal }), []);
  const ref = useRef(null);
  const list = data || [];
  const baru = list.filter((n) => n.waktu > seen).length;

  useEffect(() => {
    if (!open) return undefined;
    const tutup = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', tutup);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', tutup); document.removeEventListener('keydown', esc); };
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      reload();
      const terbaru = list[0]?.waktu;
      if (terbaru) {
        setSeen(terbaru);
        try { localStorage.setItem(seenKey(user.publicId), terbaru); } catch { /* mode privat */ }
      }
    }
  }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={toggle} aria-label={baru ? `Notifikasi, ${baru} baru` : 'Notifikasi'} aria-expanded={open}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-line-strong text-ink-2 transition hover:border-maroon-600 hover:text-maroon-800">
        <Icon name="bell" size={17} />
        {baru > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-maroon-800 px-1 text-[.62rem] font-bold text-white">{baru > 9 ? '9+' : baru}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-40 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-xl border border-line bg-white shadow-pop">
          <div className="border-b border-line px-4 py-3 text-[.86rem] font-bold text-ink">Notifikasi</div>
          <div className="max-h-[380px] overflow-y-auto">
            {loading && !data && <p className="m-0 px-4 py-6 text-center text-[.82rem] text-ink-3">Memuat…</p>}
            {error && !data && <p className="m-0 px-4 py-6 text-center text-[.82rem] text-danger">{errorMessage(error)}</p>}
            {data && list.length === 0 && <p className="m-0 px-4 py-6 text-center text-[.82rem] text-ink-3">Belum ada notifikasi.</p>}
            <ul className="m-0 list-none divide-y divide-line p-0">
              {list.map((n) => (
                <li key={n.id} className="px-4 py-3">
                  <span className="block text-[.82rem] font-semibold text-ink">{n.judul}</span>
                  {n.pesan && <span className="mt-0.5 block text-[.78rem] leading-5 text-ink-2">{n.pesan}</span>}
                  <span className="mt-1 block text-[.7rem] text-ink-3">{waktuRelatif(n.waktu)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
