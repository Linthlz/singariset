import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { INSTITUSI, SKEMA, BIDANG, KECAMATAN, MITRA_SASARAN } from '../data/singaData.js';
import { skemaById, kecById, rupiah, hariMenuju, tanggal, wordCount } from '../lib/format.js';

const DRAFT_KEY = 'singa.draft.kolaborasi';
const DEADLINE = '2025-11-28';
const PLAFON = { 'hibah-daerah': 300000000, insentif: 150000000, kolaboratif: 450000000, mandiri: 25000000, brin: 500000000 };
const MAX_FILE = 10 * 1024 * 1024;

const RPJMD_OPTS = [
  'Peningkatan ketahanan pangan dan kesejahteraan petani',
  'Pariwisata berkelanjutan dan penguatan ekonomi kreatif',
  'Tata kelola pemerintahan digital dan pelayanan publik',
  'Pengelolaan sumber daya kelautan dan pesisir',
  'Peningkatan kualitas pendidikan dan sumber daya manusia',
  'Pelestarian lingkungan hidup dan mitigasi bencana',
  'Pelestarian adat, budaya, dan warisan Buleleng'
];

const SYARAT_UTAMA = [
  'Ketua peneliti ber-NIDN/NIP aktif dan terdata di PDDikti',
  'Objek riset berlokasi di wilayah Kabupaten Buleleng',
  'Melibatkan minimal satu mitra sasaran lokal',
  'Bebas tunggakan laporan riset daerah sebelumnya',
  'Luaran wajib mencakup policy brief dan publikasi ilmiah',
  'Bersedia mengikuti monev berkala hingga diseminasi'
];

const initialForm = {
  namaKetua: '', nidn: '', institusi: '', jabatan: '', email: '', telp: '', anggota: '',
  judul: '', skema: '', bidang: '', kecamatan: '', dana: '', sasaranRpjmd: '', urgensi: '', luaran: '',
  mitra: [], mitraNama: '', manfaat: '',
  paktaOrisinal: false, paktaIntegritas: false, paktaData: false
};

function fmtSize(b) { return b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }

function validate(form, files) {
  const errs = {};
  if (form.namaKetua.trim().length < 3) errs.namaKetua = 'Nama ketua peneliti wajib diisi.';
  const d = form.nidn.replace(/\D/g, '');
  if (d.length !== 10 && d.length !== 18) errs.nidn = 'NIDN harus 10 digit atau NIP harus 18 digit angka.';
  if (!form.institusi) errs.institusi = 'Pilih institusi asal pengusul.';
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim())) errs.email = 'Masukkan alamat surel yang valid.';
  if (form.telp.replace(/\D/g, '').length < 10) errs.telp = 'Nomor telepon aktif wajib diisi (minimal 10 digit).';
  if (form.judul.trim().length < 15) errs.judul = 'Judul riset wajib diisi (minimal 15 karakter).';
  if (!form.skema) errs.skema = 'Pilih skema pendanaan yang dituju.';
  if (!form.bidang) errs.bidang = 'Pilih bidang prioritas riset.';
  if (!form.kecamatan) errs.kecamatan = 'Pilih kecamatan lokasi riset.';
  const dana = Number(form.dana.replace(/\D/g, ''));
  const plafon = PLAFON[form.skema];
  if (!dana) errs.dana = 'Isi usulan dana sesuai plafon skema.';
  else if (plafon && dana > plafon) errs.dana = `Usulan dana melampaui plafon skema (${rupiah(plafon)}).`;
  if (!form.sasaranRpjmd) errs.sasaranRpjmd = 'Pilih satu sasaran RPJMD yang paling relevan.';
  if (wordCount(form.urgensi) < 100) errs.urgensi = 'Uraian urgensi minimal 100 kata.';
  if (form.luaran.trim().split('\n').filter((l) => l.trim()).length < 2) errs.luaran = 'Cantumkan minimal dua luaran riset.';
  if (!form.mitra.length) errs.mitra = 'Pilih minimal satu mitra sasaran riset.';
  if (!files.some((f) => !f.err)) errs.berkas = 'Unggah minimal satu berkas proposal berformat PDF.';
  if (!(form.paktaOrisinal && form.paktaIntegritas && form.paktaData)) errs.pakta = 'Ketiga pernyataan wajib disetujui sebelum pengajuan dikirim.';
  return errs;
}

export default function Kolaborasi() {
  const { isAuth, hasRole } = useAuth();
  const toast = useToast();
  const [params] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [draftInfo, setDraftInfo] = useState('Draf tersimpan di peramban Anda sendiri dan tidak terkirim ke BRIDA sampai tombol kirim ditekan.');
  const [submitting, setSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [gateModal, setGateModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const fileInputRef = useRef(null);
  const firstErrorRef = useRef(null);

  useEffect(() => {
    const skema = params.get('skema');
    if (skema && PLAFON[skema]) setForm((f) => ({ ...f, skema }));
  }, [params]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const o = JSON.parse(raw);
      setForm((f) => ({ ...f, ...o.form }));
      setFiles(o.files || []);
      setDraftInfo(`Draf dipulihkan dari penyimpanan peramban (${tanggal(o.savedAt.slice(0, 10))}). Lanjutkan pengisian atau kosongkan formulir.`);
      toast('info', 'Draf dipulihkan', 'Isian terakhir Anda dimuat kembali dari peramban ini.');
      // eslint-disable-next-line no-empty
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sisaHari = hariMenuju(DEADLINE);
  const urgWords = wordCount(form.urgensi);
  const plafon = PLAFON[form.skema];

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }
  function blurField(name) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  const liveErrors = useMemo(() => validate(form, files), [form, files]);

  function toggleMitra(id) {
    setForm((f) => ({ ...f, mitra: f.mitra.includes(id) ? f.mitra.filter((x) => x !== id) : [...f.mitra, id] }));
  }

  function addFiles(list) {
    const next = [];
    Array.from(list).forEach((f) => {
      const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
      let err = null;
      if (!isPdf) err = 'Ditolak — hanya berkas PDF yang diterima.';
      else if (f.size > MAX_FILE) err = `Ditolak — ukuran ${fmtSize(f.size)} melampaui batas 10 MB.`;
      next.push({ name: f.name, size: f.size, err });
      if (err) toast('danger', 'Berkas ditolak', `${f.name} — ${err}`);
    });
    setFiles((fs) => [...fs, ...next]);
  }

  const GROUPS = [
    { l: 'Identitas pengusul', ok: !liveErrors.namaKetua && !liveErrors.nidn && !liveErrors.institusi && !liveErrors.email && !liveErrors.telp },
    { l: 'Substansi riset & RPJMD', ok: !liveErrors.judul && !liveErrors.skema && !liveErrors.bidang && !liveErrors.kecamatan && !liveErrors.dana && !liveErrors.sasaranRpjmd && !liveErrors.urgensi && !liveErrors.luaran },
    { l: 'Mitra sasaran terpilih', ok: form.mitra.length > 0 },
    { l: 'Berkas proposal terunggah', ok: files.some((f) => !f.err) },
    { l: 'Pakta integritas disetujui', ok: form.paktaOrisinal && form.paktaIntegritas && form.paktaData }
  ];
  const progressPct = Math.round((GROUPS.filter((g) => g.ok).length / GROUPS.length) * 100);

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, files: files.filter((f) => !f.err), savedAt: new Date().toISOString() }));
      setDraftInfo(`Draf tersimpan pada ${new Date().toLocaleTimeString('id-ID')} di peramban Anda. Draf tidak terkirim ke BRIDA sampai tombol kirim ditekan.`);
      toast('success', 'Draf tersimpan', 'Isian formulir disimpan di peramban ini dan akan dipulihkan saat Anda kembali.');
    } catch {
      toast('danger', 'Gagal menyimpan draf', 'Peramban menolak penyimpanan lokal — kemungkinan sedang dalam mode privat.');
    }
  }

  function clearForm() {
    if (!confirm('Kosongkan seluruh isian dan hapus draf tersimpan?')) return;
    setForm(initialForm); setFiles([]); setErrors({}); setTouched({});
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* abaikan */ }
    setDraftInfo('Formulir dikosongkan. Draf tersimpan telah dihapus.');
    toast('info', 'Formulir dikosongkan', 'Seluruh isian dan draf lokal telah dihapus.');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isAuth || !hasRole('mitra', 'admin')) { setGateModal(true); return; }

    setAttemptedSubmit(true);
    const errs = validate(form, files);
    setErrors(errs);
    const errKeys = Object.keys(errs);
    if (errKeys.length) {
      toast('danger', 'Pengajuan belum lengkap', `${errKeys.length} bagian masih perlu diperbaiki. Periksa penanda merah pada formulir.`);
      setTimeout(() => firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* abaikan */ }
      const noReg = `USL-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
      setSuccessModal({ noReg, form, files: files.filter((f) => !f.err) });
      setForm(initialForm); setFiles([]); setErrors({}); setTouched({}); setAttemptedSubmit(false);
      toast('success', 'Pengajuan terkirim', `Nomor registrasi ${noReg} telah dicatat dalam antrean BRIDA.`);
    }, 900);
  }

  function err(name) { return (touched[name] || attemptedSubmit) ? liveErrors[name] : null; }

  return (
    <>
      <section className="relative overflow-hidden bg-maroon-900 py-10 text-white" style={{ backgroundImage: 'linear-gradient(135deg,#7A1616 0%,#6B1414 55%,#3B0A0A 100%)' }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(560px 300px at 92% 12%, rgba(249,199,79,.18), transparent 62%)' }} />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5">
          <nav className="mb-3.5 flex flex-wrap items-center gap-2 text-[.78rem] text-white/60">
            <Link to="/" className="text-white/82 hover:text-gold-500">Beranda</Link><span className="opacity-50">/</span><span>Pengajuan Kolaborasi Riset</span>
          </nav>
          <h1 className="mb-2.5 text-[clamp(1.65rem,3.4vw,2.5rem)] text-white">Pengajuan Kolaborasi Riset Daerah</h1>
          <p className="max-w-[720px] text-white/80">Satu formulir untuk menautkan usulan riset Anda dengan prioritas pembangunan Kabupaten Buleleng, mitra lapangan yang tepat, dan skema pendanaan yang sesuai.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="rounded-full bg-white/14 px-3 py-1.5 text-[.8rem] font-semibold text-white">Batch I Tahun Anggaran 2026</span>
            <span className={`rounded-full px-3 py-1.5 text-[.8rem] font-semibold ${sisaHari > 0 ? 'bg-gold-500 text-[#4A2D00]' : 'bg-danger text-white'}`}>
              {sisaHari > 0 ? `Tenggat 28 November 2025 · ${sisaHari} hari lagi` : 'Batch I telah ditutup — usulan dialihkan ke Batch II'}
            </span>
          </div>
        </div>
      </section>

      <section className="pt-7">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="flex items-start gap-3.5 rounded-xl border border-warning-bg bg-warning-bg px-4.5 py-4 text-[.855rem] text-[#78350F]">
            <Icon name="alert" size={19} className="mt-0.5 flex-none text-warning" />
            <p className="m-0"><strong className="mr-1">Dasar hukum &amp; jadwal batch.</strong>Pengajuan tunduk pada Peraturan Bupati Buleleng tentang Penyelenggaraan Riset dan Inovasi Daerah serta Pedoman Hibah Riset BRIDA 2026.
              {' '}<b>Batch I ditutup 28 November 2025 pukul 23.59 WITA</b>; Batch II dibuka 2 Februari 2026. Usulan yang masuk setelah tenggat otomatis dialihkan ke batch berikutnya.</p>
          </div>
        </div>
      </section>

      <section className="pb-18 pt-7">
        <div className="mx-auto grid max-w-[1240px] gap-6.5 px-5 lg:grid-cols-[1.55fr_.95fr]">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* 2.2 Identitas Pengusul */}
            <Reveal className="rounded-xl border border-line bg-white p-6.5 shadow-card" ref={firstErrorRef}>
              <div className="mb-1.5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-maroon-50 px-2.5 py-1 text-[.715rem] font-bold text-maroon-800">Bagian 1 dari 4</span><span className="text-[.8rem] text-ink-3">Data ini diverifikasi silang dengan pangkalan data PDDikti.</span></div>
              <h2 className="text-[1.22rem]">Identitas Pengusul Riset</h2>
              <hr className="my-4.5 border-line" />

              <div className="grid gap-x-4.5 sm:grid-cols-2">
                <Field label="Nama lengkap ketua peneliti" required error={err('namaKetua')}>
                  <input className="input-base" value={form.namaKetua} onChange={(e) => setField('namaKetua', e.target.value)} onBlur={() => blurField('namaKetua')} placeholder="Lengkap dengan gelar akademik" />
                </Field>
                <Field label="NIDN / NIP" required error={err('nidn')} hint="Format resmi: NIDN 10 digit atau NIP 18 digit, angka saja.">
                  <input className="input-base" value={form.nidn} onChange={(e) => setField('nidn', e.target.value)} onBlur={() => blurField('nidn')} inputMode="numeric" placeholder="10 digit NIDN atau 18 digit NIP" />
                </Field>
                <Field label="Institusi / afiliasi" required error={err('institusi')}>
                  <select className="input-base" value={form.institusi} onChange={(e) => setField('institusi', e.target.value)} onBlur={() => blurField('institusi')}>
                    <option value="">Pilih institusi asal</option>
                    {INSTITUSI.filter((i) => i.tipe !== 'OPD Mitra').map((i) => <option key={i.abbr} value={i.abbr}>{i.nama} ({i.abbr})</option>)}
                    <option value="LAIN">Institusi lain (tulis pada catatan mitra)</option>
                  </select>
                </Field>
                <Field label="Jabatan fungsional">
                  <select className="input-base" value={form.jabatan} onChange={(e) => setField('jabatan', e.target.value)}>
                    <option value="">Pilih jabatan fungsional</option>
                    {['Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar', 'Peneliti Ahli Pertama', 'Peneliti Ahli Muda', 'Peneliti Ahli Madya', 'Lainnya'].map((j) => <option key={j}>{j}</option>)}
                  </select>
                </Field>
                <Field label="Surel institusi" required error={err('email')}>
                  <input className="input-base" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} onBlur={() => blurField('email')} placeholder="nama@kampus.ac.id" />
                </Field>
                <Field label="Nomor telepon / WhatsApp" required error={err('telp')}>
                  <input className="input-base" type="tel" value={form.telp} onChange={(e) => setField('telp', e.target.value)} onBlur={() => blurField('telp')} placeholder="08xx-xxxx-xxxx" />
                </Field>
              </div>

              <Field label="Anggota tim peneliti" hint="Maksimal 4 anggota dosen dan 3 mahasiswa untuk skema hibah daerah.">
                <textarea className="input-base min-h-[96px]" value={form.anggota} onChange={(e) => setField('anggota', e.target.value)}
                  placeholder={'Satu nama per baris, lengkap dengan NIDN/NIM dan peran. Contoh:\nDr. Ni Luh Pastini, M.Cs. — 0021078502 — Anggota (analisis data)'} />
              </Field>
            </Reveal>

            {/* 2.3 Substansi Riset */}
            <Reveal className="rounded-xl border border-line bg-white p-6.5 shadow-card">
              <div className="mb-1.5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-maroon-50 px-2.5 py-1 text-[.715rem] font-bold text-maroon-800">Bagian 2 dari 4</span><span className="text-[.8rem] text-ink-3">Menentukan indikator pertama penilaian tim pakar.</span></div>
              <h2 className="text-[1.22rem]">Substansi Riset &amp; Relevansi RPJMD</h2>
              <hr className="my-4.5 border-line" />

              <Field label="Judul riset yang diusulkan" required error={err('judul')}>
                <textarea className="input-base min-h-[78px]" value={form.judul} onChange={(e) => setField('judul', e.target.value)} onBlur={() => blurField('judul')} placeholder="Judul lengkap, spesifik menyebut objek dan lokasi riset di Kabupaten Buleleng" />
              </Field>

              <div className="grid gap-x-4.5 sm:grid-cols-2">
                <Field label="Skema pendanaan" required error={err('skema')}>
                  <select className="input-base" value={form.skema} onChange={(e) => setField('skema', e.target.value)} onBlur={() => blurField('skema')}>
                    <option value="">Pilih skema pendanaan</option>
                    {SKEMA.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
                  </select>
                </Field>
                <Field label="Bidang prioritas" required error={err('bidang')}>
                  <select className="input-base" value={form.bidang} onChange={(e) => setField('bidang', e.target.value)} onBlur={() => blurField('bidang')}>
                    <option value="">Pilih bidang prioritas</option>
                    {BIDANG.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
                  </select>
                </Field>
                <Field label="Lokasi pelaksanaan" required error={err('kecamatan')}>
                  <select className="input-base" value={form.kecamatan} onChange={(e) => setField('kecamatan', e.target.value)} onBlur={() => blurField('kecamatan')}>
                    <option value="">Pilih kecamatan pelaksanaan</option>
                    {KECAMATAN.map((k) => <option key={k.id} value={k.id}>{k.nama} — {k.fokus}</option>)}
                    <option value="lintas">Lintas kecamatan (kabupaten)</option>
                  </select>
                </Field>
                <Field label="Usulan dana (Rp)" required error={err('dana')} hint={plafon ? `Plafon maksimal skema ini: ${rupiah(plafon)} per judul riset.` : 'Plafon menyesuaikan skema yang dipilih.'}>
                  <input className="input-base" inputMode="numeric" value={form.dana}
                    onChange={(e) => setField('dana', e.target.value.replace(/\D/g, '') ? Number(e.target.value.replace(/\D/g, '')).toLocaleString('id-ID') : '')}
                    onBlur={() => blurField('dana')} placeholder="Contoh: 175.000.000" />
                </Field>
              </div>

              <Field label="Sasaran RPJMD Buleleng 2025–2029 yang dituju" required error={err('sasaranRpjmd')}>
                <select className="input-base" value={form.sasaranRpjmd} onChange={(e) => setField('sasaranRpjmd', e.target.value)} onBlur={() => blurField('sasaranRpjmd')}>
                  <option value="">Pilih sasaran pembangunan daerah</option>
                  {RPJMD_OPTS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>

              <Field label="Urgensi & keterhubungan dengan kebutuhan daerah" required error={err('urgensi')}>
                <textarea className="input-base min-h-[170px]" value={form.urgensi} onChange={(e) => setField('urgensi', e.target.value)} onBlur={() => blurField('urgensi')}
                  placeholder="Jelaskan persoalan lapangan yang hendak dipecahkan, siapa yang dirugikan bila dibiarkan, mengapa riset ini mendesak bagi Kabupaten Buleleng, dan bagaimana hasilnya akan dipakai oleh OPD atau komunitas sasaran." />
                <div className="mt-1.5 flex justify-between">
                  <span className="text-[.78rem] text-ink-3">Minimal 100 kata. Bagian ini menjadi bahan telaah substansi tim pakar.</span>
                  <span className={`text-[.76rem] font-semibold tabular-nums ${urgWords >= 100 ? 'text-success' : urgWords > 0 ? 'text-warning' : 'text-ink-3'}`}>
                    {urgWords} kata{urgWords < 100 ? ` — kurang ${100 - urgWords}` : ' — memenuhi syarat'}
                  </span>
                </div>
              </Field>

              <Field label="Luaran yang dijanjikan" required error={err('luaran')} hint="Wajib mencakup minimal satu policy brief dan satu publikasi ilmiah.">
                <textarea className="input-base min-h-[100px]" value={form.luaran} onChange={(e) => setField('luaran', e.target.value)} onBlur={() => blurField('luaran')}
                  placeholder={'Satu luaran per baris. Contoh:\nPolicy brief rekomendasi pola tanam adaptif\nArtikel jurnal terakreditasi SINTA 2'} />
              </Field>
            </Reveal>

            {/* 2.4 Mitra Sasaran */}
            <Reveal className="rounded-xl border border-line bg-white p-6.5 shadow-card">
              <div className="mb-1.5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-maroon-50 px-2.5 py-1 text-[.715rem] font-bold text-maroon-800">Bagian 3 dari 4</span><span className="text-[.8rem] text-ink-3">Pilih satu atau lebih penerima manfaat riset.</span></div>
              <h2 className="text-[1.22rem]">Pemilihan Mitra Sasaran</h2>
              <hr className="my-4.5 border-line" />

              <div className="grid gap-2.5 sm:grid-cols-2">
                {MITRA_SASARAN.map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[.86rem] transition ${form.mitra.includes(m.id) ? 'border-maroon-800 bg-maroon-50' : 'border-line hover:border-line-strong hover:bg-surface-1'}`}>
                    <input type="checkbox" className="mt-0.5 h-4 w-4 flex-none accent-maroon-800" checked={form.mitra.includes(m.id)} onChange={() => toggleMitra(m.id)} />
                    <span><span className="block font-semibold text-ink">{m.nama}</span><span className="block text-[.77rem] text-ink-3">{m.sub}</span></span>
                  </label>
                ))}
              </div>
              {err('mitra') && <p className="mt-2 text-[.78rem] font-semibold text-danger">{err('mitra')}</p>}

              <div className="mt-4.5 grid gap-x-4.5 sm:grid-cols-2">
                <Field label="Nama mitra spesifik yang sudah dijajaki" hint="Kosongkan bila Anda meminta BRIDA menjodohkan dengan mitra yang sesuai.">
                  <input className="input-base" value={form.mitraNama} onChange={(e) => setField('mitraNama', e.target.value)} placeholder="Contoh: Subak Padanggalak, Pokdarwis Kalibukbuk" />
                </Field>
                <Field label="Perkiraan penerima manfaat langsung">
                  <input className="input-base" value={form.manfaat} onChange={(e) => setField('manfaat', e.target.value)} placeholder="Contoh: 120 petani di 3 tempek subak" />
                </Field>
              </div>
            </Reveal>

            {/* 2.5 Unggah Berkas */}
            <Reveal className="rounded-xl border border-line bg-white p-6.5 shadow-card">
              <div className="mb-1.5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-maroon-50 px-2.5 py-1 text-[.715rem] font-bold text-maroon-800">Bagian 4 dari 4</span><span className="text-[.8rem] text-ink-3">Berkas PDF, maksimal 10 MB per dokumen.</span></div>
              <h2 className="text-[1.22rem]">Berkas Proposal &amp; Pakta Integritas</h2>
              <hr className="my-4.5 border-line" />

              <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
                <span className="max-w-[56ch] text-[.8rem] text-ink-3">Gunakan template resmi agar sistematika proposal sesuai pedoman penilaian tim pakar BRIDA.</span>
                <button type="button" onClick={() => toast('info', 'Template disiapkan', 'Template Dokumen Usulan Resmi BRIDA (.docx) akan diunduh dari repositori dokumen BRIDA pada sistem produksi.')}
                  className="rounded-lg border border-line-strong px-3.5 py-2 text-[.82rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                  Unduh Template Usulan (.docx)
                </button>
              </div>

              <div
                role="button" tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-7.5 text-center transition ${dragOver ? 'border-maroon-600 bg-maroon-50' : 'border-line-strong bg-surface-1 hover:border-maroon-600 hover:bg-maroon-50'}`}
              >
                <Icon name="upload" size={42} className="mx-auto mb-2.5 text-maroon-600" />
                <div className="mb-0.5 font-bold text-ink">Seret berkas ke sini atau klik untuk memilih</div>
                <div className="text-[.8rem] text-ink-3">Proposal lengkap, RAB, surat pernyataan mitra · PDF · maksimal 10 MB per berkas</div>
              </div>
              <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

              {files.length > 0 && (
                <ul className="m-0 mt-3.5 flex list-none flex-col gap-2 p-0">
                  {files.map((f, i) => (
                    <li key={i} className={`flex items-center gap-2.75 rounded-lg border p-2.75 text-[.84rem] ${f.err ? 'border-danger bg-[#FFFBFB]' : 'border-line bg-white'}`}>
                      <span className={f.err ? 'text-danger' : 'text-maroon-800'}><Icon name={f.err ? 'alert' : 'doc'} size={18} /></span>
                      <div className="min-w-0 flex-1"><div className="truncate font-semibold text-ink">{f.name}</div><div className="text-[.74rem] text-ink-3">{f.err || `${fmtSize(f.size)} · PDF · siap dikirim`}</div></div>
                      <button type="button" onClick={() => setFiles((fs) => fs.filter((_, idx) => idx !== i))} aria-label={`Hapus berkas ${f.name}`} className="rounded-md p-1.25 text-ink-3 hover:bg-danger-bg hover:text-danger">
                        <Icon name="trash" size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {err('berkas') && (
                <p className="mt-2 text-[.78rem] font-semibold text-danger">{err('berkas')}</p>
              )}

              <hr className="my-4.5 border-line" />

              <div className="flex flex-col gap-2.5">
                {[
                  ['paktaOrisinal', 'Pernyataan orisinalitas', 'Usulan ini karya asli tim peneliti, bebas plagiarisme, dan belum/tidak sedang didanai skema lain untuk objek yang sama.'],
                  ['paktaIntegritas', 'Pakta integritas & komitmen', 'Bersedia mengikuti seluruh tahapan monev, menyampaikan logbook berkala, dan menyerahkan SPJ sesuai jadwal kontrak riset.'],
                  ['paktaData', 'Persetujuan tata kelola data', 'Menyetujui bahwa data dan luaran riset yang dibiayai daerah dapat dipublikasikan BRIDA setelah masa embargo hak paten berakhir.']
                ].map(([key, title, sub]) => (
                  <label key={key} className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[.86rem] transition ${form[key] ? 'border-maroon-800 bg-maroon-50' : 'border-line hover:bg-surface-1'}`}>
                    <input type="checkbox" className="mt-0.5 h-4 w-4 flex-none accent-maroon-800" checked={form[key]} onChange={(e) => setField(key, e.target.checked)} />
                    <span><span className="block font-semibold text-ink">{title}</span><span className="block text-[.77rem] text-ink-3">{sub}</span></span>
                  </label>
                ))}
                {err('pakta') && <p className="text-[.78rem] font-semibold text-danger">{err('pakta')}</p>}
              </div>

              <hr className="my-4.5 border-line" />

              <div className="flex flex-wrap gap-2.5">
                <button type="submit" disabled={submitting} className="rounded-lg bg-maroon-800 px-6.5 py-3.25 text-[.96rem] font-semibold text-white transition hover:bg-maroon-600 disabled:opacity-50">
                  {submitting ? 'Mengirim ke antrean BRIDA…' : 'Kirim Pengajuan Kolaborasi'}
                </button>
                <button type="button" onClick={saveDraft} className="rounded-lg border border-line-strong bg-white px-6.5 py-3.25 text-[.96rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                  Simpan sebagai Draf
                </button>
                <button type="button" onClick={clearForm} className="rounded-lg px-4 py-3.25 text-[.85rem] font-semibold text-ink-2 hover:bg-surface-1">
                  Kosongkan formulir
                </button>
              </div>
              <p className="mt-2.5 text-[.79rem] text-ink-3">{draftInfo}</p>
            </Reveal>
          </form>

          {/* 2.6 Panel Informasi */}
          <aside className="flex flex-col gap-4.5 lg:sticky lg:top-23 lg:self-start">
            <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
              <h3 className="text-[1rem]">Kelengkapan pengajuan</h3>
              <div className="mt-2.5 flex justify-between text-[.78rem] font-semibold text-ink-3"><span>Progres pengisian</span><b className="text-ink">{progressPct}%</b></div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-line"><div className={`h-full rounded-full transition-all ${progressPct === 100 ? 'bg-success' : 'bg-maroon-800'}`} style={{ width: `${progressPct}%` }} /></div>
              <ul className="m-0 mt-3.5 flex list-none flex-col gap-2 p-0 text-[.83rem]">
                {GROUPS.map((g) => (
                  <li key={g.l} className={`flex items-start gap-2.25 ${g.ok ? 'text-success' : 'text-ink-3'}`}>
                    <Icon name={g.ok ? 'checkCircle' : 'info'} size={16} className="mt-0.5 flex-none" />
                    <span className={g.ok ? 'font-semibold text-ink' : 'text-ink-3'}>{g.l}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
              <h3 className="text-[1rem]">Alur verifikasi 4 tahap</h3>
              <ol className="m-0 mt-3.5 list-none space-y-4.5 p-0 text-[.855rem]">
                {[
                  ['Verifikasi administrasi', 'Pemeriksaan kelengkapan berkas, keabsahan NIDN/NIP, dan kepatuhan format oleh Subbag Perencanaan BRIDA.', '3 hari kerja.'],
                  ['Telaah substansi & kesesuaian roadmap', 'Penilaian relevansi terhadap Peta Jalan Riset Daerah dan sasaran RPJMD oleh tim pakar.', '5 hari kerja.'],
                  ['Klirens etik & orisinalitas', 'Pemeriksaan kelayakan etik riset serta uji kemiripan naskah oleh Komite Klirens Etik Buleleng.', '4 hari kerja.'],
                  ['Penetapan & kontrak', 'Pengumuman penerima, penandatanganan SPK, dan pencairan termin I.', '2 hari kerja.']
                ].map(([t, d, dur], i) => (
                  <li key={t} className="relative pl-9">
                    <span className="absolute left-0 top-[-1px] grid h-7 w-7 place-items-center rounded-full bg-maroon-800 text-[.78rem] font-extrabold text-white">{i + 1}</span>
                    <strong className="block text-ink">{t}</strong>{d} <em className="text-ink-3">{dur}</em>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-success-bg bg-success-bg px-4 py-3.5 text-[.855rem] text-[#14532D]">
                <Icon name="checkCircle" size={19} className="mt-0.5 flex-none text-success" />
                <p className="m-0"><strong className="mr-1">Total maksimal 14 hari kerja.</strong>Dipangkas dari 30 hari sejak seluruh telaah dilakukan secara digital.</p>
              </div>
            </Reveal>

            <Reveal className="rounded-xl border border-line bg-white p-5.5 shadow-card">
              <h3 className="text-[1rem]">Syarat utama pengusul</h3>
              <ul className="m-0 mt-3.5 list-none space-y-1.5 p-0 text-[.81rem]">
                {SYARAT_UTAMA.map((s) => <li key={s} className="flex items-start gap-2 text-ink-2"><Icon name="check" size={14} className="mt-0.5 flex-none text-success" />{s}</li>)}
              </ul>
            </Reveal>

            <Reveal className="rounded-xl border border-maroon-100 bg-maroon-50 p-5.5">
              <h3 className="text-[1rem]">Hotline layanan riset BRIDA</h3>
              <p className="mb-3 text-[.84rem]">Kesulitan mengisi formulir atau butuh klarifikasi skema pendanaan? Hubungi petugas layanan kami pada jam kerja.</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[.84rem]">
                <dt className="font-semibold text-ink-3">Telepon</dt><dd className="m-0 font-semibold">(0362) 21985</dd>
                <dt className="font-semibold text-ink-3">WhatsApp</dt><dd className="m-0 font-semibold">0811-3900-xxx</dd>
                <dt className="font-semibold text-ink-3">Surel</dt><dd className="m-0 font-semibold">riset@bulelengkab.go.id</dd>
                <dt className="font-semibold text-ink-3">Jam layanan</dt><dd className="m-0 font-semibold">Senin–Jumat, 08.00–15.00 WITA</dd>
              </dl>
            </Reveal>
          </aside>
        </div>
      </section>

      {gateModal && (
        <Modal title="Masuk sebagai mitra diperlukan" onClose={() => setGateModal(false)} footer={
          <>
            <Link to="/register" onClick={() => setGateModal(false)}
              className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-maroon-800 no-underline hover:bg-maroon-50">
              Daftar akun mitra
            </Link>
            <Link to="/login?next=/kolaborasi" onClick={() => setGateModal(false)}
              className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-maroon-600">
              Masuk ke akun
            </Link>
          </>
        }>
          <div className="flex items-start gap-3 rounded-xl border border-warning-bg bg-warning-bg px-4 py-3.5 text-[.855rem] text-[#78350F]">
            <Icon name="lock" size={19} className="mt-0.5 flex-none text-warning" />
            <p className="m-0">
              <strong className="mr-1">Akses terbatas.</strong>
              {isAuth
                ? 'Pengiriman usulan riset hanya tersedia untuk akun Mitra / Instansi. Akun perangkat daerah memakai dashboard monitoring dan evaluasi.'
                : 'Pengiriman usulan riset hanya tersedia bagi akun Mitra / Instansi yang telah terdaftar.'}
            </p>
          </div>
          <p className="mt-4">
            Isian yang sudah Anda ketik tetap tersimpan. Gunakan tombol <b>Simpan sebagai Draf</b> bila ingin
            melanjutkan pengisian setelah masuk ke akun.
          </p>
        </Modal>
      )}

      {successModal && (
        <Modal title="Pengajuan berhasil dikirim" wide onClose={() => setSuccessModal(null)} footer={
          <>
            <Link to="/riset" onClick={() => setSuccessModal(null)} className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-maroon-800 no-underline hover:bg-maroon-50">Jelajahi direktori riset</Link>
            <Link to="/" onClick={() => setSuccessModal(null)} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-maroon-600">Kembali ke beranda</Link>
          </>
        }>
          <div className="flex items-start gap-3 rounded-xl border border-success-bg bg-success-bg px-4 py-3.5 text-[.855rem] text-[#14532D]">
            <Icon name="checkCircle" size={19} className="mt-0.5 flex-none text-success" />
            <p className="m-0"><strong className="mr-1">Usulan masuk antrean verifikasi.</strong>Nomor registrasi Anda: <b>{successModal.noReg}</b>. Simpan nomor ini untuk melacak status pengajuan.</p>
          </div>
          <dl className="my-4.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.75 text-[.845rem]">
            <dt className="font-semibold text-ink-3">Judul riset</dt><dd className="m-0 font-semibold">{successModal.form.judul}</dd>
            <dt className="font-semibold text-ink-3">Ketua peneliti</dt><dd className="m-0 font-semibold">{successModal.form.namaKetua} · {successModal.form.institusi}</dd>
            <dt className="font-semibold text-ink-3">Skema</dt><dd className="m-0 font-semibold">{skemaById(successModal.form.skema).nama}</dd>
            <dt className="font-semibold text-ink-3">Usulan dana</dt><dd className="m-0 font-semibold">Rp {successModal.form.dana}</dd>
            <dt className="font-semibold text-ink-3">Lokasi</dt><dd className="m-0 font-semibold">{successModal.form.kecamatan === 'lintas' ? 'Lintas kecamatan' : kecById(successModal.form.kecamatan).nama}</dd>
            <dt className="font-semibold text-ink-3">Mitra sasaran</dt><dd className="m-0 font-semibold">{successModal.form.mitra.map((m) => MITRA_SASARAN.find((x) => x.id === m)?.nama).join(', ')}</dd>
            <dt className="font-semibold text-ink-3">Berkas</dt><dd className="m-0 font-semibold">{successModal.files.length} dokumen PDF terunggah</dd>
          </dl>
          <h4>Tahap berikutnya</h4>
          <ol className="m-0 mt-3 list-none space-y-3 p-0 text-[.85rem]">
            {['Verifikasi administrasi — hasil dikirim ke surel dalam 3 hari kerja.',
              'Telaah substansi — tim pakar menilai kesesuaian roadmap dan metodologi.',
              'Klirens etik — pemeriksaan kelayakan etik dan uji orisinalitas naskah.',
              'Penetapan — pengumuman penerima dan penandatanganan kontrak riset.'].map((s, i) => (
              <li key={i} className="relative pl-8"><span className="absolute left-0 top-[-1px] grid h-6.5 w-6.5 place-items-center rounded-full bg-maroon-800 text-[.74rem] font-extrabold text-white">{i + 1}</span>{s}</li>
            ))}
          </ol>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-info-bg bg-info-bg px-4 py-3.5 text-[.855rem] text-[#1E3A8A]">
            <Icon name="info" size={19} className="mt-0.5 flex-none text-info" />
            <p className="m-0"><strong className="mr-1">Catatan prototipe.</strong>Payload pengajuan pada versi ini tidak dikirim ke server. Pada implementasi produksi, data diteruskan ke sistem antrean verifikasi BRIDA dan terhubung autentikasi PDDikti.</p>
          </div>
        </Modal>
      )}
    </>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="mb-4.5">
      <label className="mb-1.5 block text-[.84rem] font-semibold text-ink">{label} {required && <span className="text-maroon-600">*</span>}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[.78rem] text-ink-3">{hint}</p>}
      {error && <p className="mt-1.5 text-[.78rem] font-semibold text-danger">{error}</p>}
    </div>
  );
}
