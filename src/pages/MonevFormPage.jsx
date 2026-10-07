import { useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useMonev } from '../context/MonevContext.jsx';

const EMPTY_REKOMENDASI = {
  monitoring: '',
  uraian: '',
  kendala: '',
  manfaat: '',
  fileName: '',
  fileSize: ''
};

/** Nama & OPD diisi otomatis dari akun yang login (data user di backend). */
function initialForm(user, kajianList) {
  const instansi = user?.instansi || '';
  const opdTerdaftar = kajianList.some((item) => item.opd === instansi);
  return {
    nama: user?.nama || '',
    nip: '',
    opd: opdTerdaftar ? instansi : '',
    judul: '',
    rekomendasi: []
  };
}

export default function MonevFormPage() {
  const { user } = useAuth();
  const { addMonev, kajianList, canManage } = useMonev();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => initialForm(user, kajianList));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRefs = useRef({});

  const selectedTitle = useMemo(
    () => kajianList.find((item) => item.id === form.judul) || null,
    [form.judul, kajianList]
  );
  const semuaOpd = [...new Set(kajianList.map((item) => item.opd))].sort((a, b) => a.localeCompare(b));
  // Akun OPD terkunci pada instansinya sendiri; pengelola Monev boleh memilih OPD mana pun.
  const opdTerkunci = !canManage;
  const opdOptions = opdTerkunci ? semuaOpd.filter((opd) => opd === user?.instansi) : semuaOpd;
  const judulUntukOpd = kajianList.filter((item) => item.opd === form.opd);

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'opd') {
        next.judul = '';
        next.rekomendasi = [];
      } else if (field === 'judul') {
        const title = kajianList.find((item) => item.id === value);
        next.rekomendasi = title?.rekomendasi.map(() => ({ ...EMPTY_REKOMENDASI })) || [];
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: '', ...(field === 'opd' ? { judul: '' } : {}) }));
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
      if (!value || (typeof value === 'string' && !value.trim())) {
        nextErrors[field] = 'Field ini wajib diisi.';
      }
    });

    return nextErrors;
  };

  const handleNext = () => {
    if (step === 1) {
      const nextErrors = validateRequired(['nama', 'nip', 'opd']);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }
    }

    if (step === 2) {
      const nextErrors = validateRequired(['judul']);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFileChange = (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, [`file-${index}`]: 'Ukuran file maksimal 10 MB.' }));
      event.target.value = '';
      return;
    }

    setErrors((prev) => ({ ...prev, [`file-${index}`]: '' }));
    setForm((prev) => ({
      ...prev,
      rekomendasi: prev.rekomendasi.map((item, itemIndex) => itemIndex === index ? {
        ...item,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      } : item)
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    form.rekomendasi.forEach((item, index) => {
      ['monitoring', 'uraian', 'kendala', 'manfaat'].forEach((field) => {
        if (!item[field] || !item[field].trim()) {
          nextErrors[`rekomendasi-${index}-${field}`] = 'Field ini wajib diisi.';
        }
      });
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      addMonev({
        nama: form.nama,
        nip: form.nip,
        opd: form.opd,
        risetKode: selectedTitle.risetKode || '',
        judul: selectedTitle.judul,
        rekomendasi: form.rekomendasi.map((response, index) => ({
          judul: selectedTitle.rekomendasi[index].judul,
          ...response
        }))
      });
    } catch (error) {
      setErrors({ submit: error.message });
      return;
    }
    setSubmitted(true);
  };

  const renderInputError = (field) =>
    errors[field] ? <p className="mt-1 text-xs font-medium text-red-600">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-[#6b1414] via-[#7f1d1d] to-[#8b2a2a] px-5 py-6 text-white sm:px-8 lg:px-10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-100">Monitoring & Evaluasi</p>
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-50">
                Tahun 2025
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              FORM MONEV HASIL RISET/KAJIAN TAHUN 2025
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-red-50/90 sm:text-base">
              Form ini digunakan untuk memantau tindak lanjut rekomendasi hasil riset atau kajian yang telah ditetapkan oleh instansi terkait.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-8 lg:px-10">
            <div className="mb-8 flex flex-wrap gap-3">
              {[1, 2, 3].map((item) => {
                const active = item === step;
                const complete = item < step;

                return (
                  <div key={item} className="flex items-center gap-2">
                    <div
                      className={[
                        'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition',
                        active
                          ? 'border-[#8b2a2a] bg-[#8b2a2a] text-white shadow-md'
                          : complete
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 bg-slate-100 text-slate-500'
                      ].join(' ')}
                    >
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
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Nama Lengkap <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.nama}
                          onChange={(e) => updateField('nama', e.target.value)}
                          className="input-base"
                          placeholder="Masukkan nama lengkap"
                          aria-invalid={Boolean(errors.nama)}
                        />
                        {renderInputError('nama')}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Nomor Induk Pegawai (NIP) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.nip}
                          onChange={(e) => updateField('nip', e.target.value)}
                          className="input-base"
                          placeholder="Contoh: 198812342024021001"
                          aria-invalid={Boolean(errors.nip)}
                        />
                        {renderInputError('nip')}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Nama OPD <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={form.opd}
                          onChange={(e) => updateField('opd', e.target.value)}
                          className="input-base"
                          disabled={opdTerkunci}
                          aria-invalid={Boolean(errors.opd)}
                        >
                          <option value="">Pilih OPD</option>
                          {opdOptions.map((opd) => (
                            <option key={opd} value={opd}>{opd}</option>
                          ))}
                        </select>
                        {renderInputError('opd')}
                        {opdTerkunci && opdOptions.length === 0 && (
                          <p className="mt-1 text-xs font-medium text-slate-500">Belum ada kajian Monev untuk {user?.instansi || 'instansi Anda'}. Hubungi Admin atau Pegawai BRIDA.</p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="space-y-5">
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-slate-700">
                        Judul lengkap riset/kajian tahun 2025 <span className="text-red-600">*</span>
                      </label>

                      <div className="space-y-3">
                        {judulUntukOpd.map((item) => {
                          const checked = form.judul === item.id;

                          return (
                            <label
                              key={item.id}
                              className={[
                                'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all',
                                checked
                                  ? 'border-[#8b2a2a] bg-[#fff6f6] shadow-sm'
                                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                              ].join(' ')}
                            >
                              <input
                                type="radio"
                                name="judul-riset"
                                value={item.id}
                                checked={checked}
                                onChange={(e) => updateField('judul', e.target.value)}
                                className="mt-1 h-4 w-4 accent-[#8b2a2a]"
                              />
                              <span className="text-sm leading-6 text-slate-700">
                                {item.judul}
                                {item.risetKode && <span className="mt-0.5 block text-xs font-semibold text-slate-500">{item.risetKode}</span>}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      {judulUntukOpd.length === 0 && (
                        <p className="mt-3 text-sm text-slate-500">Belum ada kajian yang terhubung dengan OPD ini.</p>
                      )}
                      {renderInputError('judul')}
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="space-y-6">
                    {selectedTitle && (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-[#f0d8d8] bg-[#fff8f8] p-5">
                          <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#7f1d1d]">
                            Judul lengkap riset/kajian
                          </p>
                          <h2 className="m-0 text-base font-bold leading-6 text-slate-800">{selectedTitle.judul}</h2>
                          <p className="mb-0 mt-2 text-xs text-slate-500">Isi hasil monitoring untuk setiap poin rekomendasi di bawah.</p>
                        </div>

                        {selectedTitle.rekomendasi.map((point, index) => {
                          const response = form.rekomendasi[index] || EMPTY_REKOMENDASI;
                          const errorKey = (field) => `rekomendasi-${index}-${field}`;

                          return (
                            <article key={point.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <div className="mb-5 flex items-start gap-3">
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
                                    <p className="m-0 text-xs text-slate-500">Opsional · Maksimal 10 MB · PDF, JPG, PNG, atau dokumen pendukung</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefs.current[index]?.click()}
                                    className="inline-flex items-center justify-center rounded-xl border border-[#8b2a2a] bg-white px-4 py-2.5 text-sm font-semibold text-[#8b2a2a] transition hover:bg-red-50"
                                  >
                                    Tambahkan file
                                  </button>
                                  <input
                                    ref={(element) => { fileInputRefs.current[index] = element; }}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, index)}
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  />
                                  {response.fileName && (
                                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                                      <div className="font-semibold">{response.fileName}</div>
                                      <div className="text-emerald-700">{response.fileSize}</div>
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

                                <div>
                                  <label className="mb-2 block text-sm font-semibold text-slate-700">Uraian hasil monitoring <span className="text-red-600">*</span></label>
                                  <textarea rows="3" value={response.uraian} onChange={(e) => updateRecommendation(index, 'uraian', e.target.value)}
                                    className="input-base resize-none" placeholder="Contoh: Sensor telah dipasang di tiga tempek dan data debit dipakai untuk menyusun jadwal irigasi."
                                    aria-invalid={Boolean(errors[errorKey('uraian')])} />
                                  {renderInputError(errorKey('uraian'))}
                                </div>

                                <div>
                                  <label className="mb-2 block text-sm font-semibold text-slate-700">Kendala pelaksanaan rekomendasi <span className="text-red-600">*</span></label>
                                  <textarea rows="3" value={response.kendala} onChange={(e) => updateRecommendation(index, 'kendala', e.target.value)}
                                    className="input-base resize-none" placeholder="Contoh: Integrasi format data dan jadwal kalibrasi sensor masih perlu disepakati."
                                    aria-invalid={Boolean(errors[errorKey('kendala')])} />
                                  {renderInputError(errorKey('kendala'))}
                                </div>

                                <div>
                                  <label className="mb-2 block text-sm font-semibold text-slate-700">Manfaat kajian <span className="text-red-600">*</span></label>
                                  <textarea rows="3" value={response.manfaat} onChange={(e) => updateRecommendation(index, 'manfaat', e.target.value)}
                                    className="input-base resize-none" placeholder="Contoh: Pembagian air lebih terukur dan penggunaan air pada petak uji menjadi lebih efisien."
                                    aria-invalid={Boolean(errors[errorKey('manfaat')])} />
                                  {renderInputError(errorKey('manfaat'))}
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                )}

                {errors.submit && <p role="alert" className="m-0 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errors.submit}</p>}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Kembali
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center rounded-xl bg-[#8b2a2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6b1414]"
                    >
                      Berikutnya
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-[#8b2a2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6b1414]"
                    >
                      Kirim
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white">✓</div>
                <h2 className="text-xl font-black text-emerald-800">Form Monev Berhasil Dikirim</h2>
                <p className="mt-3 text-sm leading-6 text-emerald-700">
                  Terima kasih, {form.nama}. Data monitoring untuk judul <span className="font-semibold">{selectedTitle?.judul}</span> telah tercatat dan siap ditindaklanjuti.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setForm(initialForm(user, kajianList));
                    setErrors({});
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Isi Form Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
