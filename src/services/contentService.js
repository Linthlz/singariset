import { api, invalidResponse } from './api.js';
import { mapDocumentation } from './researchService.js';

export function mapFunding(f) {
  if (!f || !f.public_id) throw invalidResponse('funding');
  return {
    id: f.public_id,
    nama: f.name,
    penyelenggara: f.organizer,
    skema: f.scheme_code,
    plafon: f.ceiling || 0,
    kuota: f.quota || 0,
    deadline: String(f.deadline || '').slice(0, 10),
    status: f.status,
    bidangTarget: String(f.target_fields || '').split(',').map((s) => s.trim()).filter(Boolean),
    syarat: String(f.requirements || '').split('\n').map((s) => s.trim()).filter(Boolean),
    ket: f.description || '',
    situs: f.website || '',
    situsNama: f.website_name || ''
  };
}

/** Bentuk form UI → payload backend. */
function fundingPayload(form) {
  return {
    name: form.nama.trim(),
    organizer: form.penyelenggara.trim(),
    scheme_code: form.skema,
    ceiling: Number(String(form.plafon).replace(/\D/g, '')) || 0,
    quota: Number(String(form.kuota).replace(/\D/g, '')) || 0,
    deadline: form.deadline,
    status: form.status,
    target_fields: (form.bidangTarget || []).join(','),
    requirements: (form.syaratText ?? (form.syarat || []).join('\n')).trim(),
    description: (form.ket || '').trim(),
    website: (form.situs || '').trim(),
    website_name: (form.situsNama || '').trim()
  };
}

export function validateFunding(form) {
  const e = {};
  if (!form.nama.trim()) e.nama = 'Nama skema wajib diisi.';
  if (!form.penyelenggara.trim()) e.penyelenggara = 'Penyelenggara wajib diisi.';
  if (!form.skema) e.skema = 'Pilih kode skema.';
  if (!form.deadline) e.deadline = 'Tenggat wajib diisi.';
  if (!['open', 'closing', 'soon'].includes(form.status)) e.status = 'Pilih status.';
  if (form.situs && !/^https?:\/\/\S+\.\S+/.test(form.situs.trim())) e.situs = 'Alamat situs harus diawali http:// atau https://';
  return e;
}

const asList = (res, mapper) => {
  if (res.data === null) return { data: [], meta: res.meta };
  if (!Array.isArray(res.data)) throw invalidResponse('list');
  return { data: res.data.map(mapper), meta: res.meta };
};

export const contentService = {
  async listFunding({ status = '', scheme = '', limit = 100, signal } = {}) {
    return asList(await api.get('/v2/funding', { query: { status, scheme, limit }, signal }), mapFunding);
  },
  async createFunding(form) {
    return mapFunding((await api.post('/v1/funding', fundingPayload(form))).data);
  },
  async updateFunding(id, form) {
    return mapFunding((await api.patch(`/v1/funding/${encodeURIComponent(id)}`, fundingPayload(form))).data);
  },
  async deleteFunding(id) {
    await api.delete(`/v1/funding/${encodeURIComponent(id)}`);
  },

  async getStats({ signal } = {}) {
    const res = await api.get('/v2/stats', { signal });
    if (!res.data || typeof res.data !== 'object') throw invalidResponse('stats');
    return { data: res.data, meta: null };
  },

  async getSettings({ signal } = {}) {
    const res = await api.get('/v2/settings', { signal });
    if (!res.data || typeof res.data !== 'object') throw invalidResponse('settings');
    return { data: res.data, meta: null };
  },
  async saveSettings(values) {
    return (await api.put('/v1/admin/settings', values)).data;
  },

  /** Dokumentasi grup riset: groupId = public_id grup. */
  async createDocumentation(groupId, form) {
    const fd = new FormData();
    fd.append('title', form.judul.trim());
    fd.append('narrative', form.narasi.trim());
    fd.append('location', form.lokasi.trim());
    if (form.tanggal) fd.append('event_date', form.tanggal);
    if (form.video?.trim()) fd.append('video_url', form.video.trim());
    form.foto.forEach((f) => { fd.append('images', f.file); fd.append('captions', f.ket || ''); });
    const res = await api.post(`/v1/research/group/${encodeURIComponent(groupId)}/documentations`, fd, { timeout: 60000 });
    return res.data;
  },
  async updateDocumentation(groupId, docId, form) {
    await api.patch(`/v1/research/group/${encodeURIComponent(groupId)}/documentations/${encodeURIComponent(docId)}`, {
      title: form.judul.trim(), narrative: form.narasi.trim(), location: form.lokasi.trim(),
      video_url: form.video?.trim() || '', event_date: form.tanggal || ''
    });
  },
  async deleteDocumentation(groupId, docId) {
    await api.delete(`/v1/research/group/${encodeURIComponent(groupId)}/documentations/${encodeURIComponent(docId)}`);
  },
  mapDocumentation
};
