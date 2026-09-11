import { BIDANG, KECAMATAN, SKEMA, RISET } from '../data/singaData.js';

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function rupiah(n) {
  return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
}

export function rupiahRingkas(n) {
  n = Number(n || 0);
  if (n >= 1e12) return 'Rp ' + (n / 1e12).toFixed(n % 1e12 === 0 ? 0 : 2).replace('.', ',') + ' T';
  if (n >= 1e9)  return 'Rp ' + (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 2).replace('.', ',') + ' M';
  if (n >= 1e6)  return 'Rp ' + Math.round(n / 1e6) + ' Jt';
  return rupiah(n);
}

export function tanggal(iso, pendek) {
  if (!iso) return '-';
  const p = String(iso).split('-');
  let b = BULAN[parseInt(p[1], 10) - 1] || '';
  if (pendek) b = b.slice(0, 3);
  return parseInt(p[2], 10) + ' ' + b + ' ' + p[0];
}

export function hariMenuju(iso) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const t = new Date(iso + 'T00:00:00');
  return Math.round((t - now) / 86400000);
}

export function angka(n) { return Number(n || 0).toLocaleString('id-ID'); }

export function bidangById(id) {
  return BIDANG.find((b) => b.id === id) || { id, nama: id, warna: '#6B7280' };
}
export function kecById(id) {
  return KECAMATAN.find((k) => k.id === id) || { id, nama: id };
}
export function skemaById(id) {
  return SKEMA.find((s) => s.id === id) || { id, nama: id };
}
export function risetById(id) {
  return RISET.find((r) => r.id === id) || null;
}

export const STATUS_META = {
  ontrack: { label: 'On Track',          badge: 'bg-success-bg text-success', bar: 'from-emerald-700 to-success', desc: 'Capaian sesuai timeline kontrak.' },
  warning: { label: 'Warning / Koreksi', badge: 'bg-warning-bg text-warning', bar: 'from-amber-800 to-warning', desc: 'Terdapat deviasi logbook atau dokumen pendukung belum lengkap.' },
  delayed: { label: 'Delayed · SP-1',    badge: 'bg-danger-bg text-danger',  bar: 'from-red-800 to-danger', desc: 'Melewati batas waktu termin SPJ atau uji coba.' },
  selesai: { label: 'Selesai & Adopsi',  badge: 'bg-info-bg text-info',      bar: 'from-maroon-800 to-maroon-600', desc: 'Telah melalui sidang luaran dan rekomendasi diadopsi OPD.' }
};
export function statusMeta(s) { return STATUS_META[s] || STATUS_META.ontrack; }

export function wordCount(s) { return s && s.trim() ? s.trim().split(/\s+/).length : 0; }
