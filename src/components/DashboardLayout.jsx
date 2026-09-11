import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LionMark from './LionMark.jsx';
import Icon from './Icon.jsx';
import { ROLES, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function DashboardLayout({ menu, active, onSelect, title, subtitle, children }) {
  const { user } = useAuth();
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const peran = ROLES[user.role];

  function keluar() {
    logout();
    toast('info', 'Anda telah keluar', 'Sesi akun ditutup dengan aman.');
    navigate('/', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-surface-1">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col bg-maroon-950 text-white transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link to="/" className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4 no-underline">
          <LionMark size={34} />
          <span className="flex flex-col leading-tight">
            <span className="font-head text-[.82rem] font-extrabold tracking-tight text-white">SINGA RISET</span>
            <span className="text-[.66rem] text-white/55">Dashboard {peran.id === 'admin' ? 'Administrator' : 'OPD'}</span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Navigasi dashboard">
          <div className="px-2 pb-2 pt-1 text-[.65rem] font-bold uppercase tracking-widest text-white/40">Menu</div>
          {menu.map((m) => (
            <button
              key={m.id} type="button"
              onClick={() => { onSelect(m.id); setOpen(false); }}
              aria-current={active === m.id ? 'page' : undefined}
              className={`mb-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[.855rem] font-semibold transition ${
                active === m.id ? 'bg-white/14 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon name={m.ikon} size={17} className="flex-none" />
              <span className="flex-1">{m.label}</span>
              {m.badge != null && (
                <span className="flex-none rounded-full bg-gold-500 px-1.75 py-0.5 text-[.65rem] font-extrabold text-[#4A2D00]">{m.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-white/8 px-3 py-2.5">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-gold-500 text-[.7rem] font-extrabold text-[#4A2D00]">{peran.init}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[.8rem] font-semibold text-white">{user.nama}</span>
              <span className="block truncate text-[.68rem] text-white/55">{user.instansi}</span>
            </span>
          </div>
          <button type="button" onClick={keluar}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-[.82rem] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
            <Icon name="external" size={15} /> Keluar
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      {/* Konten */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/95 px-5 py-3.5 backdrop-blur-md">
          <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu dashboard"
            className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-line-strong text-maroon-800 lg:hidden">
            <Icon name="menu" size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="m-0 truncate text-[1.05rem] font-extrabold">{title}</h1>
            {subtitle && <p className="m-0 truncate text-[.78rem] text-ink-3">{subtitle}</p>}
          </div>
          <Link to="/" className="hidden items-center gap-1.5 rounded-lg border border-line-strong px-3.5 py-2 text-[.82rem] font-semibold text-ink-2 no-underline transition hover:border-maroon-600 hover:text-maroon-800 sm:flex">
            <Icon name="globe" size={15} /> Lihat portal publik
          </Link>
        </header>

        <main className="min-w-0 flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
