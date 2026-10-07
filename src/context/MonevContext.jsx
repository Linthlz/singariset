import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MONEV_KAJIAN_SEED, MONEV_SEED } from '../data/monevData.js';

const MonevCtx = createContext(null);

export function MonevProvider({ children }) {
  const [records, setRecords] = useState(MONEV_SEED);
  const [kajianList, setKajianList] = useState(MONEV_KAJIAN_SEED);

  const addMonev = useCallback((data) => {
    const record = {
      ...data,
      id: `MNV-${new Date().getFullYear()}-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setRecords((list) => [record, ...list]);
    return record;
  }, []);

  const updateRecommendation = useCallback((recordId, recommendationIndex, monitoring) => {
    setRecords((list) => list.map((record) => record.id === recordId ? {
      ...record,
      rekomendasi: record.rekomendasi.map((item, index) => index === recommendationIndex ? { ...item, monitoring } : item)
    } : record));
  }, []);

  const addMonevRecommendation = useCallback((kajianId, judul) => {
    const item = { id: `PN-${Date.now()}`, judul: judul.trim() };
    setKajianList((list) => list.map((kajian) => kajian.id === kajianId
      ? { ...kajian, rekomendasi: [...kajian.rekomendasi, item] }
      : kajian));
    return item;
  }, []);

  const addMonevKajian = useCallback(({ opd, judul, rekomendasi }) => {
    const timestamp = Date.now();
    const kajian = {
      id: `KJN-${timestamp}`,
      opd: opd.trim(),
      judul: judul.trim(),
      rekomendasi: [{ id: `PN-${timestamp}-1`, judul: rekomendasi.trim() }]
    };
    setKajianList((list) => [...list, kajian]);
    return kajian;
  }, []);

  const value = useMemo(() => ({
    records,
    kajianList,
    addMonev,
    addMonevRecommendation,
    addMonevKajian,
    updateRecommendation
  }), [records, kajianList, addMonev, addMonevRecommendation, addMonevKajian, updateRecommendation]);

  return <MonevCtx.Provider value={value}>{children}</MonevCtx.Provider>;
}

export function useMonev() {
  const context = useContext(MonevCtx);
  if (!context) throw new Error('useMonev harus dipakai di dalam MonevProvider');
  return context;
}