import { createContext, useContext, useCallback, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';

const ToastCtx = createContext(null);
let uid = 0;

const KIND_ICON = { success: 'checkCircle', danger: 'alert', info: 'info' };
const KIND_COLOR = { success: 'text-success', danger: 'text-danger', info: 'text-info' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 220);
  }, []);

  const toast = useCallback((kind, title, message, ms = 4600) => {
    const id = ++uid;
    setToasts((t) => [...t, { id, kind, title, message, leaving: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), ms);
    return id;
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed right-4 bottom-4 z-[200] flex max-w-[min(380px,calc(100vw-2rem))] flex-col gap-2.5" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-pop text-sm transition-all duration-200 ${
              t.leaving ? 'opacity-0 translate-y-2' : 'animate-toast-in'
            }`}
          >
            <span className={`mt-0.5 flex-none ${KIND_COLOR[t.kind] || KIND_COLOR.info}`}>
              <Icon name={KIND_ICON[t.kind] || 'info'} size={20} />
            </span>
            <div className="min-w-0">
              <strong className="block text-ink">{t.title}</strong>
              {t.message && <p className="m-0 mt-0.5 text-[13px] text-ink-2">{t.message}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
