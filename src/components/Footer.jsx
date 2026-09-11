import { Link } from 'react-router-dom';
import LionMark from './LionMark.jsx';
import Icon from './Icon.jsx';
import { useEffect, useState } from 'react';

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

export default function Footer() {
  return (
    <>
      <footer className="bg-[#2A0808] pt-13 text-[.855rem] text-white/72" id="kontak">
        <div className="mx-auto max-w-[1240px] px-5">
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
                {['mail', 'globe', 'video'].map((ic) => (
                  <a key={ic} href="#" aria-label="Kanal BRIDA" className="grid h-8.5 w-8.5 place-items-center rounded-lg bg-white/8 text-white/80 transition hover:bg-gold-500 hover:text-[#4A2D00]">
                    <Icon name={ic} size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3.5 text-[.85rem] font-bold uppercase tracking-widest text-white">Layanan Riset</h4>
              <ul className="m-0 list-none space-y-2.5 p-0">
                <li><Link to="/kolaborasi" className="text-white/72 hover:text-gold-500">Pengajuan Kolaborasi</Link></li>
                <li><Link to="/#pendanaan" className="text-white/72 hover:text-gold-500">Peluang Pendanaan</Link></li>
                <li><Link to="/dashboard/opd" className="text-white/72 hover:text-gold-500">Monitoring &amp; Evaluasi</Link></li>
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
                <li><Link to="/riset" className="text-white/72 hover:text-gold-500">Data Terbuka Riset</Link></li>
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
