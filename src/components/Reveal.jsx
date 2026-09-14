import { forwardRef, useEffect, useRef, useState } from 'react';

/* Lama animasi .reveal di index.css (0,85 detik) + sedikit jeda aman. */
const LAMA_REVEAL = 1050;

/**
 * Menampilkan elemen dengan perlahan saat tergulir masuk layar: memudar naik
 * sambil blur-nya menghilang, mirip transisi pada situs Apple.
 *
 * Setelah animasi selesai, seluruh kelas animasi dilepas agar transisi bawaan
 * elemen (misalnya efek angkat saat kursor di atas kartu) kembali normal dan
 * tidak ikut melambat.
 */
const Reveal = forwardRef(function Reveal({ children, className = '', as: Tag = 'div', delay = 0, style, ...rest }, forwardedRef) {
  const localRef = useRef(null);
  const [fase, setFase] = useState('awal'); // awal → masuk → selesai

  useEffect(() => {
    const node = localRef.current;
    if (!node) return;

    let selesai;
    let sudah = false;
    function tampilkan() {
      if (sudah) return;
      sudah = true;
      setFase('masuk');
      selesai = setTimeout(() => setFase('selesai'), LAMA_REVEAL + delay);
    }

    if (!('IntersectionObserver' in window)) { tampilkan(); return; }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { tampilkan(); io.unobserve(e.target); }
        });
      },
      // Dipicu tepat saat elemen mulai masuk layar agar gerak lambatnya terlihat.
      { threshold: 0, rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(node);

    // Fail-safe khusus elemen yang SUDAH berada di layar saat halaman dimuat,
    // seandainya callback observer tidak sempat berjalan. Elemen di bawah layar
    // sengaja dibiarkan menunggu gulir agar animasinya benar-benar terlihat.
    const pengaman = setTimeout(() => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { io.disconnect(); tampilkan(); }
    }, 1200);

    return () => { io.disconnect(); clearTimeout(pengaman); clearTimeout(selesai); };
  }, [delay]);

  function setRefs(node) {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }

  const kelasFase = fase === 'awal' ? 'reveal' : fase === 'masuk' ? 'reveal reveal-in' : '';

  return (
    <Tag
      ref={setRefs}
      className={`${kelasFase} ${className}`.trim()}
      style={fase === 'selesai' || !delay ? style : { ...style, transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Reveal;
