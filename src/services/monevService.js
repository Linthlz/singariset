import { api, assetUrl, invalidResponse } from './api.js';

/* Monev: Batch (per tahun) → Entry (per OPD) → Kajian → Poin rekomendasi.
   Pengelola (admin, pegawai-brida) mengatur batch, OPD, kajian, dan poin;
   OPD mengisi wakil, hasil monitoring tiap poin, bukti, lalu mengirim laporan. */

export const PENGELOLA_MONEV = ['admin', 'pegawai-brida'];

export function canManageMonev(user) {
  return !!user && PENGELOLA_MONEV.includes(user.backendRole);
}

export const BATCH_STATUS = {
  draft: { label: 'Draf', badge: 'bg-surface-2 text-ink-2' },
  open: { label: 'Dibuka', badge: 'bg-success-bg text-success' },
  closed: { label: 'Ditutup', badge: 'bg-danger-bg text-danger' }
};

export const ENTRY_STATUS = {
  pending: { label: 'Belum dikirim', badge: 'bg-warning-bg text-warning' },
  submitted: { label: 'Menunggu verifikasi', badge: 'bg-info-bg text-info' },
  verified: { label: 'Terverifikasi', badge: 'bg-success-bg text-success' }
};

const byOrder = (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || String(a.created_at).localeCompare(String(b.created_at));

function fileName(path) {
  return path ? decodeURIComponent(String(path).split('/').pop()) : '';
}

export function mapPoint(p) {
  if (!p?.public_id) throw invalidResponse('monev point');
  const path = p.monitoring_file_path || '';
  return {
    id: p.public_id,
    judul: p.title || '',
    monitoring: p.has_monitoring_result ? 'Sudah' : 'Belum',
    terisi: !!(p.monitoring_result_description || '').trim(),
    uraian: p.monitoring_result_description || '',
    kendala: p.kendala_pelaksanaan_rekomendasi || '',
    manfaat: p.benefits || '',
    filePath: path,
    fileUrl: assetUrl(path),
    fileName: fileName(path)
  };
}

export function mapKajian(k) {
  if (!k?.public_id) throw invalidResponse('monev kajian');
  return {
    id: k.public_id,
    judul: k.title || '',
    deskripsi: k.description || '',
    urutan: k.display_order || 0,
    rekomendasi: [...(k.points || [])].sort(byOrder).map(mapPoint)
  };
}

export function mapBatch(b) {
  if (!b?.public_id) throw invalidResponse('monev batch');
  return {
    id: b.public_id,
    tahun: b.year,
    judul: b.title || '',
    deskripsi: b.description || '',
    status: b.status || 'draft',
    entries: (b.entries || []).map((e) => mapEntry(e, b))
  };
}

export function mapEntry(e, batch = e.batch) {
  if (!e?.public_id) throw invalidResponse('monev entry');
  return {
    id: e.public_id,
    opd: { id: e.opd?.public_id || '', nama: e.opd?.name || '-' },
    nama: e.representative_name || '',
    nip: e.representative_nip || '',
    status: e.status || 'pending',
    submittedAt: e.submitted_at || '',
    verifiedAt: e.verified_at || '',
    createdAt: e.created_at || '',
    batch: batch ? { id: batch.public_id, tahun: batch.year, judul: batch.title, status: batch.status } : null,
    kajian: [...(e.kajians || [])].sort(byOrder).map(mapKajian)
  };
}

/** Satu baris laporan per kajian, dipakai tabel/riwayat Monev. */
export function entriesToRecords(entries) {
  return entries.flatMap((entry) => entry.kajian.map((kajian) => ({
    id: kajian.id,
    entryId: entry.id,
    opd: entry.opd.nama,
    opdId: entry.opd.id,
    nama: entry.nama,
    nip: entry.nip,
    status: entry.status,
    batch: entry.batch,
    judul: kajian.judul,
    deskripsi: kajian.deskripsi,
    tanggal: entry.submittedAt || entry.createdAt,
    rekomendasi: kajian.rekomendasi
  })));
}

/** Body lengkap PATCH poin (backend menimpa seluruh field monitoring). */
function pointBody(point, patch = {}) {
  const next = { ...point, ...patch };
  return {
    title: next.judul,
    monitoring_file_path: next.filePath || null,
    has_monitoring_result: next.monitoring === 'Sudah',
    monitoring_result_description: next.uraian || '',
    kendala_pelaksanaan_rekomendasi: next.kendala || '',
    benefits: next.manfaat || ''
  };
}

const list = (res, mapper) => {
  if (res.data === null) return [];
  if (!Array.isArray(res.data)) throw invalidResponse('monev list');
  return res.data.map(mapper);
};

const id = (v) => encodeURIComponent(v);

export const monevService = {
  // ---------- Batch ----------
  async batches({ signal } = {}) {
    const res = await api.get('/v1/monev/batches', { query: { limit: 100 }, signal });
    return { data: list(res, mapBatch), meta: res.meta };
  },
  async batch(batchId, { signal } = {}) {
    return { data: mapBatch((await api.get(`/v1/monev/batches/${id(batchId)}`, { signal })).data), meta: null };
  },
  async createBatch({ tahun, judul, deskripsi = '', status = 'open' }) {
    return mapBatch((await api.post('/v1/monev/batches', { year: Number(tahun), title: judul.trim(), description: deskripsi, status })).data);
  },
  async updateBatch(batch, patch) {
    const next = { ...batch, ...patch };
    await api.patch(`/v1/monev/batches/${id(batch.id)}`, { year: Number(next.tahun), title: next.judul, description: next.deskripsi, status: next.status });
  },

  // ---------- OPD ----------
  async opds({ signal } = {}) {
    const res = await api.get('/v1/opds', { signal });
    return { data: list(res, (o) => ({ id: o.public_id, nama: o.name })), meta: null };
  },
  async createOpd(nama) {
    const o = (await api.post('/v1/opds', { name: nama.trim() })).data;
    return { id: o.public_id, nama: o.name };
  },
  async addOpdToBatch(batchId, opdId) {
    return (await api.post(`/v1/monev/batches/${id(batchId)}/opds`, { opd_public_id: opdId })).data?.public_id;
  },
  async removeEntry(entryId) {
    await api.delete(`/v1/monev/entries/${id(entryId)}`);
  },
  async verifyEntry(entryId) {
    await api.post(`/v1/monev/entries/${id(entryId)}/verify`);
  },

  // ---------- Kajian & poin ----------
  async addKajian(entryId, judul, deskripsi = '') {
    return (await api.post(`/v1/monev/entries/${id(entryId)}/kajians`, { title: judul.trim(), description: deskripsi })).data?.public_id;
  },
  async deleteKajian(kajianId) {
    await api.delete(`/v1/monev/kajians/${id(kajianId)}`);
  },
  async addPoint(kajianId, judul) {
    return (await api.post(`/v1/monev/kajians/${id(kajianId)}/points`, { title: judul.trim() })).data?.public_id;
  },
  async updatePoint(point, patch) {
    await api.patch(`/v1/monev/points/${id(point.id)}`, pointBody(point, patch));
  },
  async uploadPointFile(pointId, file) {
    const fd = new FormData();
    fd.append('file', file);
    return (await api.post(`/v1/monev/points/${id(pointId)}/file`, fd, { timeout: 60000 })).data?.monitoring_file_path || '';
  },
  async deletePoint(pointId) {
    await api.delete(`/v1/monev/points/${id(pointId)}`);
  },

  // ---------- OPD: laporan sendiri ----------
  async myEntries({ signal } = {}) {
    const res = await api.get('/v1/monev/my-entries', { signal });
    return { data: list(res, (e) => mapEntry(e)), meta: null };
  },
  async fillRepresentative(entryId, nama, nip) {
    await api.patch(`/v1/monev/entries/${id(entryId)}/representative`, { name: nama.trim(), nip: nip.trim() });
  },
  async submitEntry(entryId) {
    await api.post(`/v1/monev/entries/${id(entryId)}/submit`);
  },

  /** Simpan jawaban poin (dan unggah bukti baru bila ada). files: { [pointId]: File }. */
  async savePoints(points, files = {}) {
    for (const point of points) {
      let filePath = point.filePath || '';
      if (files[point.id]) filePath = await monevService.uploadPointFile(point.id, files[point.id]);
      await monevService.updatePoint(point, { filePath });
    }
  }
};
