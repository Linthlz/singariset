import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildSearchIndex } from '../lib/searchIndex.js';
import Icon from './Icon.jsx';

export default function SearchBox({ variant = 'hero', placeholder, onNavigate }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const hostRef = useRef(null);
  const navigate = useNavigate();
  const idx = useRef(buildSearchIndex());

  const hits = q.trim().length >= 2
    ? idx.current.filter((it) => it.key.includes(q.trim().toLowerCase())).slice(0, 7)
    : [];

  useEffect(() => {
    function onDoc(e) { if (hostRef.current && !hostRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  function go(href) {
    setOpen(false); setQ('');
    if (href.startsWith('/')) navigate(href);
    else window.location.hash = href.replace('/#', '');
    onNavigate?.();
  }

  function submit() {
    if (cursor > -1 && hits[cursor]) { go(hits[cursor].href); return; }
    if (q.trim()) { navigate(`/riset?q=${encodeURIComponent(q.trim())}`); setOpen(false); onNavigate?.(); }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!hits.length) return;
      e.preventDefault();
      setCursor((c) => (e.key === 'ArrowDown' ? (c + 1) % hits.length : (c - 1 + hits.length) % hits.length));
    } else if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'Escape') setOpen(false);
  }

  const isHero = variant === 'hero';

  return (
    <div className="relative" ref={hostRef}>
      <div className={isHero
        ? 'flex items-center gap-2.5 rounded-lg bg-white p-1.5 pl-4 shadow-pop'
        : 'flex items-center gap-2 rounded-lg border border-line-strong bg-surface-1 px-3 py-2'}
      >
        <Icon name="search" size={isHero ? 19 : 17} className="flex-none text-ink-3" />
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          value={q}
          placeholder={placeholder || 'Cari riset, peneliti, komoditas, atau kecamatan…'}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(-1); }}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          onKeyDown={onKeyDown}
          className={
            isHero
              ? 'min-w-0 flex-1 border-none bg-transparent py-1.5 text-[.93rem] text-ink outline-none placeholder:text-ink-3'
              : 'min-w-0 flex-1 border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-3'
          }
        />
        {isHero && (
          <button type="button" onClick={submit} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-600">
            Telusuri
          </button>
        )}
      </div>

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-40 max-h-[340px] overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-pop">
          {hits.length === 0 ? (
            <div className="p-4 text-center text-sm text-ink-3">
              Tidak ada hasil untuk “{q}”. Coba kata kunci lain seperti <b>subak</b>, <b>Lovina</b>, atau <b>kopi</b>.
            </div>
          ) : (
            <>
              <div className="px-2.5 pb-1 pt-2 text-[.67rem] font-bold uppercase tracking-widest text-ink-3">{hits.length} hasil teratas</div>
              {hits.map((it, i) => (
                <button
                  key={it.href + it.judul}
                  type="button"
                  onClick={() => go(it.href)}
                  onMouseEnter={() => setCursor(i)}
                  className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left ${i === cursor ? 'bg-surface-2' : 'hover:bg-surface-2'}`}
                >
                  <span className="grid h-7.5 w-7.5 flex-none place-items-center rounded-lg bg-maroon-50 text-maroon-800">
                    <Icon name={it.ikon} size={15} />
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-[.855rem] font-semibold text-ink">{it.judul}</strong>
                    <span className="block truncate text-[.75rem] text-ink-3">{it.tipe} · {it.sub}</span>
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
