import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { MONEV_KAJIAN_SEED, MONEV_SEED } from '../data/monevData.js';

/* Backend belum menyediakan endpoint Monev; data disimpan di memori selama sesi.
   Karena itu hak akses di bawah baru ditegakkan di sisi frontend. */
const MonevCtx = createContext(null);

/** Peran backend yang boleh mengelola seluruh Monev (poin, kajian, status, semua laporan). */
const PENGELOLA_MONEV = ['admin', 'pegawai-brida'];

export function canManageMonev(user) {
  return !!user && PENGELOLA_MONEV.includes(user.backendRole);
}

/** Akun OPD hanya boleh membuat/memperbarui laporan milik instansinya sendiri. */
export function canEditMonevRecord(user, record) {
  if (!user || !record) return false;
  if (canManageMonev(user)) return true;
  return user.backendRole === 'opd' && record.opd === user.instansi;
}

export function MonevProvider({ children }) {
  const { user } = useAuth();
  const [records, setRecords] = useState(MONEV_SEED);
  const [kajianList, setKajianList] = useState(MONEV_KAJIAN_SEED);
  const canManage = canManageMonev(user);

  const addMonev = useCallback((data) => {
    if (!canEditMonevRecord(user, data)) throw new Error('Anda hanya dapat mengisi Monev untuk OPD Anda sendiri.');
    const record = {
      ...data,
      id: `MNV-${new Date().getFullYear()}-${Date.now()}`,
      createdBy: user.publicId,
      createdAt: new Date().toISOString()
    };
    setRecords((list) => [record, ...list]);
    return record;
  }, [user]);

  /** Perbarui jawaban laporan (uraian, kendala, manfaat, status, bukti) oleh pemilik atau pengelola. */
  const updateMonev = useCallback((recordId, rekomendasi) => {
    const target = records.find((record) => record.id === recordId);
    if (!canEditMonevRecord(user, target)) throw new Error('Anda tidak berhak memperbarui laporan Monev ini.');
    setRecords((list) => list.map((record) => record.id === recordId ? {
      ...record,
      rekomendasi: record.rekomendasi.map((item, index) => ({ ...item, ...rekomendasi[index], judul: item.judul })),
      updatedBy: user.publicId,
      updatedAt: new Date().toISOString()
    } : record));
  }, [records, user]);

  const updateRecommendation = useCallback((recordId, recommendationIndex, monitoring) => {
    if (!canManage) return;
    setRecords((list) => list.map((record) => record.id === recordId ? {
      ...record,
      rekomendasi: record.rekomendasi.map((item, index) => index === recommendationIndex ? { ...item, monitoring } : item)
    } : record));
  }, [canManage]);

  const addMonevRecommendation = useCallback((kajianId, judul) => {
    if (!canManage) return null;
    const item = { id: `PN-${Date.now()}`, judul: judul.trim() };
    setKajianList((list) => list.map((kajian) => kajian.id === kajianId
      ? { ...kajian, rekomendasi: [...kajian.rekomendasi, item] }
      : kajian));
    return item;
  }, [canManage]);

  const addMonevKajian = useCallback(({ opd, judul, rekomendasi }) => {
    if (!canManage) return null;
    const timestamp = Date.now();
    const kajian = {
      id: `KJN-${timestamp}`,
      risetKode: '',
      opd: opd.trim(),
      judul: judul.trim(),
      rekomendasi: [{ id: `PN-${timestamp}-1`, judul: rekomendasi.trim() }]
    };
    setKajianList((list) => [...list, kajian]);
    return kajian;
  }, [canManage]);

  const value = useMemo(() => ({
    records,
    kajianList,
    canManage,
    canEditRecord: (record) => canEditMonevRecord(user, record),
    addMonev,
    updateMonev,
    addMonevRecommendation,
    addMonevKajian,
    updateRecommendation
  }), [records, kajianList, canManage, user, addMonev, updateMonev, addMonevRecommendation, addMonevKajian, updateRecommendation]);

  return <MonevCtx.Provider value={value}>{children}</MonevCtx.Provider>;
}

export function useMonev() {
  const context = useContext(MonevCtx);
  if (!context) throw new Error('useMonev harus dipakai di dalam MonevProvider');
  return context;
}
