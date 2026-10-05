import { useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import SmartImage from './SmartImage.jsx';
import { ErrorState, SkeletonGrid } from './AsyncState.jsx';
import { useMutation } from '../hooks/useData.js';
import { useNewsDetail } from '../hooks/useNews.js';
import { NEWS_STATUS, newsService, validateNewsForm } from '../services/newsService.js';
import { errorMessage } from '../services/api.js';

const KOSONG = { judul: '', kategoriId: '', konten: '', sumber: '', status: 'draft', cover: null };

/** Form tulis/sunting berita. Saat menyunting, data terbaru diambil ulang dari GET /v1/news/:id. */
export default function NewsFormModal({ newsId, categories, onClose, onSaved }) {
  const detail = useNewsDetail(newsId);
  const isCreate = !newsId;

  let body;
  if (isCreate) {
    body = <NewsForm initial={KOSONG} categories={categories} onSaved={onSaved} onCancel={onClose} />;
  } else if (detail.loading && !detail.data) {
    body = <SkeletonGrid count={3} className="flex flex-col gap-4" itemClassName="h-14" />;
  } else if (detail.error && !detail.data) {
    body = <ErrorState compact error={detail.error} onRetry={detail.reload} title="Gagal memuat berita" />;
  } else {
    const n = detail.data;
    body = (
      <NewsForm
        key={n.id}
        newsId={n.id}
        coverUrl={n.gambar}
        initial={{ judul: n.judul, kategoriId: n.kategoriId, konten: n.konten, sumber: n.sumber, status: n.status, cover: null }}
        categories={categories}
        onSaved={onSaved}
        onCancel={onClose}
      />
    );
  }

  return (
    <Modal title={isCreate ? 'Tulis berita baru' : 'Sunting berita'} wide onClose={onClose}>
      {body}
    </Modal>
  );
}

function NewsForm({ newsId, coverUrl, initial, categories, onSaved, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const isCreate = !newsId;
  const simpan = useMutation((data) => (isCreate ? newsService.create(data) : newsService.update(newsId, data)));

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function submit(e) {
    e.preventDefault();
    const v = validateNewsForm(form, { isCreate });
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      const saved = await simpan.mutate(form);
      onSaved(saved, isCreate);
    } catch (err) {
      if (err?.status === 409) setErrors({ judul: 'Sudah ada berita dengan judul serupa.' });
    }
  }

  const serverError = simpan.error && simpan.error.status !== 409 ? errorMessage(simpan.error) : '';

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-x-4.5 sm:grid-cols-2">
        <Field label="Judul berita" error={errors.judul} full>
          <input className="input-base" value={form.judul} maxLength={255} onChange={(e) => set('judul', e.target.value)} />
        </Field>

        <Field label="Kategori" error={errors.kategoriId}>
          <select className="input-base" value={form.kategoriId} onChange={(e) => set('kategoriId', e.target.value)}>
            <option value="">Pilih kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
          </select>
        </Field>

        <Field label="Status" error={errors.status}>
          <select className="input-base" value={form.status} onChange={(e) => set('status', e.target.value)}>
            {Object.entries(NEWS_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>

        <Field label="Sumber (opsional)" error={errors.sumber} full>
          <input className="input-base" value={form.sumber} maxLength={255} onChange={(e) => set('sumber', e.target.value)}
            placeholder="Contoh: Humas Pemkab Buleleng" />
        </Field>

        <Field label={isCreate ? 'Gambar sampul (JPG/PNG, maks. 5 MB)' : 'Ganti gambar sampul (opsional)'} error={errors.cover} full>
          <div className="flex flex-wrap items-center gap-3">
            {!isCreate && coverUrl && !form.cover && (
              <SmartImage src={coverUrl} alt="Sampul saat ini" className="h-16 w-28 rounded-lg border border-line" />
            )}
            <input type="file" accept="image/jpeg,image/png" className="input-base flex-1"
              onChange={(e) => set('cover', e.target.files?.[0] || null)} />
          </div>
        </Field>

        <Field label="Isi berita (satu paragraf per baris)" error={errors.konten} full>
          <textarea className="input-base min-h-[180px]" value={form.konten} onChange={(e) => set('konten', e.target.value)} />
        </Field>
      </div>

      {serverError && (
        <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-lg border border-danger-bg bg-danger-bg px-3.5 py-3 text-[.84rem] text-[#7F1D1D]">
          <Icon name="alert" size={17} className="mt-0.5 flex-none text-danger" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-2.5 border-t border-line pt-4">
        <button type="button" onClick={onCancel} disabled={simpan.loading}
          className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-1 disabled:opacity-50">
          Batal
        </button>
        <button type="submit" disabled={simpan.loading}
          className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
          {simpan.loading ? 'Menyimpan…' : isCreate ? 'Simpan berita' : 'Simpan perubahan'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, full, children }) {
  return (
    <label className={`mb-4 block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-[.84rem] font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[.78rem] font-semibold text-danger">{error}</span>}
    </label>
  );
}
