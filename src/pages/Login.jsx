import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LionMark from '../components/LionMark.jsx';
import Icon from '../components/Icon.jsx';
import { DEMO_ACCOUNTS, ROLES, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

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

  function submit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Surel dan kata sandi wajib diisi.');
      return;
    }

    setBusy(true);
    setTimeout(() => {
      const res = login(form);
      setBusy(false);
      if (!res.ok) { setError(res.error); return; }
      toast('success', 'Berhasil masuk', `Selamat datang, ${res.user.nama}.`);
      navigate(next || ROLES[res.user.role].beranda, { replace: true });
    }, 450);
  }

  function isiDemo(akun) {
    setForm({ email: akun.email, password: akun.password });
    setError('');
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <div className="mx-auto flex min-h-screen max-w-[1240px] items-center justify-center px-5 py-12">
        <div className="w-full max-w-[420px]">

          <Link to="/" className="mb-8 flex items-center justify-center gap-3 no-underline">
            <LionMark size={44} />
            <span className="flex flex-col leading-tight">
              <span className="font-head text-[1rem] font-extrabold tracking-tight text-maroon-800">SINGA RISET BULELENG</span>
              <span className="text-[.68rem] font-medium text-ink-3">Portal Riset &amp; Inovasi Daerah</span>
            </span>
          </Link>

          <div className="rounded-xl border border-line bg-white p-7">
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

          <div className="mt-4 rounded-xl border border-line bg-white p-4">
            <div className="mb-2.5 flex items-center gap-2 text-[.78rem] font-bold uppercase tracking-wide text-ink-3">
              <Icon name="info" size={15} /> Akun demo prototipe
            </div>
            <div className="flex flex-col gap-1.5">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.email} type="button" onClick={() => isiDemo(a)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-left transition hover:border-maroon-600 hover:bg-maroon-50">
                  <span className="min-w-0">
                    <span className="block truncate text-[.82rem] font-semibold text-ink">{a.email}</span>
                    <span className="block text-[.74rem] text-ink-3">{ROLES[a.role].nama} · sandi: {a.password}</span>
                  </span>
                  <span className="flex-none rounded-full bg-surface-2 px-2.5 py-1 text-[.7rem] font-bold text-ink-2">Isi</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-[.8rem] text-ink-3">
            <Link to="/" className="hover:text-maroon-800">← Kembali ke beranda portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
