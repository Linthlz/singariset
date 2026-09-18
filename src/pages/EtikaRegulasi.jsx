import { useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';

const KLIRENS = [
  { t: 'Ruang Lingkup Klirens Etik', d: 'Setiap riset yang melibatkan subjek manusia, data pribadi masyarakat, sumber daya hayati, atau kearifan lokal (awig-awig, tradisi adat) wajib memperoleh surat keterangan lolos kaji etik dari Komite Klirens Etik Riset Buleleng sebelum pengumpulan data lapangan dimulai.' },
  { t: 'Susunan Komite', d: 'Komite beranggotakan 7 pakar lintas disiplin: metodologi penelitian, hukum, kesehatan masyarakat, sosial-budaya, dan perwakilan adat Buleleng. Masa tugas komite 2 tahun dan dapat diperpanjang satu periode.' },
  { t: 'Prosedur Pengajuan', d: 'Peneliti mengunggah protokol riset, instrumen pengumpulan data, formulir persetujuan (informed consent), dan rencana mitigasi risiko melalui portal ini. Telaah komite berlangsung maksimal 10 hari kerja sejak berkas dinyatakan lengkap.' },
  { t: 'Sanksi Pelanggaran', d: 'Riset yang terbukti melanggar prinsip etik, termasuk pengumpulan data tanpa persetujuan, eksploitasi kearifan lokal tanpa kompensasi wajar, atau manipulasi data, dapat dikenai penghentian kontrak, pengembalian dana, dan pencatatan pada daftar hitam pengusul riset daerah.' }
];

const SOP = [
  { t: 'Termin Pencairan Dana', d: 'Pencairan dilakukan dalam 3 termin: 40% pada penandatanganan kontrak, 40% pada laporan kemajuan 50% tervalidasi, dan 20% pada laporan akhir serta luaran wajib terverifikasi.' },
  { t: 'Kelengkapan SPJ', d: 'Surat Pertanggungjawaban (SPJ) memuat kuitansi asli bermeterai, faktur pembelian, daftar hadir kegiatan, dan rekapitulasi honorarium sesuai standar biaya masukan daerah. SPJ diunggah maksimal 14 hari kerja setelah dana termin diterima.' },
  { t: 'Verifikasi Keuangan', d: 'Tim keuangan BRIDA memverifikasi kewajaran realisasi terhadap Rencana Anggaran Biaya (RAB) awal. Deviasi di atas 15% pada satu pos anggaran wajib disertai revisi RAB yang disetujui pengelola program.' },
  { t: 'Retur &amp; Sisa Dana', d: 'Sisa dana yang tidak terserap pada akhir kontrak dikembalikan ke kas daerah maksimal 7 hari kerja setelah laporan akhir disahkan, disertai bukti setor yang diunggah ke portal.' }
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
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            aria-hidden={open !== i}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="border-t border-line px-5 pb-5 pt-4 text-[.87rem] leading-relaxed text-ink-2">{it.d}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EtikaRegulasi() {
  return (
    <>
      <PageHero
        crumb="Etika & Regulasi"
        title="Tata Kelola & Kebijakan Riset"
        lead="Pedoman klirens etik, standar operasional pencairan dana, dan kebijakan riset yang menjadi acuan ekosistem riset Kabupaten Buleleng."
        badges={[
          <span key="1" className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">Perbup Riset & Inovasi Daerah</span>,
          <span key="2" className="rounded-full bg-gold-500 px-3 py-1.5 text-[.8rem] font-semibold text-[#4A2D00]">Pedoman Hibah Riset BRIDA 2026</span>
        ]}
      />

      <section id="klirens" className="scroll-mt-24 py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">5.1 Klirens Etik</span>
            <h2 className="text-[1.6rem]">Pedoman Komite Klirens Etik Riset Buleleng</h2>
            <p className="mb-0 text-ink-2">Menjaga agar setiap riset yang melibatkan masyarakat, data pribadi, atau kearifan lokal Buleleng dilakukan secara etis, aman, dan menghormati hak subjek riset.</p>
          </Reveal>
          <Reveal><Accordion items={KLIRENS} /></Reveal>
        </div>
      </section>

      <section id="sop" className="scroll-mt-24 bg-surface-1 py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-6 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">5.2 SOP Keuangan</span>
            <h2 className="text-[1.6rem]">Standar Operasional Prosedur Pencairan Dana &amp; SPJ</h2>
            <p className="mb-0 text-ink-2">Memastikan akuntabilitas setiap rupiah dana riset daerah, dari pencairan termin hingga pertanggungjawaban dan pengembalian sisa dana.</p>
          </Reveal>
          <Reveal><Accordion items={SOP} /></Reveal>
        </div>
      </section>

      <section id="dokumen-kebijakan" className="scroll-mt-24 bg-surface-1 py-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <Reveal className="mb-7 max-w-[720px]">
            <span className="mb-3 inline-flex items-center gap-2 text-[.74rem] font-bold uppercase tracking-widest text-maroon-600 before:h-0.5 before:w-5.5 before:rounded-full before:bg-gold-500">5.3 Dokumen Kebijakan</span>
            <h2 className="text-[1.6rem]">Aturan &amp; kebijakan riset BRIDA</h2>
            <p className="mb-0 text-ink-2">Unduh dokumen resmi yang memuat aturan, standar pelaksanaan, dan kebijakan riset sebagai acuan peneliti dan mitra BRIDA Kabupaten Buleleng.</p>
          </Reveal>

          <Reveal className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 flex-none place-items-center rounded-xl bg-maroon-50 text-maroon-800">
                  <Icon name="doc" size={28} />
                </span>
                <div>
                  <h3 className="mb-1 text-[1.05rem]">Kebijakan Riset BRIDA Kabupaten Buleleng</h3>
                  <p className="mb-3 text-[.85rem] text-ink-2">Aturan dan kebijakan penyelenggaraan riset daerah</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[.76rem] font-semibold text-ink-3">
                    <span>Format PDF</span>
                    <span>Dokumen resmi BRIDA</span>
                  </div>
                </div>
              </div>
              <a
                href="/documents/kebijakan-riset-brida.pdf"
                download="kebijakan-riset-brida.pdf"
                className="inline-flex flex-none items-center justify-center gap-2 rounded-lg bg-maroon-800 px-4 py-3 text-[.84rem] font-bold text-white transition hover:bg-maroon-600 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
              >
                <Icon name="download" size={17} />
                Unduh dokumen
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
