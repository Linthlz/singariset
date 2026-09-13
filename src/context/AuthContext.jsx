import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* ==========================================================================
   Autentikasi — PROTOTIPE ANTARMUKA SAJA.
   Tidak ada backend: akun disimpan di localStorage peramban dan kata sandi
   tidak di-hash. Jangan pakai pola ini di produksi — ganti dengan API auth
   resmi BRIDA (sesi server / token) saat backend tersedia.
   ========================================================================== */

export const ROLES = {
  mitra: {
    id: 'mitra', nama: 'Mitra / Instansi', init: 'MI',
    ket: 'Perguruan tinggi, komunitas, subak, pokdarwis, dan UMKM pengusul riset.',
    beranda: '/dashboard/mitra'
  },
  opd: {
    id: 'opd', nama: 'OPD Perangkat Daerah', init: 'OP',
    ket: 'Dinas teknis Pemkab Buleleng dengan akses monitoring dan evaluasi riset.',
    beranda: '/dashboard/opd'
  },
  admin: {
    id: 'admin', nama: 'Administrator BRIDA', init: 'AD',
    ket: 'Pengelola portal, akun pengguna, dan seluruh konten situs.',
    beranda: '/dashboard/admin'
  }
};

/* Akun demo bawaan agar prototipe bisa langsung dicoba. */
export const DEMO_ACCOUNTS = [
  {
    email: 'admin@bulelengkab.go.id', password: 'admin123', role: 'admin',
    nama: 'Ni Wayan Sukerti, S.Kom., M.T.', instansi: 'BRIDA Kabupaten Buleleng',
    jabatan: 'Administrator Sistem', status: 'aktif', terdaftar: '2025-01-06'
  },
  {
    email: 'opd@bulelengkab.go.id', password: 'opd123', role: 'opd',
    nama: 'I Gede Wirawan, S.T., M.T.', instansi: 'Dinas Pertanian Kabupaten Buleleng',
    jabatan: 'Kepala Bidang Program dan Pelaporan', status: 'aktif', terdaftar: '2025-01-14'
  },
  {
    email: 'mitra@undiksha.ac.id', password: 'mitra123', role: 'mitra',
    nama: 'Prof. Dr. I Gede Suarnaya, M.T.', instansi: 'Universitas Pendidikan Ganesha',
    jabatan: 'Ketua Peneliti', status: 'aktif', terdaftar: '2025-02-03'
  }
];

const SESSION_KEY = 'singa.auth.session';
const USERS_KEY = 'singa.auth.users';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* mode privat */ }
}

/** Akun hasil pendaftaran mandiri (di luar akun demo). */
export function getRegisteredUsers() { return readJson(USERS_KEY, []); }

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null));

  const login = useCallback(({ email, password }) => {
    const mail = String(email || '').trim().toLowerCase();
    const semua = [...DEMO_ACCOUNTS, ...getRegisteredUsers()];
    const akun = semua.find((a) => a.email.toLowerCase() === mail);

    if (!akun) return { ok: false, error: 'Akun dengan surel tersebut belum terdaftar.' };
    if (akun.password !== password) return { ok: false, error: 'Kata sandi yang Anda masukkan salah.' };
    if (akun.status === 'nonaktif') return { ok: false, error: 'Akun ini dinonaktifkan. Hubungi administrator BRIDA.' };

    const sesi = {
      email: akun.email, nama: akun.nama, role: akun.role,
      instansi: akun.instansi, jabatan: akun.jabatan
    };
    setUser(sesi);
    writeJson(SESSION_KEY, sesi);
    return { ok: true, user: sesi };
  }, []);

  const register = useCallback((data) => {
    const mail = String(data.email || '').trim().toLowerCase();
    const semua = [...DEMO_ACCOUNTS, ...getRegisteredUsers()];
    if (semua.some((a) => a.email.toLowerCase() === mail)) {
      return { ok: false, error: 'Surel tersebut sudah terdaftar. Silakan masuk atau gunakan surel lain.' };
    }

    const akun = {
      email: mail, password: data.password, role: data.role,
      nama: data.nama, instansi: data.instansi, jabatan: data.jabatan || '-',
      jenis: data.jenis || '', telepon: data.telepon || '',
      status: 'aktif', terdaftar: new Date().toISOString().slice(0, 10)
    };
    writeJson(USERS_KEY, [...getRegisteredUsers(), akun]);

    const sesi = { email: akun.email, nama: akun.nama, role: akun.role, instansi: akun.instansi, jabatan: akun.jabatan };
    setUser(sesi);
    writeJson(SESSION_KEY, sesi);
    return { ok: true, user: sesi };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* mode privat */ }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuth: !!user,
    role: user ? ROLES[user.role] : null,
    hasRole: (...roles) => !!user && roles.includes(user.role),
    login, register, logout
  }), [user, login, register, logout]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
