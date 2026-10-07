import { api, assetUrl, invalidResponse } from './api.js';
import { BIDANG, KECAMATAN } from '../data/singaData.js';

export const RESEARCH_STATUS = {
  pending: { label: 'Menunggu verifikasi', badge: 'bg-warning-bg text-warning', ikon: 'clock' },
  'under-review': { label: 'Sedang ditinjau', badge: 'bg-info-bg text-info', ikon: 'eye' },
  revision: { label: 'Perlu revisi', badge: 'bg-warning-bg text-warning', ikon: 'refresh' },
  rejected: { label: 'Ditolak', badge: 'bg-danger-bg text-danger', ikon: 'alert' },
  'on-going': { label: 'Berjalan', badge: 'bg-success-bg text-success', ikon: 'checkCircle' },
  approved: { label: 'Disetujui', badge: 'bg-success-bg text-success', ikon: 'checkCircle' }
};

export function statusResearch(s) {
  return RESEARCH_STATUS[s] || { label: s || '-', badge: 'bg-surface-2 text-ink-2', ikon: 'info' };
}

export const DECISION_LABEL = { revision: 'Minta revisi', rejected: 'Ditolak', approved: 'Disetujui' };

function fileUrl(path) {
  if (!path) return '';
  return assetUrl(path.replace(/^\.?\/?public/, ''));
}

const splitList = (s) => String(s || '').split(/\n|;\s*|,\s+(?=[A-Z])/).map((x) => x.trim()).filter(Boolean);

/** Nama bidang/kecamatan dari backend → id referensi di frontend (untuk warna & filter). */
export const bidangIdByNama = (nama) => BIDANG.find((b) => b.nama === nama)?.id || '';
export const kecIdByNama = (nama) => KECAMATAN.find((k) => k.nama === nama)?.id || '';

export function mapResearch(r) {
  if (!r || typeof r !== 'object' || !r.public_id) throw invalidResponse('research');
  return {
    id: r.public_id,
    kode: r.research_code || '-',
    slug: r.slug,
    judul: r.title || '',
    bidang: r.category || '',
    bidangId: bidangIdByNama(r.category),
    lokasi: r.location || '',
    kecamatan: kecIdByNama(r.location),
    alamat: r.address || '',
    skema: r.funding_scheme || '',
    dana: r.fund_amount || '',
    rpjmd: r.rpjmd || '',
    tujuan: r.purpose || r.Purpose || '',
    abstrak: r.abstract || '',
    signifikansi: r.research_significance || '',
    luaran: r.promised_output || '',
    luaranList: splitList(r.promised_output),
    periode: r.research_time_range || '',
    targetMitra: r.partnership_target_selection || '',
    mitra: r.partner_name || '',
    mitraList: [...splitList(r.partner_name), ...splitList(r.partnership_target_selection)],
    penerimaManfaat: r.estimated_number_of_direct_beneficiaries || '',
    berkas: fileUrl(r.research_proposal_file),
    status: r.status || 'pending',
    pengusul: r.uploader?.name || r.uploader_name || '',
    institusi: r.uploader?.institution || '',
    pengusulId: r.uploader?.public_id || r.uploader_public_id || '',
    reviewer: r.reviewer?.name || '',
    reviewerId: r.reviewer?.public_id || '',
    grupId: r.group_public_id || '',
    tanggal: String(r.created_at || '').slice(0, 10),
    tahun: String(r.created_at || '').slice(0, 4)
  };
}

function mapComment(c) {
  return {
    id: c.public_id,
    penulis: c.author_name || 'Reviewer',
    jabatan: c.author_position || '',
    pesan: c.message || '',
    keputusan: c.decision || '',
    putaran: c.round || 0,
    tanggal: String(c.created_at || '').slice(0, 10)
  };
}

function mapGroup(g) {
  if (!g) return null;
  return {
    id: g.public_id,
    nama: g.name,
    kodeGabung: g.join_code || '',
    anggota: (g.members || []).map((m) => ({ nama: m.name, institusi: m.institution, peran: m.role }))
  };
}

export function mapDocumentation(d) {
  if (!d || !d.public_id) throw invalidResponse('documentation');
  return {
    id: d.public_id,
    judul: d.title,
    narasi: d.narrative || '',
    lokasi: d.location || '',
    tanggal: String(d.event_date || d.created_at || '').slice(0, 10),
    video: d.video_url || null,
    penulis: d.author?.name || '',
    foto: (d.images || []).map((i) => ({ src: assetUrl(i.file_path), ket: i.caption || '' })),
    grupId: d.group_public_id || '',
    risetSlug: d.research_slug || '',
    risetJudul: d.research_title || '',
    risetKode: d.research_code || '',
    bidang: d.research_category || '',
    bidangId: bidangIdByNama(d.research_category)
  };
}

function mapList(res, mapper = mapResearch) {
  if (res.data === null) return { data: [], meta: res.meta };
  if (!Array.isArray(res.data)) throw invalidResponse('list');
  return { data: res.data.map(mapper), meta: res.meta };
}

function mapDetail(res) {
  const d = res.data || {};
  return {
    data: {
      ...mapResearch(d.research),
      komentar: (d.comments || []).map(mapComment),
      grup: mapGroup(d.group)
    },
    meta: null
  };
}

export const researchService = {
  /** payload: objek field backend; file: File PDF proposal. */
  async submit(payload, file) {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ''));
    fd.append('research_proposal_file', file);
    const res = await api.post('/v1/research/submit', fd, { timeout: 60000 });
    return mapResearch(res.data);
  },

  async listMine({ page = 1, limit = 50, q = '', signal } = {}) {
    return mapList(await api.get('/v1/research/submission', { query: { page, limit, filter: q }, signal }));
  },

  /** Detail internal: pemilik, anggota tim, atau staf. Termasuk komentar reviewer & grup. */
  async detail(slug, { signal } = {}) {
    return mapDetail(await api.get(`/v1/research/${encodeURIComponent(slug)}`, { signal }));
  },

  async revise(publicId, payload) {
    await api.patch(`/v1/research/revision/${encodeURIComponent(publicId)}`, payload);
  },

  // ---------- Publik ----------
  async listPublic({ page = 1, limit = 12, q = '', category = '', location = '', sort = '', signal } = {}) {
    return mapList(await api.get('/v2/researches', { query: { page, limit, filter: q, category, location, sort }, signal }));
  },

  async publicDetail(slug, { signal } = {}) {
    const res = await api.get(`/v2/researches/${encodeURIComponent(slug)}`, { signal });
    return { data: { ...mapResearch(res.data?.research), grup: mapGroup(res.data?.group) }, meta: null };
  },

  async facets(by, { signal } = {}) {
    const res = await api.get('/v2/researches/facets', { query: { by }, signal });
    if (!Array.isArray(res.data)) return { data: [], meta: null };
    return { data: res.data.map((f) => ({ nilai: f.value, total: f.total })), meta: null };
  },

  async documentations({ page = 1, limit = 12, research = '', category = '', signal } = {}) {
    return mapList(await api.get('/v2/documentations', { query: { page, limit, research, category }, signal }), mapDocumentation);
  },

  // ---------- Reviewer / admin ----------
  async staffList({ page = 1, limit = 20, q = '', status = '', signal } = {}) {
    return mapList(await api.get('/v1/reviewer/researches', { query: { page, limit, filter: q, status }, signal }));
  },

  async claim(publicId) {
    await api.post(`/v1/reviewer/assign/${encodeURIComponent(publicId)}`);
  },

  async approve(publicId, message) {
    await api.post(`/v1/reviewer/approve/${encodeURIComponent(publicId)}`, { message });
  },

  async decide(publicId, decision, message) {
    await api.post(`/v1/reviewer/comment/${encodeURIComponent(publicId)}`, { decision, message });
  }
};
