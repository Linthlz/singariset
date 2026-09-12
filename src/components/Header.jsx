import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import LionMark from './LionMark.jsx';
import Icon from './Icon.jsx';
import SearchBox from './SearchBox.jsx';
import { ROLES, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/* Navigasi dikelompokkan agar bilah atas tidak penuh. */
const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Riset',
    anak: [
      { label: 'Direktori Riset Daerah', href: '/riset', ikon: 'flask', ket: 'Katalog riset yang didanai BRIDA' },
      { label: 'Peta Jalan Riset', href: '/roadmap', ikon: 'target', ket: 'Prioritas riset daerah 2025–2029' },
      { label: 'Publikasi & Dokumentasi', href: '/publikasi', ikon: 'camera', ket: 'Foto, video, dan narasi hasil riset' }
    ]
  },
  {
    label: 'Informasi',
    anak: [
      { label: 'Berita & Diseminasi', href: '/berita', ikon: 'doc', ket: 'Kabar terkini ekosistem riset' },
      { label: 'Peluang Pendanaan', href: '/#pendanaan', ikon: 'money', ket: 'Skema hibah dan insentif' },
      { label: 'Etika & Regulasi', href: '/etika-regulasi', ikon: 'shield', ket: 'Klirens etik, SOP, pengaduan' }
    ]
  },
  { label: 'Kolaborasi', href: '/kolaborasi' }
];

function navClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-[.855rem] font-semibold whitespace-nowrap transition ${
    isActive ? 'bg-maroon-50 text-maroon-800' : 'text-ink-2 hover:bg-surface-1 hover:text-maroon-800'
  }`;
}

/* ---------- Dropdown navigasi ---------- */
function NavDropdown({ item, terbuka, setTerbuka }) {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const aktif = item.anak.some((a) => a.href !== '/' && pathname.startsWith(a.href.split('#')[0]) && a.href.split('#')[0] !== '/');

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setTerbuka(null); }
    function onKey(e) { if (e.key === 'Escape') setTerbuka(null); }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, [setTerbuka]);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setTerbuka(item.label)}
      onMouseLeave={() => setTerbuka(null)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={terbuka === item.label}
        onClick={(e) => { e.stopPropagation(); setTerbuka(terbuka === item.label ? null : item.label); }}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[.855rem] font-semibold whitespace-nowrap transition ${
          aktif || terbuka === item.label ? 'bg-maroon-50 text-maroon-800' : 'text-ink-2 hover:bg-surface-1 hover:text-maroon-800'
        }`}
      >
        {item.label}
        <Icon name="chevronDown" size={14} className={`transition-transform duration-200 ${terbuka === item.label ? 'rotate-180' : ''}`} />
      </button>

      {terbuka === item.label && (
        <div className="absolute left-0 top-full z-[70] w-[310px] pt-2">
          <div className="overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-pop">
            {item.anak.map((a) => (
              <Link
                key={a.href}
                to={a.href}
                onClick={() => setTerbuka(null)}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 no-underline transition hover:bg-surface-1"
              >
                <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg bg-maroon-50 text-maroon-800">
                  <Icon name={a.ikon} size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[.855rem] font-semibold text-ink">{a.label}</span>
                  <span className="block text-[.745rem] leading-snug text-ink-3">{a.ket}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Menu akun ---------- */
function AccountMenu({ onNavigate }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const peran = ROLES[user.role];

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  function keluar() {
    logout();
    setOpen(false);
    onNavigate?.();
    toast('info', 'Anda telah keluar', 'Sesi akun ditutup dengan aman.');
    navigate('/', { replace: true });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button" aria-haspopup="true" aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="flex items-center gap-2 rounded-full border border-line-strong bg-white px-2.5 py-1.5 text-[.79rem] font-semibold text-ink-2 transition hover:border-maroon-600 hover:text-maroon-800"
      >
        <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-maroon-800 text-[.66rem] font-extrabold text-white">{peran.init}</span>
        <span className="hidden max-w-[120px] truncate sm:inline">{user.nama.split(',')[0]}</span>
        <Icon name="arrowDown" size={13} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-[70] w-72 rounded-2xl border border-line bg-white p-1.5 shadow-pop">
          <div className="border-b border-line px-3 pb-3 pt-2.5">
            <div className="text-[.85rem] font-bold text-ink">{user.nama}</div>
            <div className="text-[.75rem] text-ink-3">{user.instansi}</div>
            <span className="mt-1.5 inline-block rounded-full bg-maroon-50 px-2.5 py-1 text-[.7rem] font-bold text-maroon-800">{peran.nama}</span>
          </div>

          <Link to={peran.beranda} onClick={() => { setOpen(false); onNavigate?.(); }} role="menuitem"
            className="mt-1.5 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[.85rem] font-semibold text-ink no-underline hover:bg-surface-1">
            <Icon name="chart" size={16} className="text-maroon-800" />
            {user.role === 'mitra' ? 'Ajukan kolaborasi riset' : 'Buka dashboard'}
          </Link>

          <button type="button" onClick={keluar} role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[.85rem] font-semibold text-danger hover:bg-danger-bg">
            <Icon name="external" size={16} /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { isAuth } = useAuth();
  const { pathname } = useLocation();
  const [stuck, setStuck] = useState(false);
  const [tersembunyi, setTersembunyi] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [grupMobile, setGrupMobile] = useState(null);
  const lastY = useRef(0);

  /* Sembunyi saat gulir ke bawah, muncul lagi saat gulir ke atas. */
  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const selisih = y - lastY.current;
      setStuck(y > 8);

      // Abaikan getaran kecil agar bilah tidak berkedip.
      if (Math.abs(selisih) < 6) return;

      if (y > 140 && selisih > 0) {
        setTersembunyi(true);
        setDropdown(null);
      } else if (selisih < 0) {
        setTersembunyi(false);
      }
      lastY.current = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Tutup semua menu ketika pindah halaman. */
  useEffect(() => {
    setDropdown(null);
    setMobileOpen(false);
    setMobileSearch(false);
    setGrupMobile(null);
    setTersembunyi(false);
  }, [pathname]);

  return (
    <div className={`sticky top-0 z-[60] transition-transform duration-300 ease-out ${tersembunyi ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="bg-maroon-900 py-1.5 text-[.76rem] text-white/82">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-3.5 px-5 sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 flex-none rounded-sm" style={{ background: 'linear-gradient(180deg,#C62828 50%,#fff 50%)' }} aria-hidden="true" />
            <span>Portal Resmi <b>BRIDA Kabupaten Buleleng</b>, Pemerintah Kabupaten Buleleng, Provinsi Bali</span>
          </div>
          <div className="hidden gap-4 sm:flex">
            <Link to="/etika-regulasi#pengaduan" className="text-white/90 hover:text-gold-500">Pengaduan Riset</Link>
            <Link to="/etika-regulasi#klirens" className="text-white/90 hover:text-gold-500">Klirens Etik</Link>
            <Link to="/#kontak" className="text-white/90 hover:text-gold-500">Hubungi BRIDA</Link>
          </div>
        </div>
      </div>

      <header className={`border-b border-line bg-white/96 backdrop-blur-md transition-shadow ${stuck ? 'shadow-lift' : ''}`}>
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-5 py-2.5">
          <Link to="/" className="mr-auto flex items-center gap-3 no-underline">
            <LionMark size={42} />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-head text-[1rem] font-extrabold tracking-tight text-maroon-800">SINGA RISET BULELENG</span>
              <span className="text-[.68rem] font-medium text-ink-3">Sinergi Gerakan Akademisi dan Riset Buleleng</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigasi utama">
            {NAV_ITEMS.map((n) =>
              n.anak
                ? <NavDropdown key={n.label} item={n} terbuka={dropdown} setTerbuka={setDropdown} />
                : <NavLink key={n.href} to={n.href} end={n.href === '/'} className={navClass}>{n.label}</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setMobileSearch((s) => !s)} aria-label="Buka pencarian"
              className="grid h-9.5 w-9.5 place-items-center rounded-lg border border-line-strong text-maroon-800 lg:hidden">
              <Icon name="search" size={18} />
            </button>

            {isAuth ? (
              <AccountMenu onNavigate={() => setMobileOpen(false)} />
            ) : (
              <>
                <Link to="/login" className="hidden rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold text-maroon-800 no-underline transition hover:border-maroon-800 hover:bg-maroon-50 sm:block">
                  Masuk
                </Link>
                <Link to="/register" className="hidden items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-maroon-600 sm:flex">
                  Daftar
                </Link>
              </>
            )}

            <button type="button" onClick={() => setMobileOpen((o) => !o)} aria-label="Buka menu navigasi" aria-expanded={mobileOpen}
              className="grid h-9.5 w-9.5 place-items-center rounded-lg border border-line-strong text-maroon-800 lg:hidden">
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>

        {mobileSearch && (
          <div className="border-t border-line bg-surface-1 px-5 py-3 lg:hidden">
            <SearchBox variant="inline" onNavigate={() => setMobileSearch(false)} />
          </div>
        )}

        {mobileOpen && (
          <nav className="flex max-h-[70vh] flex-col gap-0.5 overflow-y-auto border-t border-line bg-white px-5 pb-4 pt-2.5 shadow-lift lg:hidden" aria-label="Navigasi mobile">
            {NAV_ITEMS.map((n) =>
              n.anak ? (
                <div key={n.label}>
                  <button
                    type="button"
                    onClick={() => setGrupMobile(grupMobile === n.label ? null : n.label)}
                    aria-expanded={grupMobile === n.label}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[.855rem] font-semibold text-ink-2 hover:bg-surface-1 hover:text-maroon-800"
                  >
                    {n.label}
                    <Icon name="chevronDown" size={15} className={`transition-transform ${grupMobile === n.label ? 'rotate-180' : ''}`} />
                  </button>
                  {grupMobile === n.label && (
                    <div className="mb-1 ml-3 border-l border-line pl-3">
                      {n.anak.map((a) => (
                        <Link key={a.href} to={a.href} onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[.83rem] font-semibold text-ink-2 no-underline hover:bg-surface-1 hover:text-maroon-800">
                          <Icon name={a.ikon} size={15} className="flex-none text-maroon-800" />
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={n.href} to={n.href} end={n.href === '/'} onClick={() => setMobileOpen(false)} className={navClass}>{n.label}</NavLink>
              )
            )}

            {!isAuth && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg border border-line-strong px-4 py-2.5 text-center text-sm font-semibold text-maroon-800 no-underline">Masuk</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-maroon-800 px-4 py-2.5 text-center text-sm font-semibold text-white no-underline">Daftar</Link>
              </div>
            )}
          </nav>
        )}
      </header>
    </div>
  );
}
