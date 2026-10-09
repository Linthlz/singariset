import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LionMark from '../components/LionMark.jsx';
import Icon from '../components/Icon.jsx';
import { ROLES, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errorMessage } from '../services/api.js';

function loginError(err) {
  if (err?.status === 401) return 'Surel atau kata sandi salah.';
  if (err?.status === 400) return 'Surel dan kata sandi wajib diisi dengan benar.';
  return errorMessage(err);
}

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Surel dan kata sandi wajib diisi.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim())) {
      setError('Format surel tidak valid.');
      return;
    }

    setBusy(true);
    try {
      const user = await login(form);
      toast('success', 'Berhasil masuk', `Selamat datang, ${user.nama}.`);
      navigate(next || ROLES[user.role].beranda, { replace: true });
    } catch (err) {
      setError(loginError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <div className="mx-auto flex min-h-screen max-w-[1240px] items-center justify-center px-4 py-8 sm:px-5 sm:py-12">
        <div className="w-full max-w-[420px]">

          <Link to="/" className="mb-6 flex items-center justify-center gap-3 no-underline sm:mb-8">
            <LionMark size={44} />
            <span className="flex flex-col leading-tight">
              <span className="font-head text-[1rem] font-extrabold tracking-tight text-maroon-800">SINGA RISET BULELENG</span>
              <span className="text-[.68rem] font-medium text-ink-3">Portal Riset &amp; Inovasi Daerah</span>
            </span>
          </Link>

          <div className="rounded-xl border border-line bg-white p-5 sm:p-7">
            <h1 className="mb-1 text-[1.35rem]">Masuk ke akun Anda</h1>
            <p className="mb-6 text-[.875rem] text-ink-2">
              Gunakan akun mitra, instansi, atau perangkat daerah yang telah terdaftar.
            </p>

            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-danger-bg bg-danger-bg px-3.5 py-3 text-[.84rem] text-[#7F1D1D]">
                <Icon name="alert" size={17} className="mt-0.5 flex-none text-danger" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[.84rem] font-semibold text-ink">Surel</label>
                <input
                  id="email" type="email" autoComplete="email" className="input-base"
                  value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="nama@instansi.go.id"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-[.84rem] font-semibold text-ink">Kata sandi</label>
                <div className="relative">
                  <input
                    id="password" type={showPass ? 'text' : 'password'} autoComplete="current-password"
                    className="input-base pr-11"
                    value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Masukkan kata sandi"
                  />
                  <button
                    type="button" onClick={() => setShowPass((s) => !s)}
                    aria-label={showPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-3 hover:bg-surface-1 hover:text-ink"
                  >
                    <Icon name={showPass ? 'eyeOff' : 'eye'} size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-[.83rem] text-ink-2">
                  <input type="checkbox" className="h-4 w-4 accent-maroon-800" defaultChecked />
                  Ingat saya
                </label>
                <button type="button" onClick={() => toast('info', 'Atur ulang kata sandi', 'Hubungi administrator BRIDA di brida@bulelengkab.go.id untuk pengaturan ulang kata sandi.')}
                  className="text-[.83rem] font-semibold text-maroon-800 hover:underline">
                  Lupa kata sandi?
                </button>
              </div>

              <button type="submit" disabled={busy}
                className="rounded-lg bg-maroon-800 px-5 py-3 text-[.92rem] font-semibold text-white transition hover:bg-maroon-600 disabled:opacity-50">
                {busy ? 'Memverifikasi…' : 'Masuk'}
              </button>
            </form>

            <p className="mt-5 border-t border-line pt-5 text-center text-[.855rem] text-ink-2">
              Belum punya akun? <Link to="/register" className="font-semibold text-maroon-800 hover:underline">Daftar sebagai mitra atau OPD</Link>
            </p>
          </div>

          <p className="mt-5 text-center text-[.8rem] text-ink-3">
            <Link to="/" className="hover:text-maroon-800">← Kembali ke beranda portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
