import { api, invalidResponse } from './api.js';
import { mapUser } from './authService.js';

export const userService = {
  /** Khusus administrator. */
  async list({ page = 1, limit = 20, q = '', signal } = {}) {
    const res = await api.get('/v1/admin/user', { query: { page, limit, filter: q }, signal });
    if (res.data === null) return { data: [], meta: res.meta };
    if (!Array.isArray(res.data)) throw invalidResponse('user list');
    return { data: res.data.map(mapUser), meta: res.meta };
  }
};
