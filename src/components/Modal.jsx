import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';

export default function Modal({ title, onClose, children, footer, wide = false }) {
  const hostRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    lastFocus.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const closeBtn = hostRef.current?.querySelector('[data-modal-close]');
    closeBtn?.focus();

    function onKey(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && hostRef.current) {
        const f = Array.from(hostRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .filter((n) => n.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (lastFocus.current?.focus) lastFocus.current.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[150] grid place-items-center overflow-y-auto bg-ink/55 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      ref={hostRef}
    >
      <div className={`flex max-h-[88vh] w-full flex-col rounded-2xl bg-white shadow-pop animate-[modalIn_.24s_cubic-bezier(.2,.9,.3,1)] ${wide ? 'max-w-[860px]' : 'max-w-[680px]'}`}>
        <div className="flex items-start gap-4 border-b border-line px-5.5 py-5">
          <h3 className="m-0 flex-1 text-lg font-extrabold heading-serif">{title}</h3>
          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label="Tutup jendela"
            className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-surface-1 text-ink-2 hover:bg-danger-bg hover:text-danger"
          >
            <Icon name="x" size={17} />
          </button>
        </div>
        <div className="overflow-y-auto px-5.5 py-5.5">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2.5 rounded-b-2xl border-t border-line bg-surface-1 px-5.5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
