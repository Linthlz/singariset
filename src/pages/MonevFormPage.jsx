import { useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useMyMonevEntries } from '../hooks/useMonev.js';
import { errorMessage } from '../services/api.js';
import { monevService } from '../services/monevService.js';

const EMPTY_REKOMENDASI = {
  monitoring: '',
  uraian: '',
  kendala: '',
  manfaat: '',
  fileName: '',
  fileSize: ''
};

const MAX_FILE = 20 * 1024 * 1024;

/** Jawaban awal poin: diisi dari data sebelumnya bila OPD pernah mengisi. */
function jawabanAwal(point) {
  return {
    ...EMPTY_REKOMENDASI,
    monitoring: point.terisi ? point.monitoring : '',
    uraian: point.uraian,
    kendala: point.kendala,
    manfaat: point.manfaat,
    fileName: point.fileName
  };
}

function Shell({ tahun, children }) {
  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white sm:rounded-[26px] shadow-[0_14px_45px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-[#6b1414] via-[#7f1d1d] to-[#8b2a2a] px-4 py-5 text-white sm:px-8 sm:py-6 lg:px-10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-100">Monitoring & Evaluasi</p>
              {tahun && (
                <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-50">
                  Tahun {tahun}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              FORM MONEV HASIL RISET/KAJIAN{tahun ? ` TAHUN ${tahun}` : ''}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-red-50/90 sm:text-base">
              Form ini digunakan untuk memantau tindak lanjut rekomendasi hasil riset atau kajian yang telah ditetapkan oleh instansi terkait.
            </p>
          </div>
          <div className="px-4 py-5 sm:px-8 sm:py-6 lg:px-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Pesan({ judul, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
      <h2 className="m-0 text-lg font-bold text-slate-800">{judul}</h2>
      <p className="mb-0 mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}

export default function MonevFormPage() {
  const { data, loading, error, reload } = useMyMonevEntries();
  const entries = (data || []).filter((e) => e.batch?.status === 'open' && e.status !== 'verified' && e.kajian.length);

  if (loading && !data) return <Shell><p className="m-0 text-sm text-slate-500">Memuat data Monev…</p></Shell>;
  if (error && !data) {
    const tanpaOpd = error.status === 400;
    return (
      <Shell>
        <Pesan judul={tanpaOpd ? 'Akun belum terhubung ke OPD' : 'Data Monev gagal dimuat'}>
          {tanpaOpd ? 'Form Monev hanya dapat diisi oleh akun OPD yang terdaftar. Hubungi Administrator atau Pegawai BRIDA.' : errorMessage(error)}
        </Pesan>
        {!tanpaOpd && <div className="mt-4 text-center"><button type="button" onClick={reload} className="rounded-xl bg-[#8b2a2a] px-5 py-2.5 text-sm font-semibold text-white">Coba lagi</button></div>}
      </Shell>
    );
  }
  if (!entries.length) {
    return (
      <Shell>
        <Pesan judul="Belum ada form Monev yang dibuka">
          Form Monev akan tersedia setelah BRIDA membuka batch Monev dan menambahkan kajian untuk OPD Anda. Laporan yang sudah diverifikasi dapat dilihat di menu Riwayat Monev.
        </Pesan>
      </Shell>
    );
  }
  return <MonevForm key={entries.map((e) => e.id).join()} entries={entries} onSubmitted={reload} />;
}

function MonevForm({ entries, onSubmitted }) {
  const { user } = useAuth();
  const [entryId, setEntryId] = useState(entries[0].id);
  const entry = entries.find((e) => e.id === entryId) || entries[0];
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => ({ nama: entry.nama || user?.nama || '', nip: entry.nip || '', judul: '', rekomendasi: [] }));
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRefs = useRef({});

  const selectedTitle = useMemo(() => entry.kajian.find((item) => item.id === form.judul) || null, [form.judul, entry]);

  const pilihEntry = (id) => {
    const next = entries.find((e) => e.id === id);
    setEntryId(id);
    setFiles({});
    setForm((prev) => ({ ...prev, nama: next?.nama || prev.nama, nip: next?.nip || prev.nip, judul: '', rekomendasi: [] }));
  };

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'judul') {
        const title = entry.kajian.find((item) => item.id === value);
        next.rekomendasi = title?.rekomendasi.map(jawabanAwal) || [];
      }
      return next;
    });
    if (field === 'judul') setFiles({});
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateRecommendation = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      rekomendasi: prev.rekomendasi.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item)
    }));
    setErrors((prev) => ({ ...prev, [`rekomendasi-${index}-${field}`]: '' }));
  };

  const validateRequired = (fields) => {
    const nextErrors = {};
    fields.forEach((field) => {
      const value = form[field];
      if (!value || (typeof value === 'string' && !value.trim())) nextErrors[field] = 'Field ini wajib diisi.';
    });
    if (fields.includes('nip') && form.nip.trim() && !/^\d{18}$/.test(form.nip.replace(/\s/g, ''))) nextErrors.nip = 'NIP harus 18 digit angka.';
    return nextErrors;
  };

  const handleNext = () => {
    const nextErrors = validateRequired(step === 1 ? ['nama', 'nip'] : ['judul']);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFileChange = (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE) {
      setErrors((prev) => ({ ...prev, [`file-${index}`]: 'Ukuran file maksimal 20 MB.' }));
      event.target.value = '';
      return;
    }
    setErrors((prev) => ({ ...prev, [`file-${index}`]: '' }));
    setFiles((prev) => ({ ...prev, [selectedTitle.rekomendasi[index].id]: file }));
    setForm((prev) => ({
      ...prev,
      rekomendasi: prev.rekomendasi.map((item, itemIndex) => itemIndex === index ? {
        ...item,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      } : item)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    form.rekomendasi.forEach((item, index) => {
      ['monitoring', 'uraian', 'kendala', 'manfaat'].forEach((field) => {
        if (!item[field] || !item[field].trim()) nextErrors[`rekomendasi-${index}-${field}`] = 'Field ini wajib diisi.';
      });
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSending(true);
    try {
      await monevService.fillRepresentative(entry.id, form.nama, form.nip.replace(/\s/g, ''));
      const points = selectedTitle.rekomendasi.map((point, index) => ({ ...point, ...form.rekomendasi[index], fileName: point.fileName }));
      await monevService.savePoints(points, files);
      await monevService.submitEntry(entry.id);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: errorMessage(err) });
    } finally {
      setSending(false);
    }
  };

  const renderInputError = (field) =>
    errors[field] ? <p className="mt-1 text-xs font-medium text-red-600">{errors[field]}</p> : null;

  return (
    <Shell tahun={entry.batch?.tahun}>
      <div className="mb-6 flex flex-wrap gap-3 sm:mb-8">
        {[1, 2, 3].map((item) => {
          const active = item === step;
          const complete = item < step;
          return (
            <div key={item} className="flex items-center gap-2">
              <div className={[
                'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition',
                active ? 'border-[#8b2a2a] bg-[#8b2a2a] text-white shadow-md' : complete ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-slate-100 text-slate-500'
              ].join(' ')}>
                {complete ? '✓' : item}
              </div>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:inline-block">
                {item === 1 ? 'Data diri' : item === 2 ? 'Judul riset' : 'Poin rekomendasi'}
              </span>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <section className="space-y-6">
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                {entries.length > 1 && (
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Batch Monev</label>
                    <select value={entry.id} onChange={(e) => pilihEntry(e.target.value)} className="input-base">
                      {entries.map((e) => <option key={e.id} value={e.id}>{e.batch?.tahun} · {e.batch?.judul}</option>)}
                    </select>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Lengkap <span className="text-red-600">*</span>
                  </label>
                  <input type="text" value={form.nama} onChange={(e) => updateField('nama', e.target.value)} className="input-base"
                    placeholder="Masukkan nama lengkap" aria-invalid={Boolean(errors.nama)} />
                  {renderInputError('nama')}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nomor Induk Pegawai (NIP) <span className="text-red-600">*</span>
                  </label>
                  <input type="text" inputMode="numeric" value={form.nip} onChange={(e) => updateField('nip', e.target.value)} className="input-base"
                    placeholder="Contoh: 198812342024021001" aria-invalid={Boolean(errors.nip)} />
                  {renderInputError('nip')}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Nama OPD</label>
                  <input type="text" value={entry.opd.nama} className="input-base" disabled />
                  <p className="mt-1 text-xs text-slate-500">Sesuai OPD yang terhubung dengan akun Anda.</p>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-5">
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Judul lengkap riset/kajian tahun {entry.batch?.tahun} <span className="text-red-600">*</span>
                </label>
                <div className="space-y-3">
                  {entry.kajian.map((item) => {
                    const checked = form.judul === item.id;
                    return (
                      <label key={item.id} className={[
                        'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all',
                        checked ? 'border-[#8b2a2a] bg-[#fff6f6] shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                      ].join(' ')}>
                        <input type="radio" name="judul-riset" value={item.id} checked={checked} onChange={(e) => updateField('judul', e.target.value)} className="mt-1 h-4 w-4 accent-[#8b2a2a]" />
                        <span className="text-sm leading-6 text-slate-700">
                          {item.judul}
                          <span className="mt-0.5 block text-xs font-semibold text-slate-500">{item.rekomendasi.length} poin rekomendasi</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {renderInputError('judul')}
              </div>
            </section>
          )}

          {step === 3 && selectedTitle && (
            <section className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#f0d8d8] bg-[#fff8f8] p-4 sm:p-5">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#7f1d1d]">Judul lengkap riset/kajian</p>
                  <h2 className="m-0 text-base font-bold leading-6 text-slate-800">{selectedTitle.judul}</h2>
                  <p className="mb-0 mt-2 text-xs text-slate-500">Isi hasil monitoring untuk setiap poin rekomendasi di bawah.</p>
                </div>

                {selectedTitle.rekomendasi.map((point, index) => {
                  const response = form.rekomendasi[index] || EMPTY_REKOMENDASI;
                  const errorKey = (field) => `rekomendasi-${index}-${field}`;
                  return (
                    <article key={point.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-4 flex sm:mb-5 items-start gap-3">
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#8b2a2a] text-sm font-bold text-white">{index + 1}</span>
                        <div>
                          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7f1d1d]">Poin rekomendasi {index + 1}</p>
                          <h3 className="m-0 text-sm font-semibold leading-6 text-slate-800">{point.judul}</h3>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                          <div className="mb-3">
                            <p className="mb-1 text-sm font-semibold text-slate-700">Bukti tindak lanjut</p>
                            <p className="m-0 text-xs text-slate-500">Opsional · Maksimal 20 MB · PDF, JPG, PNG, atau dokumen pendukung</p>
                          </div>
                          <button type="button" onClick={() => fileInputRefs.current[index]?.click()}
                            className="inline-flex items-center justify-center rounded-xl border border-[#8b2a2a] bg-white px-4 py-2.5 text-sm font-semibold text-[#8b2a2a] transition hover:bg-red-50">
                            {response.fileName ? 'Ganti file' : 'Tambahkan file'}
                          </button>
                          <input ref={(element) => { fileInputRefs.current[index] = element; }} type="file" className="hidden"
                            onChange={(e) => handleFileChange(e, index)} accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" />
                          {response.fileName && (
                            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                              <div className="font-semibold">{response.fileName}</div>
                              <div className="text-emerald-700">{response.fileSize || 'Sudah diunggah sebelumnya'}</div>
                            </div>
                          )}
                          {errors[`file-${index}`] && <p className="mt-2 text-xs font-medium text-red-600">{errors[`file-${index}`]}</p>}
                        </div>

                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-700">Hasil monitoring <span className="text-red-600">*</span></p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {['Sudah', 'Belum'].map((option) => (
                              <label key={option} className={[
                                'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition',
                                response.monitoring === option ? 'border-[#8b2a2a] bg-[#fff6f6]' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              ].join(' ')}>
                                <input type="radio" name={`monitoring-${index}`} value={option} checked={response.monitoring === option}
                                  onChange={(e) => updateRecommendation(index, 'monitoring', e.target.value)} className="h-4 w-4 accent-[#8b2a2a]" />
                                <span className="text-sm font-medium text-slate-700">{option}</span>
                              </label>
                            ))}
                          </div>
                          {renderInputError(errorKey('monitoring'))}
                        </div>

                        {[
                          ['uraian', 'Uraian hasil monitoring', 'Contoh: Sensor telah dipasang di tiga tempek dan data debit dipakai untuk menyusun jadwal irigasi.'],
                          ['kendala', 'Kendala pelaksanaan rekomendasi', 'Contoh: Integrasi format data dan jadwal kalibrasi sensor masih perlu disepakati.'],
                          ['manfaat', 'Manfaat kajian', 'Contoh: Pembagian air lebih terukur dan penggunaan air pada petak uji menjadi lebih efisien.']
                        ].map(([field, label, placeholder]) => (
                          <div key={field}>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">{label} <span className="text-red-600">*</span></label>
                            <textarea rows="3" value={response[field]} onChange={(e) => updateRecommendation(index, field, e.target.value)}
                              className="input-base resize-none" placeholder={placeholder} aria-invalid={Boolean(errors[errorKey(field)])} />
                            {renderInputError(errorKey(field))}
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
                {!selectedTitle.rekomendasi.length && <p className="text-sm text-slate-500">Kajian ini belum memiliki poin rekomendasi.</p>}
              </div>
            </section>
          )}

          {errors.submit && <p role="alert" className="m-0 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errors.submit}</p>}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
            {step > 1 ? (
              <button type="button" onClick={handleBack} disabled={sending}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Kembali
              </button>
            ) : <div />}
            {step < 3 ? (
              <button type="button" onClick={handleNext}
                className="inline-flex items-center justify-center rounded-xl bg-[#8b2a2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6b1414]">
                Berikutnya
              </button>
            ) : (
              <button type="submit" disabled={sending || !selectedTitle?.rekomendasi.length}
                className="inline-flex items-center justify-center rounded-xl bg-[#8b2a2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6b1414] disabled:opacity-60">
                {sending ? 'Mengirim…' : 'Kirim'}
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white">✓</div>
          <h2 className="text-xl font-black text-emerald-800">Form Monev Berhasil Dikirim</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-700">
            Terima kasih, {form.nama}. Data monitoring untuk judul <span className="font-semibold">{selectedTitle?.judul}</span> telah tercatat dan menunggu verifikasi BRIDA.
          </p>
          <button type="button" onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFiles({});
            setErrors({});
            setForm((prev) => ({ ...prev, judul: '', rekomendasi: [] }));
            onSubmitted();
          }}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Isi Form Lagi
          </button>
        </div>
      )}
    </Shell>
  );
}
