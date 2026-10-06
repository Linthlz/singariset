import { api, invalidResponse } from './api.js';
import { mapUser } from './authService.js';

/** Peran backend yang dapat diberikan administrator. */
export const BACKEND_ROLES = [
  { value: 'researcher', label: 'Peneliti / Mitra' },
  { value: 'opd', label: 'OPD Perangkat Daerah' },
  { value: 'pegawai-brida', label: 'Pegawai BRIDA' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'media-brida', label: 'Pengelola Media' },
  { value: 'admin', label: 'Administrator' }
];

export const roleLabel = (value) => BACKEND_ROLES.find((r) => r.value === value)?.label || value;

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Validasi form pengguna di sisi klien; backend memvalidasi ulang. */
export function validateUserForm(form, { isCreate }) {
  const e = {};
  if (form.nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter.';
  if (isCreate && !EMAIL.test(form.email.trim())) e.email = 'Masukkan surel yang valid.';
  if (!form.role) e.role = 'Pilih peran.';
  if (isCreate && (form.password.length < 8 || form.password.length > 72)) e.password = 'Kata sandi 8–72 karakter.';
  if (!isCreate && form.password && (form.password.length < 8 || form.password.length > 72)) e.password = 'Kata sandi baru 8–72 karakter.';
  return e;
}

export const userService = {
  /** Khusus administrator. */
  async list({ page = 1, limit = 20, q = '', role = '', signal } = {}) {
    const res = await api.get('/v1/admin/user', { query: { page, limit, filter: q, role }, signal });
    if (res.data === null) return { data: [], meta: res.meta };
    if (!Array.isArray(res.data)) throw invalidResponse('user list');
    return { data: res.data.map(mapUser), meta: res.meta };
  },

  async create(form) {
    const res = await api.post('/v1/admin/user', {
      name: form.nama.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      institution: form.instansi.trim(),
      position: form.jabatan.trim()
    });
    return mapUser(res.data);
  },

  async update(publicId, form) {
    const body = {
      name: form.nama.trim(),
      institution: form.instansi.trim(),
      position: form.jabatan.trim(),
      role: form.role,
      verified: form.verified
    };
    if (form.password) body.password = form.password;
    const res = await api.patch(`/v1/admin/user/${encodeURIComponent(publicId)}`, body);
    return mapUser(res.data);
  },

  async remove(publicId) {
    await api.delete(`/v1/admin/user/${encodeURIComponent(publicId)}`);
  }
};
