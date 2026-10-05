import { api, invalidResponse } from './api.js';

/** Peran backend → peran dashboard di frontend (mitra | opd | admin). */
const ROLE_MAP = {
  admin: 'admin',
  'media-brida': 'admin',
  opd: 'opd',
  reviewer: 'admin',
  'pegawai-brida': 'opd',
  researcher: 'mitra'
};

export function mapRole(backendRole) {
  return ROLE_MAP[backendRole] || 'mitra';
}

export function mapUser(u) {
  if (!u || typeof u !== 'object' || !u.public_id) throw invalidResponse('user');
  return {
    publicId: u.public_id,
    nama: u.name || u.email || 'Pengguna',
    email: u.email || '',
    role: mapRole(u.role),
    backendRole: u.role,
    instansi: u.institution || '-',
    jabatan: u.position || '-',
    verified: !!u.verified,
    terdaftar: String(u.created_at || '').slice(0, 10)
  };
}

/** Membaca payload JWT (tanpa verifikasi tanda tangan — itu tugas backend). */
export function decodeToken(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), '='))
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeToken(token);
  return !payload || (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now());
}

export const authService = {
  async login(email, password) {
    const res = await api.post('/v1/auth/login', { email: email.trim(), password });
    const token = res.data?.Token;
    if (!token) throw invalidResponse('login token');
    return { token, user: mapUser(res.data.Data) };
  },

  async register(payload) {
    const res = await api.post('/v1/auth/register', payload);
    return res.data;
  },

  /** Verifikasi kode email → token baru → profil lengkap pengguna. */
  async verifyEmail(code) {
    const res = await api.post('/v1/auth/verify', { code: code.trim() });
    const token = res.data?.token;
    const claims = token && decodeToken(token);
    if (!claims?.pub_id) throw invalidResponse('verify token');
    const profile = await api.get(`/v1/users/${claims.pub_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { token, user: mapUser(profile.data) };
  }
};
