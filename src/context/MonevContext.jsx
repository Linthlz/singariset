import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MONEV_SEED } from '../data/monevData.js';

const MonevCtx = createContext(null);

export function MonevProvider({ children }) {
  const [records, setRecords] = useState(MONEV_SEED);

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

  const value = useMemo(() => ({ records, addMonev, updateRecommendation }), [records, addMonev, updateRecommendation]);

  return <MonevCtx.Provider value={value}>{children}</MonevCtx.Provider>;
}

export function useMonev() {
  const context = useContext(MonevCtx);
  if (!context) throw new Error('useMonev harus dipakai di dalam MonevProvider');
  return context;
}