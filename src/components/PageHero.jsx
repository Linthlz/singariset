import { Link } from 'react-router-dom';

export default function PageHero({ crumb, title, lead, badges, children }) {
  return (
    <section className="relative overflow-hidden bg-maroon-900 py-10 text-white sm:py-13" style={{ backgroundImage: 'linear-gradient(135deg,#7A1616 0%,#6B1414 55%,#3B0A0A 100%)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(560px 300px at 92% 12%, rgba(249,199,79,.18), transparent 62%)' }} />
      <div className="relative z-10 mx-auto max-w-[1240px] px-5">
        <nav className="mb-3.5 flex flex-wrap items-center gap-2 text-[.78rem] text-white/60" aria-label="Remah roti">
          <Link to="/" className="text-white/82 hover:text-gold-500">Beranda</Link>
          <span className="opacity-50">/</span>
          <span>{crumb}</span>
        </nav>
        <h1 className="mb-2.5 text-[clamp(1.65rem,3.4vw,2.5rem)] font-extrabold text-white">{title}</h1>
        {lead && <p className="max-w-[720px] text-white/80">{lead}</p>}
        {badges && <div className="mt-5 flex flex-wrap gap-2.5">{badges}</div>}
        {children}
      </div>
    </section>
  );
}
