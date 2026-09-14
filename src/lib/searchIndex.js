import { RISET, PENDANAAN, SEKTOR_ROADMAP, KECAMATAN } from '../data/singaData.js';
import { bidangById, kecById, tanggal } from './format.js';

let cache = null;

export function buildSearchIndex() {
  if (cache) return cache;
  const out = [];

  RISET.forEach((r) => {
    out.push({
      tipe: 'Riset', ikon: 'flask', judul: r.judul,
      sub: `${r.peneliti} · ${r.institusi} · ${kecById(r.kecamatan).nama}`,
      href: `/riset/${r.id}`,
      key: `${r.judul} ${r.peneliti} ${r.tags.join(' ')} ${r.institusi} ${kecById(r.kecamatan).nama} ${bidangById(r.bidang).nama}`.toLowerCase()
    });
  });

  PENDANAAN.forEach((f) => {
    out.push({
      tipe: 'Pendanaan', ikon: 'money', judul: f.nama, sub: `${f.penyelenggara} · Tutup ${tanggal(f.deadline, true)}`,
      href: '/pendanaan',
      key: `${f.nama} ${f.penyelenggara} ${f.ket}`.toLowerCase()
    });
  });

  SEKTOR_ROADMAP.forEach((s) => {
    out.push({
      tipe: 'Peta Jalan', ikon: 'target', judul: s.nama, sub: 'Sektor prioritas riset daerah 2025–2029',
      href: `/roadmap#sektor-${s.id}`,
      key: `${s.nama} ${s.deskripsi}`.toLowerCase()
    });
  });

  KECAMATAN.forEach((k) => {
    out.push({
      tipe: 'Wilayah', ikon: 'pin', judul: `Kecamatan ${k.nama}`, sub: `${k.riset} riset · fokus ${k.fokus}`,
      href: `/riset?kecamatan=${k.id}`,
      key: `${k.nama} ${k.fokus} kecamatan`.toLowerCase()
    });
  });

  cache = out;
  return out;
}
