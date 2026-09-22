import { useMemo, useRef, useState } from 'react';

const OPD_OPTIONS = [
  'Dinas Kebudayaan dan Pariwisata',
  'Badan Perencanaan Pembangunan Daerah (Bappeda)',
  'Dinas Pendidikan',
  'Dinas Komunikasi dan Informatika',
  'Dinas Kesehatan',
  'Dinas Pertanian',
  'Dinas PUPR',
  'Dinas Sosial'
];

const JUDUL_OPTIONS = [
  {
    value: 'kajian-1',
    label: 'Kajian Efektivitas Program Desa Wisata Berbasis Budaya dalam Meningkatkan Kunjungan Wisatawan',
    rekomendasi:
      'Rekomendasi utama: penguatan koordinasi antar OPD dalam pengelolaan desa wisata, penyesuaian standar promosi digital, serta pemetaan kebutuhan fasilitasi UMKM lokal. Kajian menyoroti perlunya dukungan pendampingan kapasitas pelaku usaha agar dampak ekonomi lebih merata.'
  },
  {
    value: 'kajian-2',
    label: 'Analisis Strategi Peningkatan Literasi Digital Masyarakat Desa untuk Mendukung Transformasi Digital Daerah',
    rekomendasi:
      'Rekomendasi utama: pengembangan modul pelatihan literasi digital yang terstruktur, pembangunan sarana akses internet yang merata, dan integrasi program pelatihan dengan kegiatan UMKM serta layanan administrasi publik. Kajian juga menegaskan pentingnya kolaborasi dengan sekolah dan perangkat desa.'
  },
  {
    value: 'kajian-3',
    label: 'Evaluasi Dampak Kebijakan Pemberdayaan Kewirausahaan Pemuda terhadap Pertumbuhan Ekonomi Lokal',
    rekomendasi:
      'Rekomendasi utama: perluasan pendampingan usaha pasca pelatihan, evaluasi kelayakan bantuan modal, serta pembentukan jaringan kemitraan dengan pelaku industri lokal. Hasil kajian menunjukkan bahwa keberlanjutan program sangat tergantung pada mentoring dan akses pasar.'
  },
  {
    value: 'kajian-4',
    label: 'Kajian Kebutuhan Infrastruktur Pendukung Kesehatan Lingkungan di Wilayah Perkotaan dan Pedesaan',
    rekomendasi:
      'Rekomendasi utama: prioritas pembangunan saluran drainase, pengelolaan sampah terpadu, dan intervensi sanitasi berbasis komunitas. Kajian merekomendasikan pendekatan berbasis wilayah dengan pemantauan berkala untuk memastikan efektivitas perlindungan kesehatan masyarakat.'
  }
];

const INITIAL_FORM = {
  nama: '',
  nip: '',
  opd: '',
  judul: '',
  monitoring: '',
  uraian: '',
  kendala: '',
  manfaat: '',
  fileName: '',
  fileSize: ''
};

export default function MonevFormPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const selectedTitle = useMemo(
    () => JUDUL_OPTIONS.find((item) => item.value === form.judul) || null,
    [form.judul]
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, file: 'Ukuran file maksimal 10 MB.' }));
      event.target.value = '';
      return;
    }

    setErrors((prev) => ({ ...prev, file: '' }));
    updateField('fileName', file.name);
    updateField('fileSize', `${(file.size / 1024 / 1024).toFixed(2)} MB`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateRequired(['monitoring', 'uraian', 'kendala', 'manfaat']);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
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
                      {item === 1 ? 'Data diri' : item === 2 ? 'Judul riset' : 'Evaluasi'}
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
                          aria-invalid={Boolean(errors.opd)}
                        >
                          <option value="">Pilih OPD</option>
                          {OPD_OPTIONS.map((opd) => (
                            <option key={opd} value={opd}>{opd}</option>
                          ))}
                        </select>
                        {renderInputError('opd')}
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
                        {JUDUL_OPTIONS.map((item) => {
                          const checked = form.judul === item.value;

                          return (
                            <label
                              key={item.value}
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
                                value={item.value}
                                checked={checked}
                                onChange={(e) => updateField('judul', e.target.value)}
                                className="mt-1 h-4 w-4 accent-[#8b2a2a]"
                              />
                              <span className="text-sm leading-6 text-slate-700">{item.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {renderInputError('judul')}
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="space-y-6">
                    {selectedTitle && (
                      <div className="rounded-2xl border border-[#f0d8d8] bg-[#fff8f8] p-5">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7f1d1d]">
                          Rincian rekomendasi kajian
                        </p>
                        <p className="text-sm leading-7 text-slate-700">{selectedTitle.rekomendasi}</p>
                      </div>
                    )}

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Upload bukti dukung tindak lanjut rekomendasi kajian
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center justify-center rounded-xl border border-[#8b2a2a] bg-white px-4 py-2.5 text-sm font-semibold text-[#8b2a2a] transition hover:bg-red-50"
                        >
                          Tambahkan file
                        </button>
                        <span className="text-xs text-slate-500">Maksimal 10 MB · PDF, JPG, PNG, atau dokumen pendukung</span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />

                      {form.fileName && (
                        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                          <div className="font-semibold">{form.fileName}</div>
                          <div className="text-emerald-700">{form.fileSize}</div>
                        </div>
                      )}

                      {errors.file && <p className="mt-2 text-xs font-medium text-red-600">{errors.file}</p>}
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-semibold text-slate-700">
                        Hasil Monitoring <span className="text-red-600">*</span>
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {['Sudah', 'Belum'].map((option) => (
                          <label
                            key={option}
                            className={[
                              'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition',
                              form.monitoring === option
                                ? 'border-[#8b2a2a] bg-[#fff6f6]'
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            ].join(' ')}
                          >
                            <input
                              type="radio"
                              name="monitoring"
                              value={option}
                              checked={form.monitoring === option}
                              onChange={(e) => updateField('monitoring', e.target.value)}
                              className="h-4 w-4 accent-[#8b2a2a]"
                            />
                            <span className="text-sm font-medium text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      {renderInputError('monitoring')}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Uraian Hasil Monitoring <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows="4"
                        value={form.uraian}
                        onChange={(e) => updateField('uraian', e.target.value)}
                        className="input-base resize-none"
                        placeholder="Jelaskan kondisi, perkembangan, dan bukti tindak lanjut dari rekomendasi kajian..."
                        aria-invalid={Boolean(errors.uraian)}
                      />
                      {renderInputError('uraian')}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Kendala Pelaksanaan Rekomendasi <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows="4"
                        value={form.kendala}
                        onChange={(e) => updateField('kendala', e.target.value)}
                        className="input-base resize-none"
                        placeholder="Tuliskan kendala yang dihadapi, seperti pembiayaan, koordinasi, sumber daya, atau perizinan..."
                        aria-invalid={Boolean(errors.kendala)}
                      />
                      {renderInputError('kendala')}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Manfaat Kajian <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows="4"
                        value={form.manfaat}
                        onChange={(e) => updateField('manfaat', e.target.value)}
                        className="input-base resize-none"
                        placeholder="Jelaskan manfaat kajian terhadap program, layanan publik, atau peningkatan kinerja OPD..."
                        aria-invalid={Boolean(errors.manfaat)}
                      />
                      {renderInputError('manfaat')}
                    </div>
                  </section>
                )}

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
                  Terima kasih, {form.nama}. Data monitoring untuk judul <span className="font-semibold">{selectedTitle?.label}</span> telah tercatat dan siap ditindaklanjuti.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setForm(INITIAL_FORM);
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
