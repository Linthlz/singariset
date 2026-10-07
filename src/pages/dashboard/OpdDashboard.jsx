import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import AsyncState, { EmptyState, SkeletonGrid } from '../../components/AsyncState.jsx';
import MonevFormPage from '../MonevFormPage.jsx';
import MonevModule from './MonevModule.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useMyMonevEntries } from '../../hooks/useMonev.js';
import { errorMessage } from '../../services/api.js';
import { ENTRY_STATUS, entriesToRecords, monevService } from '../../services/monevService.js';
import { tanggal } from '../../lib/format.js';

const MENU_ITEMS = {
  'kelola-monev': { id: 'kelola-monev', label: 'Kelola Monev', ikon: 'chart' },
  'isi-monev': { id: 'isi-monev', label: 'Isi Form Monev', ikon: 'doc' },
  'riwayat-monev': { id: 'riwayat-monev', label: 'Riwayat Monev', ikon: 'clock' }
};

// Pegawai BRIDA & admin mengelola Monev; akun OPD mengisi dan memperbarui laporan instansinya.
const MENU_PER_ROLE = {
  'pegawai-brida': ['kelola-monev'],
  admin: ['kelola-monev'],
  opd: ['isi-monev', 'riwayat-monev']
};

const FIELD_JAWABAN = [
  ['uraian', 'Uraian hasil monitoring'],
  ['kendala', 'Kendala pelaksanaan rekomendasi'],
  ['manfaat', 'Manfaat kajian']
];

function ringkasan(record) {
  const sudah = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
  return { sudah, total: record.rekomendasi.length };
}

function EditMonev({ record, onClose, onSaved }) {
  const toast = useToast();
  const [draft, setDraft] = useState(() => record.rekomendasi.map((item) => ({ ...item, monitoring: item.terisi ? item.monitoring : '' })));
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const ubah = (index, field, value) => {
    setDraft((list) => list.map((item, i) => i === index ? { ...item, [field]: value } : item));
    setErrors((prev) => ({ ...prev, [`${index}-${field}`]: '' }));
  };

  function pilihFile(event, index) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [`${index}-file`]: 'Ukuran file maksimal 20 MB.' }));
      event.target.value = '';
      return;
    }
    setErrors((prev) => ({ ...prev, [`${index}-file`]: '' }));
    setFiles((prev) => ({ ...prev, [draft[index].id]: file }));
    setDraft((list) => list.map((item, i) => i === index ? { ...item, fileName: file.name, fileUrl: '' } : item));
  }

  async function simpan(event) {
    event.preventDefault();
    const nextErrors = {};
    draft.forEach((item, index) => {
      ['monitoring', 'uraian', 'kendala', 'manfaat'].forEach((field) => {
        if (!String(item[field] || '').trim()) nextErrors[`${index}-${field}`] = 'Field ini wajib diisi.';
      });
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setSaving(true);
    try {
      await monevService.savePoints(draft, files);
      toast('success', 'Laporan Monev diperbarui', record.judul);
      onSaved();
      onClose();
    } catch (error) {
      toast('danger', 'Gagal memperbarui', errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const galat = (key) => errors[key] && <p className="m-0 mt-1 text-xs font-medium text-danger">{errors[key]}</p>;

  return (
    <form onSubmit={simpan} className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
      {draft.map((item, index) => (
        <fieldset key={item.id} className="m-0 rounded-lg border border-line bg-surface-1 p-4">
          <legend className="px-1 text-[.84rem] font-semibold text-ink">{index + 1}. {item.judul}</legend>
          <div className="mb-3 flex flex-wrap gap-2">
            {['Sudah', 'Belum'].map((option) => (
              <label key={option} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[.8rem] font-semibold ${item.monitoring === option ? 'border-maroon-800 bg-maroon-50 text-maroon-800' : 'border-line bg-white text-ink-2'}`}>
                <input type="radio" name={`edit-${record.id}-${index}`} value={option} checked={item.monitoring === option}
                  onChange={(e) => ubah(index, 'monitoring', e.target.value)} className="accent-maroon-800" />
                {option} dilaksanakan
              </label>
            ))}
          </div>
          {galat(`${index}-monitoring`)}
          <div className="grid gap-3 md:grid-cols-3">
            {FIELD_JAWABAN.map(([field, label]) => (
              <label key={field} className="flex flex-col gap-1.5 text-[.76rem] font-semibold text-ink-2">
                {label}
                <textarea rows={3} value={item[field] || ''} onChange={(e) => ubah(index, field, e.target.value)} className="input-base resize-y" />
                {galat(`${index}-${field}`)}
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[.78rem]">
            <label className="cursor-pointer rounded-lg border border-line-strong bg-white px-3 py-1.5 font-semibold text-maroon-800 hover:border-maroon-800">
              {item.fileName ? 'Ganti bukti' : 'Tambahkan bukti'}
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" onChange={(e) => pilihFile(e, index)} />
            </label>
            {item.fileName
              ? <span className="flex items-center gap-1.5 font-semibold text-info"><Icon name="doc" size={14} />{item.fileName}</span>
              : <span className="text-ink-3">Belum ada bukti tindak lanjut.</span>}
          </div>
          {galat(`${index}-file`)}
        </fieldset>
      ))}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-line-strong px-4 py-2 text-[.82rem] font-semibold text-ink-2 hover:bg-surface-1">Batal</button>
        <button type="submit" disabled={saving} className="rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600 disabled:opacity-60">{saving ? 'Menyimpan…' : 'Simpan perubahan'}</button>
      </div>
    </form>
  );
}

function RiwayatMonev() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useMyMonevEntries();
  const [editId, setEditId] = useState(null);
  const riwayat = entriesToRecords(data || []);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-line bg-white p-5.5">
        <h2 className="m-0 text-[1.05rem]">Riwayat input Monev</h2>
        <p className="mt-1 text-[.84rem] text-ink-3">Hasil monitoring instansi Anda. Perbarui jawaban bila ada perkembangan tindak lanjut, selama laporan belum diverifikasi BRIDA.</p>

        <div className="mt-5">
          <AsyncState loading={loading} error={error} isEmpty={riwayat.length === 0} onRetry={reload}
            skeleton={<SkeletonGrid count={2} className="flex flex-col gap-3" itemClassName="h-20" />}
            empty={<EmptyState icon="clock" title="Belum ada laporan Monev" text={error?.status === 400 ? 'Akun Anda belum terhubung ke OPD.' : `Belum ada kajian Monev untuk ${user.instansi}.`} />}>
            <div className="flex flex-col gap-3">
              {riwayat.map((record) => {
                const { sudah, total } = ringkasan(record);
                const selesai = total > 0 && sudah === total;
                const editing = editId === record.id;
                const st = ENTRY_STATUS[record.status] || ENTRY_STATUS.pending;
                const bolehEdit = record.status !== 'verified' && record.batch?.status !== 'closed';
                return (
                  <article key={record.id} className={`rounded-xl border p-4 transition ${editing ? 'border-maroon-100' : 'border-line hover:border-maroon-100 hover:bg-surface-1'}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="m-0 text-[.9rem] leading-snug">{record.judul}</h3>
                        <p className="m-0 mt-1.5 text-[.76rem] text-ink-3">
                          Monev {record.batch?.tahun} · {record.nama ? `Diisi ${record.nama}` : 'Belum diisi'}{record.tanggal ? ` · ${tanggal(String(record.tanggal).slice(0, 10))}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-none flex-wrap items-center gap-2 self-start">
                        <span className={`rounded-full px-2.5 py-1 text-[.7rem] font-bold ${st.badge}`}>{st.label}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[.7rem] font-bold ${selesai ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                          {sudah} dari {total} rekomendasi dilaksanakan
                        </span>
                        {bolehEdit && !editing && total > 0 && (
                          <button type="button" onClick={() => setEditId(record.id)}
                            className="rounded-lg border border-line-strong px-3 py-1.5 text-[.76rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                            Perbarui
                          </button>
                        )}
                      </div>
                    </div>
                    {editing && <EditMonev record={record} onClose={() => setEditId(null)} onSaved={reload} />}
                  </article>
                );
              })}
            </div>
          </AsyncState>
        </div>
      </section>
    </div>
  );
}

const JUDUL = {
  'kelola-monev': ['Monitoring & Evaluasi', () => 'Kelola batch, kajian, dan poin rekomendasi serta tinjau tindak lanjut seluruh OPD'],
  'isi-monev': ['Isi Form Monitoring & Evaluasi', (user) => `${user.instansi} · Form Monev OPD`],
  'riwayat-monev': ['Riwayat Monev', (user) => `${user.instansi} · Riwayat pengajuan Monev`]
};

export default function OpdDashboard() {
  const { user } = useAuth();
  const menu = (MENU_PER_ROLE[user.backendRole] || MENU_PER_ROLE.opd).map((id) => MENU_ITEMS[id]);
  const [active, setActive] = useState(menu[0].id);
  const [title, subtitle] = JUDUL[active];

  return (
    <DashboardLayout menu={menu} active={active} onSelect={setActive} title={title} subtitle={subtitle(user)}>
      {active === 'kelola-monev' && <MonevModule />}
      {active === 'isi-monev' && <MonevFormPage />}
      {active === 'riwayat-monev' && <RiwayatMonev />}
    </DashboardLayout>
  );
}
