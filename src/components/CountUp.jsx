import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value, suffix = '', prefix = '', decimals = 0, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState('0');
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) { run(); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) { done.current = true; run(); io.unobserve(e.target); }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();

    function run() {
      const dur = 1250;
      let t0 = null;
      function frame(ts) {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = value * eased;
        setDisplay(decimals ? v.toFixed(decimals).replace('.', ',') : Math.round(v).toLocaleString('id-ID'));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <div ref={ref} className={className}>{prefix}{display}{suffix}</div>;
}
