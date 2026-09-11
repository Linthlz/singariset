import { useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import Modal from '../components/Modal.jsx';
import { useToast } from '../context/ToastContext.jsx';

const KLIRENS = [
  { t: 'Ruang Lingkup Klirens Etik', d: 'Setiap riset yang melibatkan subjek manusia, data pribadi masyarakat, sumber daya hayati, atau kearifan lokal (awig-awig, tradisi adat) wajib memperoleh surat keterangan lolos kaji etik dari Komite Klirens Etik Riset Buleleng sebelum pengumpulan data lapangan dimulai.' },
  { t: 'Susunan Komite', d: 'Komite beranggotakan 7 pakar lintas disiplin: metodologi penelitian, hukum, kesehatan masyarakat, sosial-budaya, dan perwakilan adat Buleleng. Masa tugas komite 2 tahun dan dapat diperpanjang satu periode.' },
  { t: 'Prosedur Pengajuan', d: 'Peneliti mengunggah protokol riset, instrumen pengumpulan data, formulir persetujuan (informed consent), dan rencana mitigasi risiko melalui portal ini. Telaah komite berlangsung maksimal 10 hari kerja sejak berkas dinyatakan lengkap.' },
  { t: 'Sanksi Pelanggaran', d: 'Riset yang terbukti melanggar prinsip etik — termasuk pengumpulan data tanpa persetujuan, eksploitasi kearifan lokal tanpa kompensasi wajar, atau manipulasi data — dapat dikenai penghentian kontrak, pengembalian dana, dan pencatatan pada daftar hitam pengusul riset daerah.' }
];

const SOP = [
  { t: 'Termin Pencairan Dana', d: 'Pencairan dilakukan dalam 3 termin: 40% pada penandatanganan kontrak, 40% pada laporan kemajuan 50% tervalidasi, dan 20% pada laporan akhir serta luaran wajib terverifikasi.' },
  { t: 'Kelengkapan SPJ', d: 'Surat Pertanggungjawaban (SPJ) memuat kuitansi asli bermeterai, faktur pembelian, daftar hadir kegiatan, dan rekapitulasi honorarium sesuai standar biaya masukan daerah. SPJ diunggah maksimal 14 hari kerja setelah dana termin diterima.' },
  { t: 'Verifikasi Keuangan', d: 'Tim keuangan BRIDA memverifikasi kewajaran realisasi terhadap Rencana Anggaran Biaya (RAB) awal. Deviasi di atas 15% pada satu pos anggaran wajib disertai revisi RAB yang disetujui pengelola program.' },
  { t: 'Retur &amp; Sisa Dana', d: 'Sisa dana yang tidak terserap pada akhir kontrak dikembalikan ke kas daerah maksimal 7 hari kerja setelah laporan akhir disahkan, disertai bukti setor yang diunggah ke portal.' }
];

const JENIS_LAPORAN = [
  'Penyalahgunaan dana riset',
  'Manipulasi data atau plagiarisme',
  'Pelanggaran klirens etik riset',
  'Konflik kepentingan penilaian',
  'Lainnya'
];

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((it, i) => (
        <div key={it.t} className="overflow-hidden rounded-xl border border-line bg-white">
          <button
            type="button"
            onClick={() => setOpen((o) => (o === i ? -1 : i))}
            aria-expanded={open === i}
            className={`flex w-full items-center justify-between gap-3.5 px-5 py-4 text-left font-head text-[.93rem] font-bold text-ink transition ${open === i ? 'bg-maroon-50' : 'hover:bg-surface-1'}`}
          >
            {it.t}
            <Icon name="plus" size={19} className={`flex-none text-maroon-800 transition-transform ${open === i ? 'rotate-45' : ''}`} />
          </button>
          {open === i && (
            <div className="border-t border-line px-5 pb-5 pt-4 text-[.87rem] leading-relaxed text-ink-2">{it.d}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function EtikaRegulasi() {
  const toast = useToast();
  const [form, setForm] = useState({ jenis: '', deskripsi: '', kontak: '', anonim: true });
  const [result, setResult] = useState(null);

  function submit(e) {
    e.preventDefault();
    if (!form.jenis || form.deskripsi.trim().length < 30) {
      toast('danger', 'Laporan belum lengkap', 'Pilih jenis laporan dan tuliskan kronologi minimal 30 karakter.');
      return;
    }
    const code = 'WBS-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000);
    setResult(code);
    setForm({ jenis: '', deskripsi: '', kontak: '', anonim: true });
    toast('success', 'Laporan terkirim', `Kode pelacakan ${code} telah dibuat.`);
  }

  return (
    <>
      <PageHero
        crumb="Etika & Regulasi"
        title="Tata Kelola & Kebijakan Riset"
        lead="Pedoman klirens etik, standar operasional pencairan dana, dan kanal pengaduan yang menjaga integritas ekosistem riset Kabupaten Buleleng."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">Perbup Riset & Inovasi Daerah</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">Pedoman Hibah Riset BRIDA 2026</span>
        ]}
      />

      <section id="klirens" className="scroll-mt-24 py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">5.1 — Klirens Etik</span>
            <h2 className="text-[1.6rem]">Pedoman Komite Klirens Etik Riset Buleleng</h2>
            <p className="mb-0 text-ink-2">Menjaga agar setiap riset yang melibatkan masyarakat, data pribadi, atau kearifan lokal Buleleng dilakukan secara etis, aman, dan menghormati hak subjek riset.</p>
          </Reveal>
          <Reveal><Accordion items={KLIRENS} /></Reveal>
        </div>
      </section>

      <section id="sop" className="scroll-mt-24 bg-surface-1 py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">5.2 — SOP Keuangan</span>
            <h2 className="text-[1.6rem]">Standar Operasional Prosedur Pencairan Dana &amp; SPJ</h2>
            <p className="mb-0 text-ink-2">Memastikan akuntabilitas setiap rupiah dana riset daerah, dari pencairan termin hingga pertanggungjawaban dan pengembalian sisa dana.</p>
          </Reveal>
          <Reveal><Accordion items={SOP} /></Reveal>
        </div>
      </section>

      <section id="pengaduan" className="scroll-mt-24 py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">5.3 — Whistleblowing</span>
            <h2 className="text-[1.6rem]">Sistem Pengaduan &amp; Whistleblowing Kebocoran Riset</h2>
            <p className="mb-0 text-ink-2">Kanal pelaporan rahasia bagi siapa pun yang mengetahui indikasi penyimpangan dana, manipulasi data, atau pelanggaran etik dalam pelaksanaan riset daerah.</p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal className="rounded-xl border border-line bg-white p-6.5 shadow-card">
              <form onSubmit={submit} className="flex flex-col gap-4.5">
                <div>
                  <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">Jenis laporan <span className="text-maroon-600">*</span></label>
                  <select className="input-base" value={form.jenis} onChange={(e) => setForm((f) => ({ ...f, jenis: e.target.value }))}>
                    <option value="">Pilih jenis laporan</option>
                    {JENIS_LAPORAN.map((j) => <option key={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">Kronologi kejadian <span className="text-maroon-600">*</span></label>
                  <textarea className="input-base min-h-[150px]" value={form.deskripsi} onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
                    placeholder="Jelaskan kejadian, waktu, pihak yang terlibat, dan bukti pendukung yang Anda ketahui." />
                  <p className="mt-1.5 text-[.78rem] text-ink-3">Minimal 30 karakter. Laporan diteruskan langsung ke Inspektorat dan pimpinan BRIDA.</p>
                </div>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line px-3.5 py-3 text-[.86rem] hover:bg-surface-1">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 flex-none accent-maroon-800" checked={form.anonim} onChange={(e) => setForm((f) => ({ ...f, anonim: e.target.checked }))} />
                  <span><span className="block font-semibold text-ink">Kirim sebagai laporan anonim</span><span className="block text-[.77rem] text-ink-3">Identitas pelapor tidak akan dicatat maupun ditelusuri oleh sistem.</span></span>
                </label>
                {!form.anonim && (
                  <div>
                    <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">Kontak balasan (opsional)</label>
                    <input className="input-base" value={form.kontak} onChange={(e) => setForm((f) => ({ ...f, kontak: e.target.value }))} placeholder="Surel atau nomor WhatsApp untuk klarifikasi lanjutan" />
                  </div>
                )}
                <button type="submit" className="self-start rounded-lg bg-maroon-800 px-6.5 py-3 text-[.94rem] font-semibold text-white hover:bg-maroon-600">Kirim Laporan</button>
              </form>
            </Reveal>

            <div className="flex flex-col gap-4.5">
              <Reveal className="rounded-xl border border-maroon-100 bg-maroon-50 p-5.5">
                <div className="mb-3 flex items-center gap-2.5"><Icon name="shield" size={22} className="text-maroon-800" /><h3 className="m-0 text-[1rem]">Jaminan Kerahasiaan</h3></div>
                <p className="text-[.84rem]">Sistem ini dikelola terpisah dari basis data riset dan hanya dapat diakses oleh Inspektorat Kabupaten Buleleng. Identitas pelapor yang memilih anonim tidak dicatat dalam bentuk apa pun.</p>
              </Reveal>
              <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
                <h3 className="mb-3 text-[1rem]">Kanal Alternatif</h3>
                <ul className="m-0 list-none space-y-2.5 p-0 text-[.84rem]">
                  <li className="flex items-start gap-2.5"><Icon name="phone" size={15} className="mt-0.5 flex-none text-maroon-800" />Hotline Inspektorat: (0362) 22140</li>
                  <li className="flex items-start gap-2.5"><Icon name="mail" size={15} className="mt-0.5 flex-none text-maroon-800" />wbs@bulelengkab.go.id</li>
                  <li className="flex items-start gap-2.5"><Icon name="pin" size={15} className="mt-0.5 flex-none text-maroon-800" />Kotak pengaduan fisik, Kantor Inspektorat Kabupaten Buleleng</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <Modal title="Laporan berhasil dikirim" onClose={() => setResult(null)} footer={
          <button type="button" onClick={() => setResult(null)} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600">Tutup</button>
        }>
          <div className="flex items-start gap-3 rounded-xl border border-success-bg bg-success-bg px-4 py-3.5 text-[.855rem] text-[#14532D]">
            <Icon name="checkCircle" size={19} className="mt-0.5 flex-none text-success" />
            <p className="m-0"><strong className="mr-1">Kode pelacakan Anda:</strong><b>{result}</b>. Simpan kode ini untuk memantau tindak lanjut laporan.</p>
          </div>
          <p className="mt-4 text-[.85rem] text-ink-2">Tim Inspektorat akan menindaklanjuti laporan dalam 5 hari kerja. Pada sistem produksi, kode pelacakan dapat digunakan untuk memeriksa status tanpa membuka identitas pelapor.</p>
        </Modal>
      )}
    </>
  );
}
