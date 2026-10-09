import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import AsyncState, { EmptyState } from '../components/AsyncState.jsx';
import { SKEMA } from '../data/singaData.js';
import { useFunding } from '../hooks/useContent.js';
import { tanggal, hariMenuju } from '../lib/format.js';

const FUND_STATUS = {
  open: { l: 'Dibuka', c: 'bg-success-bg text-success', border: 'before:bg-success' },
  closing: { l: 'Segera Tutup', c: 'bg-danger-bg text-danger', border: 'before:bg-danger' },
  soon: { l: 'Akan Dibuka', c: 'bg-info-bg text-info', border: 'before:bg-gold-500' }
};

const STATUSES = [
  { id: '', l: 'Semua status' },
  { id: 'open', l: 'Dibuka' },
  { id: 'closing', l: 'Segera Tutup' },
  { id: 'soon', l: 'Akan Dibuka' }
];

export default function Pendanaan() {
  const { data, loading, error, reload } = useFunding();
  const PENDANAAN = useMemo(() => data || [], [data]);
  const [status, setStatus] = useState('');
  const [skema, setSkema] = useState('');

  const hits = useMemo(() => PENDANAAN.filter((f) => {
    if (status && f.status !== status) return false;
    if (skema && f.skema !== skema) return false;
    return true;
  }), [PENDANAAN, status, skema]);

  return (
    <>
      <PageHero
        crumb="Peluang Pendanaan"
        title="Peluang Pendanaan Riset"
        lead="Skema hibah, insentif, dan kemitraan riset yang sedang atau akan dibuka untuk peneliti dan mitra di Kabupaten Buleleng."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">{data ? `${PENDANAAN.length} skema terdaftar` : 'Memuat skema…'}</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">{PENDANAAN.filter((f) => f.status === 'open').length} sedang dibuka</span>
        ]}
      />

      <section className="py-10 sm:py-14 lg:py-18">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <Reveal className="mb-5 flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-xl border border-line-strong bg-surface-2 p-3.5 sm:mb-6 sm:p-5">
            <div className="no-scrollbar -mx-3.5 flex w-[calc(100%+1.75rem)] gap-2 overflow-x-auto px-3.5 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Saring status pendanaan">
              {STATUSES.map((s) => {
                const n = s.id ? PENDANAAN.filter((f) => f.status === s.id).length : PENDANAAN.length;
                const active = status === s.id;
                return (
                  <button key={s.id || 'all'} type="button" aria-pressed={active} onClick={() => setStatus(s.id)}
                    className={`inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[.8rem] sm:py-1.75 font-semibold transition ${active ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'}`}>
                    {s.l} <span className="opacity-70">{n}</span>
                  </button>
                );
              })}
            </div>
            <select value={skema} onChange={(e) => setSkema(e.target.value)} className="w-full rounded-lg sm:w-auto sm:min-w-[220px] border border-line-strong bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-600">
              <option value="">Semua skema</option>
              {SKEMA.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </Reveal>

          <AsyncState loading={loading} error={error} isEmpty={hits.length === 0} onRetry={reload}
            empty={PENDANAAN.length
              ? <EmptyState title="Tidak ada skema yang cocok" text="Longgarkan filter untuk melihat skema lainnya." />
              : <EmptyState icon="money" title="Belum ada skema pendanaan" text="Skema hibah dan insentif riset akan diumumkan di halaman ini." />}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {hits.map((f, i) => {
              const sisa = hariMenuju(f.deadline);
              const fs = FUND_STATUS[f.status] || FUND_STATUS.open;
              const dlCls = sisa < 0 ? 'bg-surface-1 text-ink-2' : sisa <= 30 ? 'bg-danger-bg text-danger font-semibold' : sisa <= 75 ? 'bg-warning-bg text-warning font-semibold' : 'bg-surface-1 text-ink-2';
              return (
                <Reveal key={f.id} delay={(i % 3) * 90} className="h-full">
                  <article className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white p-4 sm:p-5.5 shadow-card transition hover:-translate-y-1 hover:shadow-pop before:absolute before:inset-x-0 before:top-0 before:h-1 ${fs.border}`}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.715rem] font-bold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${fs.c}`}>{fs.l}</span>
                      <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[.715rem] font-bold text-ink-2">{f.kuota} kuota</span>
                    </div>
                    <h3 className="text-[1rem] leading-snug">{f.nama}</h3>
                    <p className="mb-3 text-[.8rem] text-ink-3">{f.penyelenggara}</p>
                    <div className={`mb-3 flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[.8rem] ${dlCls}`}>
                      <Icon name="clock" size={16} />
                      <span>{sisa < 0 ? `Pendaftaran ditutup ${tanggal(f.deadline)}` : <>Ditutup {tanggal(f.deadline)} · <b>{sisa} hari lagi</b></>}</span>
                    </div>
                    <ul className="m-0 mb-3.5 list-none space-y-1.5 p-0 text-[.81rem]">
                      {f.syarat.slice(0, 3).map((s) => (
                        <li key={s} className="flex items-start gap-2 text-ink-2"><Icon name="check" size={14} className="mt-0.5 flex-none text-success" />{s}</li>
                      ))}
                    </ul>
                    <p className="mb-3.5 text-[.79rem] text-ink-3">{f.ket}</p>
                    {f.situs && <div className="mt-auto flex gap-2">
                      <a
                        href={f.situs} target="_blank" rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-maroon-800 px-3 py-2 text-center text-[.82rem] font-semibold text-white no-underline hover:bg-maroon-600"
                      >
                        Kunjungi penyelenggara <Icon name="external" size={14} />
                      </a>
                      <a
                        href={f.situs} target="_blank" rel="noopener noreferrer"
                        title={`Syarat lengkap di situs ${f.situsNama}`}
                        className="flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-2 text-[.82rem] font-semibold text-ink-2 no-underline hover:border-maroon-600 hover:text-maroon-800"
                      >
                        Syarat <Icon name="external" size={13} />
                      </a>
                    </div>}
                  </article>
                </Reveal>
              );
            })}
          </div>
          </AsyncState>
        </div>
      </section>
    </>
  );
}
