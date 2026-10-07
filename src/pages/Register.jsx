import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LionMark from '../components/LionMark.jsx';
import Icon from '../components/Icon.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import { ROLES, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errorMessage } from '../services/api.js';

const AKTOR = [
  {
    id: 'mitra', ikon: 'handshake', nama: 'Mitra / Instansi',
    ket: 'Perguruan tinggi, lembaga litbang, komunitas subak, pokdarwis, koperasi, dan UMKM yang mengusulkan atau menerima manfaat riset.',
    fitur: ['Mengajukan kolaborasi riset', 'Melacak status usulan', 'Mengunggah dokumen pendukung']
  },
  {
    id: 'opd', ikon: 'landmark', nama: 'OPD Perangkat Daerah',
    ket: 'Dinas teknis dan badan di lingkungan Pemerintah Kabupaten Buleleng yang memantau pelaksanaan riset daerah.',
    fitur: ['Dashboard monitoring & evaluasi', 'Menilai capaian termin riset', 'Meninjau berkas bukti luaran']
  }
];

const JENIS_MITRA = [
  'Perguruan Tinggi', 'Lembaga Litbang', 'Komunitas Subak', 'Kelompok Sadar Wisata (Pokdarwis)',
  'Koperasi / BUMDes', 'UMKM & Industri Lokal', 'Desa Adat / Desa Dinas', 'Satuan Pendidikan', 'Lainnya'
];

const DAFTAR_OPD = [
  'Badan Perencanaan Pembangunan Daerah (Bappeda)', 'Dinas Pertanian', 'Dinas Pariwisata',
  'Dinas Kelautan dan Perikanan', 'Dinas Lingkungan Hidup', 'Dinas Pendidikan, Kepemudaan dan Olahraga',
  'Dinas Komunikasi, Informatika, Persandian dan Statistik', 'Dinas Perindustrian dan Perdagangan',
  'Dinas Koperasi, UKM dan Penanaman Modal', 'Dinas Pekerjaan Umum dan Tata Ruang',
  'Badan Penanggulangan Bencana Daerah (BPBD)', 'Perangkat Daerah lainnya'
];

const initial = {
  role: 'mitra', nama: '', instansi: '', jenis: '', jabatan: '', nip: '',
  email: '', telepon: '', password: '', konfirmasi: '', setuju: false
};

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [emailTerdaftar, setEmailTerdaftar] = useState('');

  const isOpd = form.role === 'opd';
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e = {};
    if (form.nama.trim().length < 3) e.nama = 'Nama penanggung jawab wajib diisi.';
    if (!form.instansi) e.instansi = isOpd ? 'Pilih perangkat daerah Anda.' : 'Nama instansi wajib diisi.';
    if (!isOpd && !form.jenis) e.jenis = 'Pilih jenis instansi.';
    if (isOpd && !/^\d{18}$/.test(form.nip.replace(/\D/g, ''))) e.nip = 'NIP harus 18 digit angka.';
    if (isOpd && !form.jabatan.trim()) e.jabatan = 'Jabatan wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim())) e.email = 'Masukkan alamat surel yang valid.';
    if (form.telepon.replace(/\D/g, '').length < 10) e.telepon = 'Nomor telepon aktif minimal 10 digit.';
    if (form.password.length < 8) e.password = 'Kata sandi minimal 8 karakter.';
    else if (form.password.length > 72) e.password = 'Kata sandi maksimal 72 karakter.';
    if (form.konfirmasi !== form.password) e.konfirmasi = 'Konfirmasi kata sandi tidak cocok.';
    if (!form.setuju) e.setuju = 'Anda harus menyetujui ketentuan penggunaan portal.';
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast('danger', 'Pendaftaran belum lengkap', `${Object.keys(e).length} isian masih perlu diperbaiki.`);
      return;
    }

    setBusy(true);
    try {
      await register({
        name: form.nama.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone_number: form.telepon.trim(),
        institution: form.instansi,
        position: isOpd ? form.jabatan.trim() : 'Penanggung Jawab Mitra'
      });
      setEmailTerdaftar(form.email.trim().toLowerCase());
      toast('success', 'Akun berhasil dibuat', 'Kode verifikasi telah dikirim ke surel Anda.');
    } catch (err) {
      if (err?.status === 409) {
        setErrors({ email: 'Surel tersebut sudah terdaftar. Silakan masuk atau gunakan surel lain.' });
      } else if (err?.status === 400) {
        setErrors({ form: errorMessage(err) });
      } else {
        setErrors({ form: err?.status >= 500 ? 'Pendaftaran gagal: server tidak dapat mengirim kode verifikasi. Coba lagi nanti.' : errorMessage(err) });
      }
      toast('danger', 'Pendaftaran gagal', errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (emailTerdaftar) return <VerifikasiEmail email={emailTerdaftar} />;

  return (
    <div className="min-h-screen bg-surface-1">
      <div className="mx-auto max-w-[1240px] px-5 py-12">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3 no-underline">
          <LionMark size={44} />
          <span className="flex flex-col leading-tight">
            <span className="font-head text-[1rem] font-extrabold tracking-tight text-maroon-800">SINGA RISET BULELENG</span>
            <span className="text-[.68rem] font-medium text-ink-3">Portal Riset &amp; Inovasi Daerah</span>
          </span>
        </Link>

        <div className="mx-auto max-w-[820px]">
          <div className="mb-6 text-center">
            <h1 className="mb-1.5 text-[1.6rem]">Daftar akun portal</h1>
            <p className="mx-auto max-w-[560px] text-[.9rem] text-ink-2">
              Pilih jenis akun sesuai peran lembaga Anda dalam ekosistem riset Kabupaten Buleleng.
              Akun administrator dibuat secara internal oleh BRIDA dan tidak tersedia melalui pendaftaran mandiri.
            </p>
          </div>

          {/* Pemilihan aktor */}
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            {AKTOR.map((a) => {
              const aktif = form.role === a.id;
              return (
                <button
                  key={a.id} type="button" onClick={() => set('role', a.id)} aria-pressed={aktif}
                  className={`rounded-xl border-2 p-5 text-left transition ${aktif ? 'border-maroon-800 bg-maroon-50' : 'border-line bg-white hover:border-line-strong'}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className={`grid h-10 w-10 flex-none place-items-center rounded-lg ${aktif ? 'bg-maroon-800 text-gold-500' : 'bg-surface-2 text-maroon-800'}`}>
                      <Icon name={a.ikon} size={20} />
                    </span>
                    <span className="flex-1 font-head text-[1rem] font-extrabold text-ink">{a.nama}</span>
                    <span className={`grid h-5 w-5 flex-none place-items-center rounded-full border-2 ${aktif ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong'}`}>
                      {aktif && <Icon name="check" size={11} />}
                    </span>
                  </div>
                  <p className="mb-3 text-[.83rem] text-ink-2">{a.ket}</p>
                  <ul className="m-0 list-none space-y-1 p-0 text-[.79rem]">
                    {a.fitur.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-ink-2"><Icon name="check" size={13} className="mt-0.5 flex-none text-success" />{f}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* Formulir */}
          <form onSubmit={submit} noValidate className="rounded-xl border border-line bg-white p-7">
            <h2 className="mb-1 text-[1.1rem]">Data {isOpd ? 'perangkat daerah' : 'instansi mitra'}</h2>
            <p className="mb-5 text-[.84rem] text-ink-3">Tanda <span className="text-maroon-600">*</span> menandakan isian wajib.</p>

            <div className="grid gap-x-5 sm:grid-cols-2">
              <F label={isOpd ? 'Nama perangkat daerah' : 'Nama instansi / lembaga'} required error={errors.instansi} full={isOpd}>
                {isOpd ? (
                  <select className="input-base" value={form.instansi} onChange={(e) => set('instansi', e.target.value)}>
                    <option value="">Pilih perangkat daerah</option>
                    {DAFTAR_OPD.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className="input-base" value={form.instansi} onChange={(e) => set('instansi', e.target.value)}
                    placeholder="Contoh: Universitas Pendidikan Ganesha" />
                )}
              </F>

              {!isOpd && (
                <F label="Jenis instansi" required error={errors.jenis}>
                  <select className="input-base" value={form.jenis} onChange={(e) => set('jenis', e.target.value)}>
                    <option value="">Pilih jenis instansi</option>
                    {JENIS_MITRA.map((j) => <option key={j}>{j}</option>)}
                  </select>
                </F>
              )}

              <F label="Nama penanggung jawab" required error={errors.nama}>
                <input className="input-base" value={form.nama} onChange={(e) => set('nama', e.target.value)}
                  placeholder="Lengkap dengan gelar" />
              </F>

              {isOpd && (
                <>
                  <F label="NIP penanggung jawab" required error={errors.nip}>
                    <input className="input-base" inputMode="numeric" value={form.nip} onChange={(e) => set('nip', e.target.value)}
                      placeholder="18 digit NIP" />
                  </F>
                  <F label="Jabatan" required error={errors.jabatan}>
                    <input className="input-base" value={form.jabatan} onChange={(e) => set('jabatan', e.target.value)}
                      placeholder="Contoh: Kepala Bidang Program" />
                  </F>
                </>
              )}

              <F label="Surel" required error={errors.email}
                hint="Gunakan surel resmi instansi bila tersedia; surel pribadi juga dapat dipakai.">
                <input className="input-base" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                  placeholder="nama@contoh.com" />
              </F>

              <F label="Nomor telepon / WhatsApp" required error={errors.telepon}>
                <input className="input-base" type="tel" value={form.telepon} onChange={(e) => set('telepon', e.target.value)}
                  placeholder="08xx-xxxx-xxxx" />
              </F>

              <F label="Kata sandi" required error={errors.password} hint="Minimal 8 karakter.">
                <PasswordInput autoComplete="new-password"
                  value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Buat kata sandi" />
              </F>

              <F label="Konfirmasi kata sandi" required error={errors.konfirmasi}>
                <PasswordInput autoComplete="new-password"
                  value={form.konfirmasi} onChange={(e) => set('konfirmasi', e.target.value)} placeholder="Ulangi kata sandi" />
              </F>
            </div>

            <label className={`mt-1 flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[.85rem] transition ${form.setuju ? 'border-maroon-800 bg-maroon-50' : 'border-line hover:bg-surface-1'}`}>
              <input type="checkbox" className="mt-0.5 h-4 w-4 flex-none accent-maroon-800"
                checked={form.setuju} onChange={(e) => set('setuju', e.target.checked)} />
              <span>
                <span className="block font-semibold text-ink">Persetujuan ketentuan portal</span>
                <span className="block text-[.78rem] text-ink-3">
                  Data yang saya isikan benar dan dapat dipertanggungjawabkan. Saya menyetujui ketentuan penggunaan
                  serta kebijakan tata kelola data SINGA RISET BULELENG.
                </span>
              </span>
            </label>
            {errors.setuju && <p className="mt-1.5 text-[.78rem] font-semibold text-danger">{errors.setuju}</p>}
            {isOpd && (
              <p className="mt-3 flex items-start gap-2 text-[.8rem] text-ink-3">
                <Icon name="info" size={14} className="mt-0.5 flex-none" />
                Hak akses OPD diaktifkan oleh administrator BRIDA setelah akun Anda terverifikasi.
              </p>
            )}
            {errors.form && (
              <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg border border-danger-bg bg-danger-bg px-3.5 py-3 text-[.84rem] text-[#7F1D1D]">
                <Icon name="alert" size={17} className="mt-0.5 flex-none text-danger" />
                <span>{errors.form}</span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={busy}
                className="rounded-lg bg-maroon-800 px-6 py-3 text-[.92rem] font-semibold text-white transition hover:bg-maroon-600 disabled:opacity-50">
                {busy ? 'Membuat akun…' : 'Buat Akun'}
              </button>
              <span className="text-[.855rem] text-ink-2">
                Sudah punya akun? <Link to="/login" className="font-semibold text-maroon-800 hover:underline">Masuk di sini</Link>
              </span>
            </div>
          </form>

          <p className="mt-5 text-center text-[.8rem] text-ink-3">
            <Link to="/" className="hover:text-maroon-800">← Kembali ke beranda portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function VerifikasiEmail({ email }) {
  const { verifyEmail } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [kode, setKode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!/^[0-9a-f]{6}$/i.test(kode.trim())) {
      setError('Kode verifikasi terdiri dari 6 karakter (angka 0–9 dan huruf a–f).');
      return;
    }
    setBusy(true);
    try {
      const user = await verifyEmail(kode.trim().toLowerCase());
      toast('success', 'Surel terverifikasi', `Selamat datang, ${user.nama}.`);
      navigate(ROLES[user.role].beranda, { replace: true });
    } catch (err) {
      setError(err?.status === 400 ? 'Kode tidak valid atau sudah kedaluwarsa.' : errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-surface-1 px-5 py-12">
      <form onSubmit={submit} noValidate className="w-full max-w-[420px] rounded-xl border border-line bg-white p-7">
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-maroon-50 text-maroon-800">
          <Icon name="mail" size={22} />
        </span>
        <h1 className="mb-1 text-[1.3rem]">Verifikasi surel Anda</h1>
        <p className="mb-5 text-[.875rem] text-ink-2">
          Masukkan kode 6 karakter yang kami kirim ke <b>{email}</b>.
        </p>
        {error && (
          <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-lg border border-danger-bg bg-danger-bg px-3.5 py-3 text-[.84rem] text-[#7F1D1D]">
            <Icon name="alert" size={17} className="mt-0.5 flex-none text-danger" />
            <span>{error}</span>
          </div>
        )}
        <label htmlFor="kode" className="mb-1.5 block text-[.84rem] font-semibold text-ink">Kode verifikasi</label>
        <input id="kode" className="input-base mb-4 font-mono tracking-[.3em]" autoComplete="one-time-code" maxLength={6}
          value={kode} onChange={(e) => setKode(e.target.value)} placeholder="a1b2c3" />
        <button type="submit" disabled={busy}
          className="w-full rounded-lg bg-maroon-800 px-5 py-3 text-[.92rem] font-semibold text-white transition hover:bg-maroon-600 disabled:opacity-50">
          {busy ? 'Memverifikasi…' : 'Verifikasi'}
        </button>
        <p className="mt-5 text-center text-[.83rem] text-ink-3">
          Sudah verifikasi sebelumnya? <Link to="/login" className="font-semibold text-maroon-800 hover:underline">Masuk</Link>
        </p>
      </form>
    </div>
  );
}

function F({ label, required, error, hint, children, full }) {
  return (
    <div className={`mb-4 ${full ? 'sm:col-span-2' : ''}`}>
      <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">
        {label} {required && <span className="text-maroon-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[.78rem] text-ink-3">{hint}</p>}
      {error && <p className="mt-1.5 text-[.78rem] font-semibold text-danger">{error}</p>}
    </div>
  );
}
