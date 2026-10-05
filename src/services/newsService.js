import { api, assetUrl, invalidResponse } from './api.js';

export const NEWS_STATUS = { draft: 'Draf', published: 'Terbit' };

const MAX_TITLE = 255;
const MAX_SOURCE = 255;
const MAX_COVER_BYTES = 5 * 1024 * 1024;
const COVER_TYPES = ['image/jpeg', 'image/png'];

function ringkasan(teks, max = 220) {
  if (!teks) return '';
  return teks.length > max ? `${teks.slice(0, max).trimEnd()}…` : teks;
}

/** Bentuk data backend → bentuk yang dipakai komponen UI. */
export function mapNews(n) {
  if (!n || typeof n !== 'object' || !n.public_id) throw invalidResponse('news item');
  const isi = String(n.content || '').split(/\n+/).map((p) => p.trim()).filter(Boolean);
  return {
    id: n.public_id,
    slug: n.slug,
    judul: n.title,
    kategori: n.category?.name || 'Umum',
    kategoriId: n.category?.public_id || '',
    kategoriSlug: n.category?.slug || '',
    tanggal: String(n.published_at || n.created_at || '').slice(0, 10),
    penulis: n.author?.name || 'Humas BRIDA Buleleng',
    gambar: assetUrl(n.cover_image),
    ringkas: ringkasan(isi[0]),
    isi,
    konten: n.content || '',
    sumber: n.source || '',
    status: n.status
  };
}

function mapList(res) {
  if (!Array.isArray(res.data)) {
    if (res.data === null) return { data: [], meta: res.meta };
    throw invalidResponse('news list');
  }
  return { data: res.data.map(mapNews), meta: res.meta };
}

export function mapCategory(c) {
  if (!c || !c.public_id) throw invalidResponse('category item');
  return { id: c.public_id, nama: c.name, slug: c.slug };
}

/** Validasi sisi klien; backend tetap memvalidasi ulang. Mengembalikan { field: pesan }. */
export function validateNewsForm(form, { isCreate }) {
  const e = {};
  const judul = form.judul.trim();
  if (!judul) e.judul = 'Judul wajib diisi.';
  else if (judul.length > MAX_TITLE) e.judul = `Judul maksimal ${MAX_TITLE} karakter.`;
  if (!form.kategoriId) e.kategoriId = 'Pilih kategori.';
  if (!form.konten.trim()) e.konten = 'Isi berita wajib diisi.';
  if (form.sumber.trim().length > MAX_SOURCE) e.sumber = `Sumber maksimal ${MAX_SOURCE} karakter.`;
  if (!['draft', 'published'].includes(form.status)) e.status = 'Status tidak valid.';
  if (isCreate && !form.cover) e.cover = 'Gambar sampul wajib diunggah.';
  if (form.cover) {
    if (!COVER_TYPES.includes(form.cover.type)) e.cover = 'Gambar harus berformat JPG atau PNG.';
    else if (form.cover.size > MAX_COVER_BYTES) e.cover = 'Ukuran gambar maksimal 5 MB.';
  }
  return e;
}

function toFormData(form) {
  const fd = new FormData();
  fd.append('title', form.judul.trim());
  fd.append('category_public_id', form.kategoriId);
  fd.append('content', form.konten.trim());
  fd.append('status', form.status);
  fd.append('source', form.sumber.trim());
  if (form.cover) fd.append('cover_image', form.cover);
  return fd;
}

export const newsService = {
  /** Publik: hanya berita berstatus terbit. */
  async listPublished({ page = 1, limit = 10, q = '', category = '', sort = '', signal } = {}) {
    const res = await api.get('/v2/news', { query: { page, limit, filter: q, category, sort }, signal });
    return mapList(res);
  },

  async listCategories({ signal } = {}) {
    const res = await api.get('/v2/news-categories', { signal });
    if (!Array.isArray(res.data)) throw invalidResponse('category list');
    return { data: res.data.map(mapCategory), meta: null };
  },

  /** Editor: termasuk draf. Butuh token admin/media. */
  async listAll({ page = 1, limit = 20, q = '', signal } = {}) {
    const res = await api.get('/v1/news', { query: { page, limit, filter: q }, signal });
    return mapList(res);
  },

  async getById(id, { signal } = {}) {
    const res = await api.get(`/v1/news/${encodeURIComponent(id)}`, { signal });
    return { data: mapNews(res.data), meta: null };
  },

  async create(form) {
    const res = await api.post('/v1/news', toFormData(form));
    return mapNews(res.data);
  },

  /** Kirim multipart hanya jika ada sampul baru; selain itu JSON. */
  async update(id, form) {
    const body = form.cover ? toFormData(form) : {
      title: form.judul.trim(),
      category_public_id: form.kategoriId,
      content: form.konten.trim(),
      status: form.status,
      source: form.sumber.trim() || null
    };
    const res = await api.patch(`/v1/news/${encodeURIComponent(id)}`, body);
    return mapNews(res.data);
  },

  async remove(id) {
    await api.delete(`/v1/news/${encodeURIComponent(id)}`);
  }
};
