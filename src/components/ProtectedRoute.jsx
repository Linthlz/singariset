import { Link, Navigate, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { ROLES, useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ allow, children }) {
  const { isAuth, user } = useAuth();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allow && !allow.includes(user.role)) {
    const beranda = ROLES[user.role].beranda;
    return (
      <div className="grid min-h-[70vh] place-items-center bg-surface-1 px-5 py-16">
        <div className="w-full max-w-[480px] rounded-xl border border-line bg-white p-8 text-center">
          <span className="mx-auto mb-4 grid h-13 w-13 place-items-center rounded-full bg-warning-bg text-warning">
            <Icon name="lock" size={24} />
          </span>
          <h1 className="mb-2 text-[1.25rem]">Akses tidak tersedia</h1>
          <p className="mb-5 text-[.88rem] text-ink-2">
            Halaman ini khusus untuk {allow.map((r) => ROLES[r].nama).join(' dan ')}.
            Akun Anda saat ini terdaftar sebagai <b>{ROLES[user.role].nama}</b>.
          </p>
          <Link to={beranda} className="inline-flex items-center gap-2 rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-maroon-600">
            Ke halaman utama akun Anda
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
