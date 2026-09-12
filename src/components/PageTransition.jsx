import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* Lama animasi CSS .page-enter dan .route-bar di index.css (1,1 detik).
   Nilai ini disamakan agar bilah kemajuan hilang tepat saat isi halaman
   selesai memudar masuk, bukan lebih cepat maupun lebih lambat. */
const LAMA_TRANSISI = 1100;

/**
 * Transisi antar halaman: isi halaman memudar-naik secara perlahan saat
 * rute berganti, disertai bilah kemajuan tipis di bagian atas layar.
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const [memuat, setMemuat] = useState(false);

  useEffect(() => {
    setMemuat(true);
    const t = setTimeout(() => setMemuat(false), LAMA_TRANSISI);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {memuat && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.75" aria-hidden="true">
          <div className="route-bar h-full w-full" style={{ backgroundImage: 'linear-gradient(90deg,#8E1B1B,#C62828,#F9C74F)' }} />
        </div>
      )}
      <div key={pathname} className="page-enter">
        {children}
      </div>
    </>
  );
}
