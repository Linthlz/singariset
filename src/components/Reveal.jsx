import { forwardRef, useEffect, useRef, useState } from 'react';

const Reveal = forwardRef(function Reveal({ children, className = '', as: Tag = 'div', delay = 0, ...rest }, forwardedRef) {
  const localRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = localRef.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setVisible(true); io.unobserve(e.target); }
        });
      },
      { threshold: 0, rootMargin: '200px 0px -10px' }
    );
    io.observe(node);
    // Fail-safe: a large/fast scroll jump can skip the intersection callback
    // entirely for a short element. Never let real content stay invisible.
    const safety = setTimeout(() => setVisible(true), 900);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, []);

  function setRefs(node) {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }

  return (
    <Tag
      ref={setRefs}
      className={`transition-all duration-500 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Reveal;
