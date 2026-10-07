import { api, invalidResponse } from './api.js';
import { mapDocumentation, mapResearch } from './researchService.js';

export const GROUP_ROLE = {
  leader: { label: 'Ketua peneliti', badge: 'bg-maroon-50 text-maroon-800' },
  member: { label: 'Anggota', badge: 'bg-info-bg text-info' },
  pembimbing: { label: 'Pembimbing BRIDA', badge: 'bg-gold-50 text-[#8A6400]' },
  admin: { label: 'Administrator', badge: 'bg-surface-2 text-ink-2' }
};

const person = (p) => (p ? { id: p.public_id, nama: p.name, institusi: p.institution || '', jabatan: p.position || '', email: p.email || '' } : null);

function mapSummary(g) {
  if (!g || !g.public_id) throw invalidResponse('group');
  const r = g.research;
  return {
    id: g.public_id,
    slug: g.slug || '',
    nama: g.name,
    peranSaya: g.my_role,
    jumlahAnggota: g.member_count || 0,
    ketua: person(g.leader),
    pembimbing: person(g.supervisor),
    riset: r ? { id: r.public_id, kode: r.research_code, slug: r.slug, judul: r.title, status: r.status, bidang: r.category, lokasi: r.location } : null
  };
}

function mapDetail(d) {
  if (!d || !d.group) throw invalidResponse('group detail');
  return {
    id: d.group.public_id,
    slug: d.group.slug || '',
    nama: d.group.name,
    kodeGabung: d.group.join_code || '',
    peranSaya: d.my_role,
    anggota: (d.members || []).map((m) => ({
      id: m.public_id, userId: m.user_public_id, nama: m.name, email: m.email,
      institusi: m.institution || '', jabatan: m.position || '', peran: m.role, bergabung: String(m.joined_at || '').slice(0, 10)
    })),
    riset: d.research ? mapResearch(d.research) : null,
    pembimbing: person(d.supervisor)
  };
}

/** Field riset yang boleh diedit ketua setelah disetujui. */
export const EDITABLE_FIELDS = [
  ['tujuan', 'purpose', 'Urgensi & tujuan riset', 'textarea', true],
  ['signifikansi', 'research_significance', 'Signifikansi', 'textarea', false],
  ['luaran', 'promised_output', 'Luaran yang dijanjikan', 'textarea', true],
  ['periode', 'research_time_range', 'Periode pelaksanaan', 'input', false],
  ['lokasi', 'location', 'Lokasi (kecamatan)', 'input', false],
  ['alamat', 'address', 'Alamat lokasi', 'input', false],
  ['targetMitra', 'partnership_target_selection', 'Mitra sasaran', 'input', false],
  ['mitra', 'partner_name', 'Nama mitra spesifik', 'input', false],
  ['penerimaManfaat', 'estimated_number_of_direct_beneficiaries', 'Perkiraan penerima manfaat', 'input', false]
];

export const groupService = {
  /** admin: true memakai route admin (seluruh kelompok), selain itu kelompok milik akun. */
  async mine({ signal, admin = false } = {}) {
    const res = await api.get(admin ? '/v1/admin/research/groups' : '/v1/research/group/list', { signal });
    if (res.data === null) return { data: [], meta: null };
    if (!Array.isArray(res.data)) throw invalidResponse('group list');
    return { data: res.data.map(mapSummary), meta: null };
  },

  /** slug atau public_id kelompok. */
  async detail(slug, { signal, admin = false } = {}) {
    const base = admin ? '/v1/admin/research/groups' : '/v1/research/group';
    const res = await api.get(`${base}/${encodeURIComponent(slug)}`, { signal });
    return { data: mapDetail(res.data), meta: null };
  },

  /** Admin: buat kelompok untuk riset disetujui yang belum memiliki kelompok. */
  async sync() {
    return (await api.post('/v1/admin/research/groups/sync')).data?.created || 0;
  },

  async join(code) {
    return (await api.post('/v1/research/group/join', { join_code: code.trim() })).data;
  },

  async updateResearch(id, form) {
    const body = Object.fromEntries(EDITABLE_FIELDS.map(([k, col]) => [col, form[k] ?? '']));
    return mapDetail((await api.patch(`/v1/research/group/${encodeURIComponent(id)}/research`, body)).data);
  },

  async removeMember(id, memberId) {
    await api.delete(`/v1/research/group/${encodeURIComponent(id)}/members/${encodeURIComponent(memberId)}`);
  },

  async leave(id) {
    await api.post(`/v1/research/group/${encodeURIComponent(id)}/leave`);
  },

  async regenerateCode(id) {
    return (await api.post(`/v1/research/group/${encodeURIComponent(id)}/join-code`)).data?.join_code || '';
  },

  async setSupervisor(id, reviewerPublicId) {
    return mapDetail((await api.patch(`/v1/research/group/${encodeURIComponent(id)}/supervisor`, { reviewer_public_id: reviewerPublicId })).data);
  },

  async documentations(id, { signal } = {}) {
    const res = await api.get(`/v1/research/group/${encodeURIComponent(id)}/documentations`, { query: { limit: 100 }, signal });
    if (res.data === null) return { data: [], meta: res.meta };
    if (!Array.isArray(res.data)) throw invalidResponse('documentation list');
    return { data: res.data.map((d) => ({ ...mapDocumentation(d), grupId: id })), meta: res.meta };
  }
};
