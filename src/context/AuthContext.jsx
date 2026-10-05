import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { configureAuth } from '../services/api.js';
import { authService, isTokenExpired } from '../services/authService.js';

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

const SESSION_KEY = 'singa.auth.session';

function readSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!s?.token || !s?.user || isTokenExpired(s.token)) return null;
    return s;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* mode privat: sesi hanya bertahan di memori */ }
}

let currentToken = readSession()?.token ?? null;

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const applySession = useCallback((next) => {
    currentToken = next?.token ?? null;
    writeSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => applySession(null), [applySession]);

  configureAuth({ getToken: () => currentToken, onUnauthorized: logout });

  const login = useCallback(async ({ email, password }) => {
    const next = await authService.login(email, password);
    applySession(next);
    return next.user;
  }, [applySession]);

  const register = useCallback((payload) => authService.register(payload), []);

  const verifyEmail = useCallback(async (code) => {
    const next = await authService.verifyEmail(code);
    applySession(next);
    return next.user;
  }, [applySession]);

  const user = session?.user ?? null;

  const value = useMemo(() => ({
    user,
    isAuth: !!user,
    role: user ? ROLES[user.role] : null,
    hasRole: (...roles) => !!user && roles.includes(user.role),
    login, register, verifyEmail, logout
  }), [user, login, register, verifyEmail, logout]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
