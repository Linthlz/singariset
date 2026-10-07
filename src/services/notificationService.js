import { api, invalidResponse } from './api.js';

function mapNotification(n) {
  if (!n?.public_id) throw invalidResponse('notification');
  return {
    id: n.public_id,
    judul: n.subject || 'Notifikasi',
    pesan: n.message || '',
    jenis: n.reference_type || '',
    refId: n.reference_public_id || '',
    waktu: n.created_at || ''
  };
}

export const notificationService = {
  async list({ limit = 10, signal } = {}) {
    const res = await api.get('/v1/notifications', { query: { limit }, signal });
    if (res.data === null) return { data: [], meta: res.meta };
    if (!Array.isArray(res.data)) throw invalidResponse('notifications');
    return { data: res.data.map(mapNotification), meta: res.meta };
  }
};
