import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LionMark from './LionMark.jsx';
import Icon from './Icon.jsx';
import { SOSMED_RESMI } from '../data/singaData.js';

function ToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    function onScroll() { setShow(window.scrollY > 620); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Kembali ke atas halaman"
      className="fixed bottom-4 right-4 z-[90] grid h-11 w-11 place-items-center rounded-full bg-maroon-800 text-white shadow-pop transition hover:-translate-y-0.5 hover:bg-maroon-600"
    >
      <Icon name="arrow" size={18} className="-rotate-90" />
    </button>
  );
}

const SOSMED = [
  { id: 'instagram', label: 'Instagram BRIDA Buleleng', href: SOSMED_RESMI.instagram },
  { id: 'facebook', label: 'Facebook BRIDA Buleleng', href: SOSMED_RESMI.facebook },
  { id: 'tiktok', label: 'TikTok BRIDA Buleleng', href: SOSMED_RESMI.tiktok },
  { id: 'youtube', label: 'YouTube BRIDA Buleleng', href: SOSMED_RESMI.youtube }
];

export default function Footer() {
  return (
    <>
      <footer className="relative overflow-hidden bg-[#2A0808] text-[.855rem] text-white/72" id="kontak">
        {/* Latar gambar — taruh berkas di public/images/footer/footer-bg.jpg.
            Bila belum ada, gradasi di bawahnya tetap tampil rapi. */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/footer/footer-bg.jpg')" }}
          aria-hidden="true"
        />
        {/* Overlay agar teks tetap terbaca di atas gambar apa pun */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(42,8,8,.93) 0%, rgba(42,8,8,.88) 45%, rgba(26,4,4,.97) 100%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(680px 320px at 82% 6%, rgba(249,199,79,.16), transparent 64%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1240px] px-5 pt-13">
          <div className="grid grid-cols-1 gap-8 pb-9 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.35fr]">
            <div>
              <div className="mb-4 flex items-start gap-3">
                <LionMark size={46} />
                <span className="flex flex-col leading-tight">
                  <span className="font-head text-[1rem] font-extrabold text-white">SINGA RISET BULELENG</span>
                  <span className="text-[.68rem] font-medium text-white/55">Sinergi Gerakan Akademisi dan Riset Buleleng</span>
                </span>
              </div>
              <p className="max-w-[38ch] text-[.85rem] text-white/68">
                Portal digital terpadu riset, inovasi, kolaborasi, dan tata kelola kebijakan berbasis bukti ilmiah Kabupaten Buleleng — dikelola oleh Badan Riset dan Inovasi Daerah (BRIDA).
              </p>
              <div className="mt-4 flex gap-2">
                {SOSMED.map((s) => (
                  <a
                    key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-white/12 bg-white/8 text-white/80 backdrop-blur transition hover:border-gold-500 hover:bg-gold-500 hover:text-[#4A2D00]"
                  >
                    <Icon name={s.id} size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3.5 text-[.85rem] font-bold uppercase tracking-widest text-white">Layanan Riset</h4>
              <ul className="m-0 list-none space-y-2.5 p-0">
                <li><Link to="/kolaborasi" className="text-white/72 hover:text-gold-500">Pengajuan Kolaborasi</Link></li>
                <li><Link to="/#pendanaan" className="text-white/72 hover:text-gold-500">Peluang Pendanaan</Link></li>
                <li><Link to="/publikasi" className="text-white/72 hover:text-gold-500">Publikasi &amp; Dokumentasi</Link></li>
                <li><Link to="/register" className="text-white/72 hover:text-gold-500">Daftar Akun Mitra</Link></li>
                <li><Link to="/riset" className="text-white/72 hover:text-gold-500">Direktori Riset Daerah</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3.5 text-[.85rem] font-bold uppercase tracking-widest text-white">Tata Kelola</h4>
              <ul className="m-0 list-none space-y-2.5 p-0">
                <li><Link to="/etika-regulasi#klirens" className="text-white/72 hover:text-gold-500">Klirens Etik Riset</Link></li>
                <li><Link to="/etika-regulasi#sop" className="text-white/72 hover:text-gold-500">SOP Pencairan &amp; SPJ</Link></li>
                <li><Link to="/etika-regulasi#pengaduan" className="text-white/72 hover:text-gold-500">Pengaduan &amp; Whistleblowing</Link></li>
                <li><Link to="/roadmap" className="text-white/72 hover:text-gold-500">Peta Jalan 2025–2029</Link></li>
                <li><Link to="/berita" className="text-white/72 hover:text-gold-500">Berita &amp; Diseminasi</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3.5 text-[.85rem] font-bold uppercase tracking-widest text-white">Kantor BRIDA Buleleng</h4>
              <ul className="m-0 list-none space-y-2.5 p-0">
                <li className="flex items-start gap-2.5"><Icon name="pin" size={15} className="mt-0.5 flex-none text-gold-500" /><span>Jl. Ngurah Rai No. 2, Singaraja, Kabupaten Buleleng, Bali 81113</span></li>
                <li className="flex items-start gap-2.5"><Icon name="phone" size={15} className="mt-0.5 flex-none text-gold-500" /><span>Hotline layanan riset: (0362) 21985 · WhatsApp 0811-3900-xxx</span></li>
                <li className="flex items-start gap-2.5"><Icon name="mail" size={15} className="mt-0.5 flex-none text-gold-500" /><span>brida@bulelengkab.go.id</span></li>
                <li className="flex items-start gap-2.5"><Icon name="clock" size={15} className="mt-0.5 flex-none text-gold-500" /><span>Senin–Kamis 07.30–15.30 WITA · Jumat 07.30–13.00 WITA</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-4 border-t border-white/12 py-4.5 text-[.78rem] text-white/50">
            <span>© 2025 Badan Riset dan Inovasi Daerah Kabupaten Buleleng. Seluruh hak cipta dilindungi.</span>
            <span>Prototipe portal · Data yang ditampilkan bersifat contoh</span>
          </div>
        </div>
      </footer>
      <ToTop />
    </>
  );
}
