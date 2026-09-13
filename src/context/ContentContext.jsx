import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { BERITA as BERITA_AWAL, DOKUMENTASI as DOKUMENTASI_AWAL, PENDANAAN as PENDANAAN_AWAL } from '../data/singaData.js';

/* ==========================================================================
   Konten portal (berita, publikasi/dokumentasi, skema pendanaan) yang bisa
   dikelola administrator — PROTOTIPE ANTARMUKA SAJA, disimpan di memori
   React sehingga konsisten selama sesi berjalan.
   ========================================================================== */

function buatId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

const ContentCtx = createContext(null);

export function ContentProvider({ children }) {
  const [berita, setBerita] = useState(BERITA_AWAL);
  const [dokumentasi, setDokumentasi] = useState(DOKUMENTASI_AWAL);
  const [pendanaan, setPendanaan] = useState(PENDANAAN_AWAL);

  const addBerita = useCallback((data) => setBerita((list) => [{ id: buatId('N'), ...data }, ...list]), []);
  const updateBerita = useCallback((id, data) => setBerita((list) => list.map((b) => (b.id === id ? { ...b, ...data } : b))), []);
  const deleteBerita = useCallback((id) => setBerita((list) => list.filter((b) => b.id !== id)), []);

  const addDokumentasi = useCallback((data) => setDokumentasi((list) => [{ id: buatId('DOK'), ...data }, ...list]), []);
  const updateDokumentasi = useCallback((id, data) => setDokumentasi((list) => list.map((d) => (d.id === id ? { ...d, ...data } : d))), []);
  const deleteDokumentasi = useCallback((id) => setDokumentasi((list) => list.filter((d) => d.id !== id)), []);

  const addPendanaan = useCallback((data) => setPendanaan((list) => [{ id: buatId('FND'), ...data }, ...list]), []);
  const updatePendanaan = useCallback((id, data) => setPendanaan((list) => list.map((f) => (f.id === id ? { ...f, ...data } : f))), []);
  const deletePendanaan = useCallback((id) => setPendanaan((list) => list.filter((f) => f.id !== id)), []);

  const value = useMemo(() => ({
    berita, addBerita, updateBerita, deleteBerita,
    dokumentasi, addDokumentasi, updateDokumentasi, deleteDokumentasi,
    pendanaan, addPendanaan, updatePendanaan, deletePendanaan
  }), [berita, dokumentasi, pendanaan, addBerita, updateBerita, deleteBerita, addDokumentasi, updateDokumentasi, deleteDokumentasi, addPendanaan, updatePendanaan, deletePendanaan]);

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useContent harus dipakai di dalam ContentProvider');
  return ctx;
}
