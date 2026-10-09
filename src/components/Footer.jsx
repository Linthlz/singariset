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
      <footer className="relative overflow-hidden bg-[#2A0808] text-[.8rem] text-white/72 sm:text-[.82rem]" id="kontak">
        {/* Latar gambar — taruh berkas di public/images/footer/footer-bg.jpg.
            Bila belum ada, gradasi di bawahnya tetap tampil rapi. */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url('/images/footer/1.jpeg')" }}
          aria-hidden="true"
        />
        {/* Overlay agar teks tetap terbaca di atas gambar apa pun */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(42,8,8,.62) 0%, rgba(42,8,8,.55) 45%, rgba(26,4,4,.72) 100%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(680px 320px at 82% 6%, rgba(249,199,79,.16), transparent 64%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1240px] px-4 pt-5 sm:px-5 sm:pt-10">
          {/* HP: versi ringkas — deskripsi, jam layanan, dan catatan prototipe disembunyikan */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 pb-4 sm:gap-6 sm:pb-7 lg:grid-cols-[1.7fr_1fr_1fr_1.35fr]">
            <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:block">
              <div className="flex min-w-0 items-center gap-2 sm:mb-2.5 sm:gap-2.5">
                <LionMark size={30} className="sm:hidden" />
                <span className="hidden sm:block"><LionMark size={36} /></span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate font-head text-[.78rem] font-extrabold text-white sm:text-[.9rem]">SINGA RISET BULELENG</span>
                  <span className="hidden text-[.64rem] font-medium text-white/55 sm:block">Sinergi Gerakan Akademisi dan Riset Buleleng</span>
                </span>
              </div>
              <p className="m-0 hidden max-w-[42ch] text-[.78rem] leading-relaxed text-white/68 sm:block">
                Portal digital terpadu riset, inovasi, kolaborasi, dan tata kelola kebijakan berbasis bukti ilmiah Kabupaten Buleleng, dikelola oleh Badan Riset dan Inovasi Daerah (BRIDA).
              </p>
              <div className="flex flex-none gap-1 sm:mt-3 sm:gap-1.5">
                {SOSMED.map((s) => (
                  <a
                    key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 bg-white/8 text-white/80 backdrop-blur transition hover:border-gold-500 hover:bg-gold-500 hover:text-[#4A2D00]"
                  >
                    <Icon name={s.id} size={13} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-1.5 text-[.66rem] font-bold uppercase tracking-widest text-white sm:mb-2.5 sm:text-[.72rem]">Layanan Riset</h4>
              <ul className="m-0 list-none space-y-1 p-0 text-[.74rem] sm:space-y-1.5 sm:text-[.82rem]">
                <li><Link to="/kolaborasi" className="text-white/72 hover:text-gold-500">Pengajuan Kolaborasi</Link></li>
                <li><Link to="/pendanaan" className="text-white/72 hover:text-gold-500">Peluang Pendanaan</Link></li>
                <li><Link to="/publikasi" className="text-white/72 hover:text-gold-500">Galeri Kegiatan<span className="hidden sm:inline"> BRIDA</span></Link></li>
                <li><Link to="/register" className="text-white/72 hover:text-gold-500">Daftar Akun Mitra</Link></li>
                <li><Link to="/riset" className="text-white/72 hover:text-gold-500">Direktori Riset<span className="hidden sm:inline"> Daerah</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-1.5 text-[.66rem] font-bold uppercase tracking-widest text-white sm:mb-2.5 sm:text-[.72rem]">Tata Kelola</h4>
              <ul className="m-0 list-none space-y-1 p-0 text-[.74rem] sm:space-y-1.5 sm:text-[.82rem]">
                <li><Link to="/etika-regulasi#klirens" className="text-white/72 hover:text-gold-500">Klirens Etik Riset</Link></li>
                <li><Link to="/etika-regulasi#sop" className="text-white/72 hover:text-gold-500">SOP Pencairan &amp; SPJ</Link></li>
                <li><Link to="/etika-regulasi#pengaduan" className="text-white/72 hover:text-gold-500">Pengaduan<span className="hidden sm:inline"> &amp; Whistleblowing</span></Link></li>
                <li><Link to="/roadmap" className="text-white/72 hover:text-gold-500">Peta Jalan 2025–2029</Link></li>
                <li><Link to="/berita" className="text-white/72 hover:text-gold-500">Berita &amp; Diseminasi</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-1.5 text-[.66rem] font-bold uppercase tracking-widest text-white sm:mb-2.5 sm:text-[.72rem]">Kantor BRIDA Buleleng</h4>
              <ul className="m-0 list-none space-y-1 p-0 text-[.72rem] sm:space-y-1.5 sm:text-[.82rem]">
                <li className="flex items-start gap-2"><Icon name="pin" size={12} className="mt-0.5 flex-none text-gold-500" /><span>Jl. Ngurah Rai No. 2, Singaraja<span className="hidden sm:inline">, Kabupaten Buleleng</span>, Bali 81113</span></li>
                <li className="flex items-start gap-2"><Icon name="phone" size={12} className="mt-0.5 flex-none text-gold-500" /><span><span className="hidden sm:inline">Hotline layanan riset: </span>(0362) 21985 · <span className="sm:hidden">WA</span><span className="hidden sm:inline">WhatsApp</span> 0811-3900-xxx</span></li>
                <li className="flex items-start gap-2"><Icon name="mail" size={12} className="mt-0.5 flex-none text-gold-500" /><span>brida@bulelengkab.go.id</span></li>
                <li className="hidden items-start gap-2 sm:flex"><Icon name="clock" size={12} className="mt-0.5 flex-none text-gold-500" /><span>Senin–Kamis 07.30–15.30 WITA · Jumat 07.30–13.00 WITA</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-white/12 py-2.5 text-[.66rem] text-white/50 sm:py-3 sm:text-[.72rem]">
            <span>© 2025 <span className="sm:hidden">BRIDA</span><span className="hidden sm:inline">Badan Riset dan Inovasi Daerah</span> Kabupaten Buleleng<span className="hidden sm:inline">. Seluruh hak cipta dilindungi.</span></span>
            <span className="hidden sm:inline">Prototipe portal · Data yang ditampilkan bersifat contoh</span>
          </div>
        </div>
      </footer>
      <ToTop />
    </>
  );
}
