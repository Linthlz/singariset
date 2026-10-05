import { SEKTOR_ROADMAP, KECAMATAN } from '../data/singaData.js';
import { researchService } from '../services/researchService.js';
import { contentService } from '../services/contentService.js';
import { tanggal } from './format.js';

/** Bagian statis: konten referensi yang memang tetap di frontend. */
export function staticSearchIndex() {
  return [
    ...SEKTOR_ROADMAP.map((s) => ({
      tipe: 'Peta Jalan', ikon: 'target', judul: s.nama, sub: 'Sektor prioritas riset daerah 2025–2029',
      href: `/roadmap#sektor-${s.id}`, key: `${s.nama} ${s.deskripsi}`.toLowerCase()
    })),
    ...KECAMATAN.map((k) => ({
      tipe: 'Wilayah', ikon: 'pin', judul: `Kecamatan ${k.nama}`, sub: `Fokus ${k.fokus}`,
      href: `/riset?kecamatan=${k.id}`, key: `${k.nama} ${k.fokus} kecamatan`.toLowerCase()
    }))
  ];
}

let dynamicCache = null;

/** Bagian dinamis dari API: riset berjalan dan skema pendanaan. Gagal → indeks statis saja. */
export function loadDynamicSearchIndex() {
  if (!dynamicCache) {
    dynamicCache = Promise.all([
      researchService.listPublic({ limit: 100 }).catch(() => ({ data: [] })),
      contentService.listFunding({ limit: 100 }).catch(() => ({ data: [] }))
    ]).then(([riset, dana]) => [
      ...riset.data.map((r) => ({
        tipe: 'Riset', ikon: 'flask', judul: r.judul,
        sub: [r.pengusul, r.institusi, r.lokasi].filter(Boolean).join(' · '),
        href: `/riset/${r.slug}`,
        key: `${r.judul} ${r.pengusul} ${r.institusi} ${r.lokasi} ${r.bidang}`.toLowerCase()
      })),
      ...dana.data.map((f) => ({
        tipe: 'Pendanaan', ikon: 'money', judul: f.nama, sub: `${f.penyelenggara} · Tutup ${tanggal(f.deadline, true)}`,
        href: '/pendanaan', key: `${f.nama} ${f.penyelenggara} ${f.ket}`.toLowerCase()
      }))
    ]);
    dynamicCache.then((items) => { if (!items.length) dynamicCache = null; });
  }
  return dynamicCache;
}
